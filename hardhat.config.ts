import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { configVariable, defineConfig } from "hardhat/config";
import noxPlugin from "@iexec-nox/nox-hardhat-plugin";

export default defineConfig({
  plugins: [hardhatToolboxViemPlugin, noxPlugin],
  solidity: "0.8.35",
  networks: {
    default: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      chainId: 11_155_111,
      url: process.env.SEPOLIA_RPC_URL ?? "https://rpc.sentio.xyz/sepolia",
      accounts: [configVariable("DEPLOYER_PRIVATE_KEY")],
    },
  },
});
