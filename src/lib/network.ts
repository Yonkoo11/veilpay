import type { Address, Hex } from "viem";

type PublicSepoliaDeployment = {
  chainId: 11_155_111;
  rpcUrl: `https://${string}`;
  payrollAddress: Address;
  owner: Address;
  noxComputeAddress: Address;
  noxGatewayUrl: `https://${string}`;
  noxSubgraphUrl: `https://${string}`;
  deploymentTransaction: Hex;
  deploymentBlock: bigint;
};

export const SEPOLIA_DEPLOYMENT = {
  chainId: 11_155_111,
  rpcUrl: "https://rpc.sentio.xyz/sepolia",
  payrollAddress: "0x1F82E5aB72B6Ec93e852533Ed9D021CbF51969AC",
  owner: "0xf9946775891a24462cD4ec885d0D4E2675C84355",
  noxComputeAddress: "0x24Ef36Ec5b626D7DCD09a98F3083c2758F0F77bF",
  noxGatewayUrl: "https://gateway-testnets.noxprotocol.dev",
  noxSubgraphUrl: "https://thegraph.ethereum-sepolia-testnet.noxprotocol.io/api/subgraphs/id/9CsccKwvgYFo72zZeU4k4wj2NEBLdWhVE3EUandgmzgo",
  deploymentTransaction: "0x1e21868422980a12d191f91181331669786cd66e47c7152c2ca438c477b96ada",
  deploymentBlock: 11_397_924n,
} as const satisfies PublicSepoliaDeployment;
