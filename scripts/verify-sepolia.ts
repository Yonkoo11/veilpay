import { createPublicClient, getAddress, http } from "viem";
import { sepolia } from "viem/chains";
import { SEPOLIA_DEPLOYMENT } from "../src/lib/network.js";

const client = createPublicClient({ chain: sepolia, transport: http(SEPOLIA_DEPLOYMENT.rpcUrl) });
const [chainId, receipt, payrollBytecode, noxBytecode, ownerCall, nextBatchIdCall] = await Promise.all([
  client.getChainId(),
  client.getTransactionReceipt({ hash: SEPOLIA_DEPLOYMENT.deploymentTransaction }),
  client.getBytecode({ address: SEPOLIA_DEPLOYMENT.payrollAddress }),
  client.getBytecode({ address: SEPOLIA_DEPLOYMENT.noxComputeAddress }),
  client.call({ to: SEPOLIA_DEPLOYMENT.payrollAddress, data: "0x8da5cb5b" }),
  client.call({ to: SEPOLIA_DEPLOYMENT.payrollAddress, data: "0x8462a7f8" }),
]);

if (!ownerCall.data || ownerCall.data.length < 42) throw new Error("owner() returned malformed data.");
if (!nextBatchIdCall.data) throw new Error("nextBatchId() returned no data.");
const owner = getAddress(`0x${ownerCall.data.slice(-40)}`);
const nextBatchId = BigInt(nextBatchIdCall.data);

if (chainId !== SEPOLIA_DEPLOYMENT.chainId) throw new Error(`Wrong chain: ${chainId}.`);
if (receipt.status !== "success") throw new Error("Deployment receipt is not successful.");
if (!receipt.contractAddress || getAddress(receipt.contractAddress) !== SEPOLIA_DEPLOYMENT.payrollAddress) {
  throw new Error("Deployment receipt contract address does not match the configured address.");
}
if (!payrollBytecode || payrollBytecode === "0x") throw new Error("VeilPayroll bytecode is missing.");
if (!noxBytecode || noxBytecode === "0x") throw new Error("NoxCompute bytecode is missing.");
if (owner !== SEPOLIA_DEPLOYMENT.owner) throw new Error("Configured owner does not match owner().");

console.log(JSON.stringify({
  status: "verified",
  chainId,
  payrollAddress: SEPOLIA_DEPLOYMENT.payrollAddress,
  owner,
  deploymentTransaction: receipt.transactionHash,
  deploymentBlock: receipt.blockNumber.toString(),
  nextBatchId: nextBatchId.toString(),
  noxComputeAddress: SEPOLIA_DEPLOYMENT.noxComputeAddress,
}, null, 2));
