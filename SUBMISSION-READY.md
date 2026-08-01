# VeilPay submission handoff

Prepared on August 1, 2026 for the iExec WTF!! Hackathon Summer Edition.

## Submission status

- Public repository: ready
- Public frontend: ready
- Sepolia contract and batch evidence: ready
- `feedback.md`: ready
- Demo video: ready and under four minutes
- X post: copy and media ready, not posted
- DoraHacks entry: copy and links ready, not submitted

## Upload these files

### Main demo for X and DoraHacks

`video/out/veilpay-demo.mp4`

- Duration: 76.842667 seconds
- Video: H.264, 1920 x 1080, 30 fps
- Audio: AAC stereo
- Size: 9,549,503 bytes
- SHA-256: `dbec2b82053a042297b02cfab6f63efbc0877ef5def6bc522523fdf760f0680d`

### Optional vertical preview

`video/out/veilpay-social.mp4`

- Duration: 11 seconds
- Video: H.264, 1080 x 1920, 30 fps
- Size: 719,444 bytes
- SHA-256: `c0f70b3188ab78422d6e4600fb98e4c1d84b9a886c1d4d7e958758b36bbec8fd`

Use the narrated main demo for the required X post. The vertical clip is optional and does not replace it.

## X post

Attach `video/out/veilpay-demo.mp4` and paste:

> Payroll should settle onchain without putting every salary in public.
>
> VeilPay uses @iEx_ec Nox on Sepolia to encrypt allocations, isolate recipient access, and publish only the batch total.
>
> Live: https://yonkoo11.github.io/veilpay/
> Code: https://github.com/Yonkoo11/veilpay

After posting, copy the public X URL into the DoraHacks entry.

## DoraHacks fields

### Project name

VeilPay

### One-line pitch

Private payroll allocations with an aggregate that the treasury can choose to publish.

### Project links

- Live app: https://yonkoo11.github.io/veilpay/
- Repository: https://github.com/Yonkoo11/veilpay
- Demo backup: https://github.com/Yonkoo11/veilpay/blob/main/video/out/veilpay-demo.mp4
- Sepolia contract: https://sepolia.etherscan.io/address/0x1F82E5aB72B6Ec93e852533Ed9D021CbF51969AC

### Description

Putting payroll on a public chain usually exposes every amount. VeilPay keeps the individual allocations encrypted and gives the treasury a separate, explicit action for publishing the batch total.

The browser encrypts two allocations for the deployed VeilPayroll contract using the official iExec Nox handle client. The contract validates the encrypted handles, adds them with `Nox.add`, and applies Nox access controls. Each recipient receives access only to their own allocation. The treasury can inspect the encrypted total and may later call `publishTotal`, which makes that total publicly decryptable. Publication is intentional and irreversible.

Batch `0` is live on Sepolia. It contains allocations of `1` and `2` test units. Authorized decryption returned both values and their confidential total of `3`. After the publication transaction, a fresh browser could read the public aggregate as `3 USDC` without a wallet or secret.

This version proves confidential accounting and access control. It does not custody or transfer payroll tokens.

### Existing work disclosure

The VeilPay repository was created on August 1, 2026 for this hackathon and has no earlier public commit history. The implementation uses the published iExec Nox packages and follows the project documentation. No claim is made here about private repositories that cannot be independently inspected.

### Suggested tags

DeFi, TEE, Institutional, Tokenisation, Blockchain, Ethereum Sepolia

## Final manual checklist

1. Sign in to X.
2. Attach the narrated main demo and publish the exact post above.
3. Confirm the post contains the video, repository link, and `@iEx_ec` tag.
4. Open the WTF!! Hackathon on DoraHacks and create or submit the VeilPay BUIDL.
5. Paste the fields above and add the public X post URL.
6. Confirm the repository is public and the live app opens before the final click.
7. Save the public DoraHacks BUIDL URL and a confirmation screenshot.

The event page displayed a deadline of August 1, 2026 at 22:59, but did not display a timezone in the supplied details. Submit immediately.
