import "@nomicfoundation/hardhat-toolbox-viem";
import { network } from "hardhat";
import { formatEther, getAddress } from "viem";

const SEPOLIA_CHAIN_ID = 11_155_111;
const NOX_COMPUTE = "0x24Ef36Ec5b626D7DCD09a98F3083c2758F0F77bF";

if (process.env.ALLOW_SEPOLIA_REDEPLOY !== "1") {
  throw new Error("VeilPayroll is already deployed. Set ALLOW_SEPOLIA_REDEPLOY=1 only for an explicitly approved replacement deployment.");
}
const connection = await network.getOrCreate<"l1">();
const publicClient = await connection.viem.getPublicClient();
const [deployer] = await connection.viem.getWalletClients();
const chainId = await publicClient.getChainId();

if (chainId !== SEPOLIA_CHAIN_ID) {
  throw new Error(`Refusing to deploy on chain ${chainId}; expected Ethereum Sepolia (${SEPOLIA_CHAIN_ID}).`);
}

const [balance, noxBytecode] = await Promise.all([
  publicClient.getBalance({ address: deployer.account.address }),
  publicClient.getBytecode({ address: NOX_COMPUTE }),
]);

if (balance === 0n) {
  throw new Error(`Deployer ${deployer.account.address} has no Sepolia ETH.`);
}

if (!noxBytecode || noxBytecode === "0x") {
  throw new Error(`Official NoxCompute bytecode is missing at ${NOX_COMPUTE}; refusing to deploy.`);
}

console.log(JSON.stringify({
  phase: "preflight",
  network: "ethereum-sepolia",
  chainId,
  deployer: deployer.account.address,
  deployerBalanceEth: formatEther(balance),
  noxCompute: NOX_COMPUTE,
}, null, 2));

const payroll = await connection.viem.deployContract("VeilPayroll");

const [ownerCall, bytecode] = await Promise.all([
  publicClient.call({
    to: payroll.address,
    data: "0x8da5cb5b",
  }),
  publicClient.getBytecode({ address: payroll.address }),
]);

if (!ownerCall.data || ownerCall.data.length < 42) {
  throw new Error(`Could not read owner from ${payroll.address}.`);
}

const owner = getAddress(`0x${ownerCall.data.slice(-40)}`);

if (owner.toLowerCase() !== deployer.account.address.toLowerCase()) {
  throw new Error(`Deployment owner mismatch: expected ${deployer.account.address}, received ${owner}.`);
}

if (!bytecode || bytecode === "0x") {
  throw new Error(`No contract bytecode found at ${payroll.address}.`);
}

console.log(JSON.stringify({
  network: "ethereum-sepolia",
  chainId,
  contract: "VeilPayroll",
  address: payroll.address,
  owner,
  explorer: `https://sepolia.etherscan.io/address/${payroll.address}`,
}, null, 2));
