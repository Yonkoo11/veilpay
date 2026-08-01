import { createViemHandleClient } from "@iexec-nox/handle";
import { network } from "hardhat";
import { createPublicClient, formatUnits, getAddress, http, type Address, type Hex } from "viem";
import { sepolia } from "viem/chains";
import { SEPOLIA_DEPLOYMENT } from "../src/lib/network.js";

const RECIPIENT_A = SEPOLIA_DEPLOYMENT.owner;
const RECIPIENT_B = getAddress("0x000000000000000000000000000000000000dEaD");
const AMOUNT_A = 1_000_000n;
const AMOUNT_B = 2_000_000n;
const EXPECTED_TOTAL = AMOUNT_A + AMOUNT_B;

const payrollAbi = [
  {
    type: "function", name: "nextBatchId", stateMutability: "view", inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function", name: "owner", stateMutability: "view", inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function", name: "createBatch", stateMutability: "nonpayable",
    inputs: [
      { name: "recipientA", type: "address" }, { name: "encryptedAmountA", type: "bytes32" }, { name: "proofA", type: "bytes" },
      { name: "recipientB", type: "address" }, { name: "encryptedAmountB", type: "bytes32" }, { name: "proofB", type: "bytes" },
    ],
    outputs: [{ name: "batchId", type: "uint256" }],
  },
  {
    type: "function", name: "getBatch", stateMutability: "view",
    inputs: [{ name: "batchId", type: "uint256" }],
    outputs: [
      { name: "recipientA", type: "address" }, { name: "recipientB", type: "address" },
      { name: "allocationA", type: "bytes32" }, { name: "allocationB", type: "bytes32" },
      { name: "total", type: "bytes32" }, { name: "totalPublished", type: "bool" },
    ],
  },
  {
    type: "function", name: "publishTotal", stateMutability: "nonpayable",
    inputs: [{ name: "batchId", type: "uint256" }], outputs: [],
  },
] as const;

type Batch = readonly [Address, Address, Hex, Hex, Hex, boolean];

if (process.env.ALLOW_SEPOLIA_TEST_BATCH !== "1") {
  throw new Error("Refusing the on-chain write without ALLOW_SEPOLIA_TEST_BATCH=1.");
}
if (process.env.ALLOW_SEPOLIA_AGGREGATE_PUBLICATION !== "1") {
  throw new Error("Refusing irreversible disclosure without ALLOW_SEPOLIA_AGGREGATE_PUBLICATION=1.");
}

const connection = await network.getOrCreate<"l1">();
const [wallet] = await connection.viem.getWalletClients();
const publicClient = createPublicClient({ chain: sepolia, transport: http(SEPOLIA_DEPLOYMENT.rpcUrl) });
const chainId = await publicClient.getChainId();
const owner = await publicClient.readContract({
  authorizationList: undefined,
  address: SEPOLIA_DEPLOYMENT.payrollAddress,
  abi: payrollAbi,
  functionName: "owner",
});

if (chainId !== SEPOLIA_DEPLOYMENT.chainId) throw new Error(`Wrong chain ${chainId}.`);
if (getAddress(wallet.account.address) !== SEPOLIA_DEPLOYMENT.owner) throw new Error("The signer is not the configured treasury owner.");
if (getAddress(owner) !== SEPOLIA_DEPLOYMENT.owner) throw new Error("The deployed contract owner does not match public configuration.");

const nox = await createViemHandleClient(wallet, {
  gatewayUrl: SEPOLIA_DEPLOYMENT.noxGatewayUrl,
  smartContractAddress: SEPOLIA_DEPLOYMENT.noxComputeAddress,
  subgraphUrl: SEPOLIA_DEPLOYMENT.noxSubgraphUrl,
});

let nextBatchId = await publicClient.readContract({
  authorizationList: undefined,
  address: SEPOLIA_DEPLOYMENT.payrollAddress,
  abi: payrollAbi,
  functionName: "nextBatchId",
});
let createTransaction: Hex | undefined;

if (nextBatchId === 0n) {
  const [encryptedA, encryptedB] = await Promise.all([
    nox.encryptInput(AMOUNT_A, "uint256", SEPOLIA_DEPLOYMENT.payrollAddress),
    nox.encryptInput(AMOUNT_B, "uint256", SEPOLIA_DEPLOYMENT.payrollAddress),
  ]);
  createTransaction = await wallet.writeContract({
    account: wallet.account,
    chain: wallet.chain,
    address: SEPOLIA_DEPLOYMENT.payrollAddress,
    abi: payrollAbi,
    functionName: "createBatch",
    args: [RECIPIENT_A, encryptedA.handle, encryptedA.handleProof, RECIPIENT_B, encryptedB.handle, encryptedB.handleProof],
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash: createTransaction });
  if (receipt.status !== "success") throw new Error("The payroll batch transaction reverted.");
  nextBatchId = await publicClient.readContract({
    authorizationList: undefined,
    address: SEPOLIA_DEPLOYMENT.payrollAddress,
    abi: payrollAbi,
    functionName: "nextBatchId",
  });
}

if (nextBatchId !== 1n) {
  throw new Error(`Expected exactly one test batch, found nextBatchId=${nextBatchId}.`);
}

let batch = await publicClient.readContract({
  authorizationList: undefined,
  address: SEPOLIA_DEPLOYMENT.payrollAddress,
  abi: payrollAbi,
  functionName: "getBatch",
  args: [0n],
}) as Batch;

if (getAddress(batch[0]) !== RECIPIENT_A || getAddress(batch[1]) !== RECIPIENT_B) {
  throw new Error("Existing batch 0 does not match the approved test recipients.");
}

async function retryValue<T>(label: string, operation: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= 8; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < 8) await new Promise((resolve) => setTimeout(resolve, 5_000));
    }
  }
  throw new Error(`${label} did not resolve after repeated checks.`, { cause: lastError });
}

const [privateA, privateB] = await Promise.all([
  retryValue("Private allocation A", () => nox.decrypt(batch[2])),
  retryValue("Private allocation B", () => nox.decrypt(batch[3])),
]);
if (privateA.value !== AMOUNT_A || privateB.value !== AMOUNT_B) {
  throw new Error("Private allocation values do not match the approved test amounts.");
}

let publishTransaction: Hex | undefined;
if (!batch[5]) {
  publishTransaction = await wallet.writeContract({
    account: wallet.account,
    chain: wallet.chain,
    address: SEPOLIA_DEPLOYMENT.payrollAddress,
    abi: payrollAbi,
    functionName: "publishTotal",
    args: [0n],
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash: publishTransaction });
  if (receipt.status !== "success") throw new Error("The aggregate publication transaction reverted.");
  batch = await publicClient.readContract({
    authorizationList: undefined,
    address: SEPOLIA_DEPLOYMENT.payrollAddress,
    abi: payrollAbi,
    functionName: "getBatch",
    args: [0n],
  }) as Batch;
}

if (!batch[5]) throw new Error("Batch 0 is not marked publicly decryptable.");
const publicTotal = await retryValue("Public aggregate", () => nox.publicDecrypt(batch[4]));
if (publicTotal.value !== EXPECTED_TOTAL) throw new Error("The public aggregate does not match the private allocations.");

console.log(JSON.stringify({
  status: "verified",
  batchId: "0",
  recipientA: RECIPIENT_A,
  recipientB: RECIPIENT_B,
  privateAllocationA: formatUnits(privateA.value, 6),
  privateAllocationB: formatUnits(privateB.value, 6),
  publicTotal: formatUnits(publicTotal.value, 6),
  totalPublished: batch[5],
  createTransaction,
  publishTransaction,
}, null, 2));
