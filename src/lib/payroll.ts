import { createViemHandleClient } from "@iexec-nox/handle";
import { createPublicClient, createWalletClient, custom, formatUnits, http, isAddress, parseUnits, type Address, type Hex } from "viem";
import { sepolia } from "viem/chains";
import { SEPOLIA_DEPLOYMENT } from "./network.ts";

export type RecipientDraft = { name: string; role: string; address: string; amount: string };
export type SubmitStage = "idle" | "connecting" | "encrypting" | "approving" | "confirming" | "processing" | "complete" | "error";
export type RevealStage = "idle" | "connecting" | "reading" | "decrypting" | "complete" | "error";
export type PayrollBatch = readonly [Address, Address, Hex, Hex, Hex, boolean];
export type RecipientHandle = { allocation: "A" | "B"; handle: Hex };
export type AllocationReveal = { account: Address; allocation: "A" | "B"; amount: string; batchId: bigint };
export type DisclosureStage = "idle" | "connecting" | "reading" | "approving" | "confirming" | "decrypting" | "complete" | "error";
export type AggregateDisclosure = { batchId: bigint; published: boolean; amount?: string };

export const payrollAbi = [
  {
    type: "function", name: "createBatch", stateMutability: "nonpayable",
    inputs: [
      { name: "recipientA", type: "address" }, { name: "encryptedAmountA", type: "bytes32" }, { name: "proofA", type: "bytes" },
      { name: "recipientB", type: "address" }, { name: "encryptedAmountB", type: "bytes32" }, { name: "proofB", type: "bytes" },
    ], outputs: [{ name: "batchId", type: "uint256" }],
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

export function parseBatchId(value: string): bigint {
  if (!/^\d+$/.test(value.trim())) throw new Error("Enter a valid batch ID.");
  return BigInt(value.trim());
}

export function describePayrollError(reason: unknown, fallback: string): string {
  const message = reason instanceof Error ? reason.message : "";
  if (/UnknownBatch|0x119a7627/i.test(message)) return "That batch does not exist on Sepolia.";
  if (/TotalAlreadyPublished|0x097bf289/i.test(message)) return "This aggregate is already public.";
  if (/OwnableUnauthorizedAccount|0x118cdaa7/i.test(message)) return "Only the treasury owner can perform this action.";
  if (/user rejected|user denied|4001/i.test(message)) return "The wallet request was rejected.";
  if (/insufficient funds/i.test(message)) return "The connected wallet does not have enough Sepolia ETH.";
  if (/failed to fetch|network error|http request failed/i.test(message)) return "The Sepolia service is temporarily unreachable. Try again.";
  if (/not publicly decryptable/i.test(message)) return "This aggregate is still private.";
  return message && message.length <= 220 ? message : fallback;
}

export function selectRecipientHandle(batch: PayrollBatch, account: Address): RecipientHandle | undefined {
  const normalizedAccount = account.toLowerCase();
  if (batch[0].toLowerCase() === normalizedAccount) return { allocation: "A", handle: batch[2] };
  if (batch[1].toLowerCase() === normalizedAccount) return { allocation: "B", handle: batch[3] };
  return undefined;
}

export function isTreasuryOwner(account: Address): boolean {
  return account.toLowerCase() === SEPOLIA_DEPLOYMENT.owner.toLowerCase();
}

function readPublicConfig() {
  return {
    contractAddress: SEPOLIA_DEPLOYMENT.payrollAddress,
    gatewayUrl: SEPOLIA_DEPLOYMENT.noxGatewayUrl,
    computeAddress: SEPOLIA_DEPLOYMENT.noxComputeAddress,
    subgraphUrl: SEPOLIA_DEPLOYMENT.noxSubgraphUrl,
  };
}

async function connectSepoliaWallet() {
  const ethereum = window.ethereum;
  if (!ethereum) throw new Error("Install or open an Ethereum wallet to continue.");
  const wallet = createWalletClient({ chain: sepolia, transport: custom(ethereum) });
  const [account] = await wallet.requestAddresses();
  if (!account) throw new Error("Connect an Ethereum account to continue.");
  const chainId = await wallet.getChainId();
  if (chainId !== sepolia.id) throw new Error("Switch your wallet to Ethereum Sepolia.");
  return { account, ethereum, wallet };
}

export function validateRecipients(recipients: RecipientDraft[]): string[] {
  const errors: string[] = [];
  if (recipients.length !== 2) errors.push("VeilPay currently requires exactly two recipients.");
  recipients.forEach((recipient, index) => {
    if (!recipient.name.trim()) errors.push(`Recipient ${index + 1} needs a name.`);
    if (!isAddress(recipient.address)) errors.push(`Recipient ${index + 1} needs a valid Ethereum address.`);
    const amount = Number(recipient.amount);
    if (!Number.isFinite(amount) || amount <= 0) errors.push(`Recipient ${index + 1} needs a positive amount.`);
    else if (!/^\d+(\.\d{1,6})?$/.test(recipient.amount.trim())) errors.push(`Recipient ${index + 1} can use at most 6 decimal places.`);
  });
  if (recipients.length === 2 && recipients[0].address.toLowerCase() === recipients[1].address.toLowerCase()) {
    errors.push("Recipients must use different addresses.");
  }
  return errors;
}

export function payrollTotal(recipients: RecipientDraft[]): number {
  return recipients.reduce((total, recipient) => total + (Number(recipient.amount) || 0), 0);
}

export async function submitPayroll(
  recipients: RecipientDraft[],
  onStage: (stage: SubmitStage) => void,
): Promise<`0x${string}`> {
  const { contractAddress, gatewayUrl, computeAddress, subgraphUrl } = readPublicConfig();
  const validation = validateRecipients(recipients);
  if (validation.length) throw new Error(validation[0]);

  onStage("connecting");
  const { account, ethereum, wallet } = await connectSepoliaWallet();
  if (!isTreasuryOwner(account)) {
    throw new Error(`Connect the treasury owner wallet ending ${SEPOLIA_DEPLOYMENT.owner.slice(-6)}.`);
  }
  const nox = await createViemHandleClient(wallet, { gatewayUrl, smartContractAddress: computeAddress, subgraphUrl });

  onStage("encrypting");
  const amountA = await nox.encryptInput(parseUnits(recipients[0].amount, 6), "uint256", contractAddress);
  const amountB = await nox.encryptInput(parseUnits(recipients[1].amount, 6), "uint256", contractAddress);
  onStage("approving");
  const hash = await wallet.writeContract({
    account,
    chain: sepolia,
    address: contractAddress,
    abi: payrollAbi,
    functionName: "createBatch",
    args: [recipients[0].address as `0x${string}`, amountA.handle, amountA.handleProof, recipients[1].address as `0x${string}`, amountB.handle, amountB.handleProof],
  });
  onStage("confirming");
  const publicClient = createPublicClient({ chain: sepolia, transport: custom(ethereum) });
  await publicClient.waitForTransactionReceipt({ hash });
  onStage("processing");
  onStage("complete");
  return hash;
}

export async function revealMyAllocation(
  batchIdInput: string,
  onStage: (stage: RevealStage) => void,
): Promise<AllocationReveal> {
  const batchId = parseBatchId(batchIdInput);
  const { contractAddress, gatewayUrl, computeAddress, subgraphUrl } = readPublicConfig();

  onStage("connecting");
  const { account, ethereum, wallet } = await connectSepoliaWallet();
  onStage("reading");
  const publicClient = createPublicClient({ chain: sepolia, transport: custom(ethereum) });
  const batch = await publicClient.readContract({
    address: contractAddress,
    abi: payrollAbi,
    functionName: "getBatch",
    args: [batchId],
  });
  const recipient = selectRecipientHandle(batch, account);
  if (!recipient) throw new Error("This wallet is not a recipient in that batch.");

  onStage("decrypting");
  const nox = await createViemHandleClient(wallet, { gatewayUrl, smartContractAddress: computeAddress, subgraphUrl });
  const decrypted = await nox.decrypt(recipient.handle);
  if (typeof decrypted.value !== "bigint") throw new Error("Nox returned an unexpected allocation type.");
  onStage("complete");
  return { account, allocation: recipient.allocation, amount: formatUnits(decrypted.value, 6), batchId };
}

export async function inspectAggregateDisclosure(
  batchIdInput: string,
  onStage: (stage: DisclosureStage) => void,
): Promise<AggregateDisclosure> {
  const batchId = parseBatchId(batchIdInput);
  const { contractAddress, gatewayUrl, computeAddress, subgraphUrl } = readPublicConfig();
  const publicClient = createPublicClient({ chain: sepolia, transport: http(SEPOLIA_DEPLOYMENT.rpcUrl) });

  onStage("reading");
  const batch = await publicClient.readContract({
    address: contractAddress,
    abi: payrollAbi,
    functionName: "getBatch",
    args: [batchId],
  });
  if (!batch[5]) {
    onStage("complete");
    return { batchId, published: false };
  }

  onStage("decrypting");
  const readOnlyWallet = createWalletClient({ chain: sepolia, transport: http(SEPOLIA_DEPLOYMENT.rpcUrl) });
  const nox = await createViemHandleClient(readOnlyWallet, { gatewayUrl, smartContractAddress: computeAddress, subgraphUrl });
  const decrypted = await nox.publicDecrypt(batch[4]);
  if (typeof decrypted.value !== "bigint") throw new Error("Nox returned an unexpected aggregate type.");
  onStage("complete");
  return { batchId, published: true, amount: formatUnits(decrypted.value, 6) };
}

export async function publishAggregateTotal(
  batchIdInput: string,
  onStage: (stage: DisclosureStage) => void,
): Promise<Hex> {
  const batchId = parseBatchId(batchIdInput);
  const { contractAddress } = readPublicConfig();

  onStage("connecting");
  const { account, ethereum, wallet } = await connectSepoliaWallet();
  if (!isTreasuryOwner(account)) {
    throw new Error(`Connect the treasury owner wallet ending ${SEPOLIA_DEPLOYMENT.owner.slice(-6)}.`);
  }
  const publicClient = createPublicClient({ chain: sepolia, transport: custom(ethereum) });
  onStage("reading");
  const batch = await publicClient.readContract({
    address: contractAddress,
    abi: payrollAbi,
    functionName: "getBatch",
    args: [batchId],
  });
  if (batch[5]) throw new Error("This aggregate is already public.");

  onStage("approving");
  const hash = await wallet.writeContract({
    account,
    chain: sepolia,
    address: contractAddress,
    abi: payrollAbi,
    functionName: "publishTotal",
    args: [batchId],
  });
  onStage("confirming");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (receipt.status !== "success") throw new Error("The aggregate publication transaction reverted.");
  onStage("complete");
  return hash;
}

declare global {
  interface Window { ethereum?: import("viem").EIP1193Provider }
}
