# VeilPay: DoraHacks submission copy

## One-line pitch

Private payroll allocations with an aggregate that the treasury can choose to publish.

## Links

- Live app: https://yonkoo11.github.io/veilpay/
- Repository: https://github.com/Yonkoo11/veilpay
- Demo video: https://github.com/Yonkoo11/veilpay/blob/main/video/out/veilpay-demo.mp4
- Sepolia contract: https://sepolia.etherscan.io/address/0x1F82E5aB72B6Ec93e852533Ed9D021CbF51969AC
- Batch creation: https://sepolia.etherscan.io/tx/0x34a19e2d6187f733d04c6e0ade7db9c9cae2f88699ca28fe1395def8eac6ec08
- Aggregate publication: https://sepolia.etherscan.io/tx/0x4b88c9900c7274dc77063a8077d85ed784bb161b39072f6ca56e14e5fcf8c045

## Description

Putting payroll on a public chain usually exposes every amount. VeilPay keeps the individual allocations encrypted and gives the treasury a separate, explicit action for publishing the batch total.

The browser encrypts two allocations for the deployed VeilPayroll contract using the official iExec Nox handle client. The contract validates the encrypted handles, adds them with `Nox.add`, and applies Nox access controls. Each recipient receives access only to their own allocation. The treasury can inspect the encrypted total and may later call `publishTotal`, which makes that total publicly decryptable. Publication is intentional and irreversible.

Batch `0` is live on Sepolia. It contains allocations of `1` and `2` test units. Authorized decryption returned both values and their confidential total of `3`. After the publication transaction, a fresh browser could read the public aggregate as `3 USDC` without a wallet or secret.

This version proves confidential accounting and access control. It does not custody or transfer payroll tokens.

## iExec Nox integration

- Official browser-side encrypted input handles.
- `Nox.fromExternal` validation inside VeilPayroll.
- Confidential arithmetic with `Nox.add`.
- Recipient-specific and treasury ACL grants.
- Deliberate public aggregate decryption.
- Docker-backed integration tests against the full Nox off-chain stack.

## Verification

- 15/15 Hardhat tests, including three Docker-backed Nox end-to-end tests.
- 6/6 desktop and mobile browser checks, including a live Sepolia read.
- 0 production dependency vulnerabilities from `npm audit --omit=dev`.
- Fresh public desktop and mobile checks returned HTTP 200, `3 USDC`, zero horizontal overflow, and zero console/page errors.

## Existing work and disclosure

The VeilPay repository was created on August 1, 2026 for this hackathon and has no earlier public commit history. The implementation uses the published iExec Nox packages and follows the project documentation. No claim is made here about private repositories that cannot be independently inspected.
