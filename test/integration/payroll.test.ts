import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { nox } from "@iexec-nox/nox-hardhat-plugin";
import { waitForHandleResolved } from "../utils/handle-gateway.js";

describe("VeilPayroll end-to-end", () => {
  it("creates a balanced private payroll batch with isolated viewers", { timeout: 180_000 }, async () => {
    const { viem, handleClient } = await nox.connect();
    const publicClient = await viem.getPublicClient();
    const [owner, recipientA, recipientB, outsider] = await viem.getWalletClients();
    const payroll = await viem.deployContract("VeilPayroll", []);

    const amountA = await handleClient.encryptInput(2_400n, "uint256", payroll.address);
    const amountB = await handleClient.encryptInput(1_850n, "uint256", payroll.address);
    const hash = await payroll.write.createBatch([
      recipientA.account.address, amountA.handle, amountA.handleProof,
      recipientB.account.address, amountB.handle, amountB.handleProof,
    ]);
    await publicClient.waitForTransactionReceipt({ hash });

    const batch = (await payroll.read.getBatch([0n])) as readonly [`0x${string}`, `0x${string}`, `0x${string}`, `0x${string}`, `0x${string}`, boolean];
    const allocationA = batch[2] as `0x${string}`;
    const allocationB = batch[3] as `0x${string}`;
    const total = batch[4] as `0x${string}`;
    await Promise.all([allocationA, allocationB, total].map((handle) => waitForHandleResolved(handle)));

    assert.equal((await handleClient.decrypt(allocationA)).value, 2_400n);
    assert.equal((await handleClient.decrypt(allocationB)).value, 1_850n);
    assert.equal((await handleClient.decrypt(total)).value, 4_250n);
    assert.equal(await payroll.read.canViewAllocation([0n, recipientA.account.address, 0]), true);
    assert.equal(await payroll.read.canViewAllocation([0n, recipientA.account.address, 1]), false);
    assert.equal(await payroll.read.canViewAllocation([0n, recipientB.account.address, 1]), true);
    assert.equal(await payroll.read.canViewAllocation([0n, outsider.account.address, 0]), false);
    assert.equal(await payroll.read.canViewAllocation([0n, outsider.account.address, 1]), false);
    assert.equal(await payroll.read.canViewTotal([0n, owner.account.address]), true);
    assert.equal(await payroll.read.canViewTotal([0n, outsider.account.address]), false);
  });

  it("publishes only the aggregate total when the owner explicitly authorizes it", { timeout: 180_000 }, async () => {
    const { viem, handleClient } = await nox.connect();
    const publicClient = await viem.getPublicClient();
    const [, recipientA, recipientB] = await viem.getWalletClients();
    const payroll = await viem.deployContract("VeilPayroll", []);
    const amountA = await handleClient.encryptInput(10n, "uint256", payroll.address);
    const amountB = await handleClient.encryptInput(20n, "uint256", payroll.address);
    const createHash = await payroll.write.createBatch([
      recipientA.account.address, amountA.handle, amountA.handleProof,
      recipientB.account.address, amountB.handle, amountB.handleProof,
    ]);
    await publicClient.waitForTransactionReceipt({ hash: createHash });
    const publishHash = await payroll.write.publishTotal([0n]);
    await publicClient.waitForTransactionReceipt({ hash: publishHash });
    const batch = (await payroll.read.getBatch([0n])) as readonly [`0x${string}`, `0x${string}`, `0x${string}`, `0x${string}`, `0x${string}`, boolean];
    const total = batch[4] as `0x${string}`;
    await waitForHandleResolved(total);
    assert.equal((await handleClient.publicDecrypt(total)).value, 30n);
    assert.equal(batch[5], true);
    await assert.rejects(payroll.write.publishTotal([0n]));
  });

  it("rejects invalid recipients and non-owner batch creation", async () => {
    const { viem, handleClient } = await nox.connect();
    const [, recipient, stranger] = await viem.getWalletClients();
    const payroll = await viem.deployContract("VeilPayroll", []);
    const amountA = await handleClient.encryptInput(10n, "uint256", payroll.address);
    const amountB = await handleClient.encryptInput(20n, "uint256", payroll.address);
    await assert.rejects(payroll.write.createBatch([
      recipient.account.address, amountA.handle, amountA.handleProof,
      recipient.account.address, amountB.handle, amountB.handleProof,
    ]));
    const strangerPayroll = await viem.getContractAt("VeilPayroll", payroll.address, { client: { wallet: stranger } });
    await assert.rejects(strangerPayroll.write.createBatch([
      recipient.account.address, amountA.handle, amountA.handleProof,
      stranger.account.address, amountB.handle, amountB.handleProof,
    ]));
  });
});
