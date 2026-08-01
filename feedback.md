# iExec Nox Tooling Feedback

## What worked well

- The confidential contract primitives closely resemble ordinary Solidity operations: `fromExternal`, arithmetic, comparisons, `select` and explicit access grants.
- The official starter explains the encrypt → transact → authorize → decrypt round trip clearly.
- The Hardhat plugin provides the right testing ambition by starting the gateway, runner, KMS and storage services together.
- `@iexec-nox/handle` supports both Viem and Ethers and exposes the essential browser methods in one client.

## Friction encountered

- The official starter currently requests `^0.1.0-beta.2` of the Hardhat plugin, while stable `0.1.0` replaces the exported gateway constant with a dynamic `handleGatewayUrl()` helper. Updating starter code and documenting that API change would prevent confusing initial failures.
- The handle SDK is published as `0.1.0-beta.13`; a conventional stable-version discovery path would make setup clearer.
- The handle SDK README says its built-in network default includes Arbitrum Sepolia, while the published `0.1.0-beta.13` package also contains Ethereum Sepolia defaults. Aligning the README with the shipped network table and adding a copyable event-specific block would prevent unnecessary manual configuration.
- The Docker-backed test command can remain at “Starting offchain services” while uncached images are being obtained, without progress information from Compose. Printing image-pull state or offering a separate `nox pull` command would make first-run diagnosis much easier.
- The beta Hardhat plugin hardcodes host port `3000` for the handle gateway. When another development server already owns that port, Docker can still report the gateway container as healthy while host SDK requests reach the unrelated server and hang. Stable `0.1.0` fixes this with a dynamically assigned port, but the migration path is not clear in the starter.

## Suggested improvements

1. Pin exact compatible versions in the starter and publish a tested compatibility table.
2. Add an Ethereum Sepolia browser example using `createViemHandleClient` and document when its built-in defaults can be used safely.
3. Surface Docker pull and health-check progress in the Hardhat plugin.
4. Include one multi-user ACL test showing two wallet clients decrypting different handles and a third being denied.
5. Update the starter to stable `0.1.0` and its dynamic `handleGatewayUrl()` API.
