import { setTimeout as sleep } from "node:timers/promises";
import { type Hex } from "viem";
import { handleGatewayUrl } from "@iexec-nox/nox-hardhat-plugin";

export async function waitForHandleResolved(
  handle: Hex,
  { timeoutMs = 60_000, initialPollMs = 500, maxPollMs = 5_000, backoffFactor = 1.5 } = {},
): Promise<void> {
  const url = `${handleGatewayUrl()}/v0/public/handles/status`;
  const deadline = Date.now() + timeoutMs;
  let pollMs = initialPollMs;
  while (Date.now() < deadline) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ handles: [handle] }),
    });
    if (response.ok) {
      const body = (await response.json()) as { payload: { statuses: Array<{ handle: string; resolved: boolean }> } };
      if (body.payload.statuses.some((status) => status.handle.toLowerCase() === handle.toLowerCase() && status.resolved)) return;
    }
    await sleep(pollMs);
    pollMs = Math.min(pollMs * backoffFactor, maxPollMs);
  }
  throw new Error(`Handle resolution timed out`);
}
