import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { describePayrollError, isTreasuryOwner, parseBatchId, payrollTotal, selectRecipientHandle, validateRecipients, type PayrollBatch } from "../../src/lib/payroll.ts";
import { SEPOLIA_DEPLOYMENT } from "../../src/lib/network.ts";

const valid = [
  { name: "Ada", role: "Engineering", address: "0x0000000000000000000000000000000000000001", amount: "2400" },
  { name: "Malik", role: "Design", address: "0x0000000000000000000000000000000000000002", amount: "1850" },
];

describe("payroll draft", () => {
  it("calculates the local review total", () => assert.equal(payrollTotal(valid), 4250));
  it("accepts a valid two-recipient batch", () => assert.deepEqual(validateRecipients(valid), []));
  it("rejects duplicate recipients", () => assert.match(validateRecipients([valid[0], valid[0]]).join(" "), /different addresses/));
  it("rejects invalid amounts and addresses", () => {
    const broken = [{ ...valid[0], address: "bad", amount: "0" }, valid[1]];
    const errors = validateRecipients(broken).join(" ");
    assert.match(errors, /valid Ethereum address/);
    assert.match(errors, /positive amount/);
  });
  it("rejects allocations beyond USDC precision", () => {
    const errors = validateRecipients([{ ...valid[0], amount: "1.0000001" }, valid[1]]).join(" ");
    assert.match(errors, /at most 6 decimal places/);
  });
});

describe("recipient handle selection", () => {
  const batch = [
    valid[0].address, valid[1].address,
    `0x${"11".repeat(32)}`, `0x${"22".repeat(32)}`, `0x${"33".repeat(32)}`, false,
  ] as PayrollBatch;

  it("selects only the connected recipient's allocation", () => {
    assert.deepEqual(selectRecipientHandle(batch, valid[0].address), { allocation: "A", handle: batch[2] });
    assert.deepEqual(selectRecipientHandle(batch, valid[1].address), { allocation: "B", handle: batch[3] });
  });

  it("does not expose a handle to an unrelated account", () => {
    assert.equal(selectRecipientHandle(batch, "0x0000000000000000000000000000000000000003"), undefined);
  });
});

describe("Sepolia operator boundary", () => {
  it("accepts only the deployed treasury owner", () => {
    assert.equal(isTreasuryOwner(SEPOLIA_DEPLOYMENT.owner), true);
    assert.equal(isTreasuryOwner("0x0000000000000000000000000000000000000003"), false);
  });
});

describe("batch references", () => {
  it("parses zero and large unsigned batch IDs without precision loss", () => {
    assert.equal(parseBatchId("0"), 0n);
    assert.equal(parseBatchId("9007199254740993"), 9_007_199_254_740_993n);
  });

  it("rejects negative, decimal and empty batch IDs", () => {
    for (const value of ["-1", "1.2", ""]) assert.throws(() => parseBatchId(value), /valid batch ID/);
  });
});

describe("wallet error copy", () => {
  it("translates known contract and wallet failures", () => {
    assert.equal(describePayrollError(new Error("execution reverted: UnknownBatch()"), "fallback"), "That batch does not exist on Sepolia.");
    assert.equal(describePayrollError(new Error("User rejected request (4001)"), "fallback"), "The wallet request was rejected.");
  });

  it("does not expose unbounded provider output", () => {
    assert.equal(describePayrollError(new Error("x".repeat(221)), "Safe fallback."), "Safe fallback.");
  });
});
