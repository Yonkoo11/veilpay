# VeilPay — DoraHacks submission copy

## One-line pitch

VeilPay is a confidential payroll accounting layer that keeps individual allocations private while allowing a treasury to deliberately make only the aggregate publicly auditable.

## Links

- Live app: https://yonkoo11.github.io/veilpay/
- Repository: https://github.com/Yonkoo11/veilpay
- Demo video: https://github.com/Yonkoo11/veilpay/blob/main/video/out/veilpay-demo.mp4
- Sepolia contract: https://sepolia.etherscan.io/address/0x1F82E5aB72B6Ec93e852533Ed9D021CbF51969AC
- Batch creation: https://sepolia.etherscan.io/tx/0x34a19e2d6187f733d04c6e0ade7db9c9cae2f88699ca28fe1395def8eac6ec08
- Aggregate publication: https://sepolia.etherscan.io/tx/0x4b88c9900c7274dc77063a8077d85ed784bb161b39072f6ca56e14e5fcf8c045

## Description

Public blockchains make payroll values and treasury behavior observable by default. VeilPay adds a confidential layer without modifying the transparent protocols beneath it.

The browser encrypts two allocation values for the deployed VeilPayroll contract using the official iExec Nox handle client. The contract validates those encrypted handles, adds them with `Nox.add`, and grants access with Nox ACLs: each recipient receives access only to their allocation, while the treasury can inspect the encrypted total. The owner can later call `publishTotal` to make only the aggregate publicly decryptable. That decision is explicit and irreversible.

Verified Sepolia batch `0` used allocations of `1` and `2` test units. Authorized private decryption returned both allocations and their confidential total of `3`; after the publication transaction, a fresh browser could publicly decrypt only the `3 USDC` aggregate.

VeilPay is a protocol-layer demonstration. V1 proves confidential accounting and access control; it does not custody or transfer payroll tokens.

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

## Required disclosure to confirm before submission

Confirm that VeilPay does not reuse a project submitted to the previous Vibe Coding Hackathon, and list any code that existed before this WTF Hackathon entry.
