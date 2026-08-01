<script lang="ts">
  import "./recipient.css";
  import "./disclosure.css";
  import { describePayrollError, inspectAggregateDisclosure, payrollTotal, publishAggregateTotal, revealMyAllocation, submitPayroll, validateRecipients, type AggregateDisclosure, type AllocationReveal, type DisclosureStage, type RecipientDraft, type RevealStage, type SubmitStage } from "./lib/payroll";

  let recipients: RecipientDraft[] = [
    { name: "", role: "", address: "", amount: "" },
    { name: "", role: "", address: "", amount: "" },
  ];
  let stage: SubmitStage = "idle";
  let error = "";
  let hash = "";
  let showConfirm = false;
  let privacyOpen = false;
  let batchId = "0";
  let revealStage: RevealStage = "idle";
  let revealError = "";
  let revealed: AllocationReveal | undefined;
  let disclosureBatchId = "0";
  let disclosureStage: DisclosureStage = "idle";
  let disclosureError = "";
  let disclosure: AggregateDisclosure | undefined;
  let disclosureHash = "";
  let showDisclosureConfirm = false;
  const homeHref = import.meta.env.BASE_URL;

  $: total = payrollTotal(recipients);
  $: errors = validateRecipients(recipients);
  $: busy = !["idle", "complete", "error"].includes(stage);

  function updateRecipient(index: number, field: keyof RecipientDraft, value: string) {
    recipients = recipients.map((recipient, recipientIndex) => recipientIndex === index ? { ...recipient, [field]: value } : recipient);
  }

  async function sendPayroll() {
    showConfirm = false;
    error = "";
    hash = "";
    try {
      hash = await submitPayroll(recipients, (nextStage) => stage = nextStage);
      recipients = recipients.map((recipient) => ({ ...recipient, amount: "" }));
    } catch (reason) {
      stage = "error";
      error = describePayrollError(reason, "The payroll request failed. Try again.");
    }
  }

  async function revealAllocation() {
    revealError = "";
    revealed = undefined;
    try {
      revealed = await revealMyAllocation(batchId, (nextStage) => revealStage = nextStage);
    } catch (reason) {
      revealStage = "error";
      revealError = describePayrollError(reason, "The private allocation could not be revealed.");
    }
  }

  async function inspectDisclosure() {
    disclosureError = "";
    disclosureHash = "";
    try {
      disclosure = await inspectAggregateDisclosure(disclosureBatchId, (nextStage) => disclosureStage = nextStage);
    } catch (reason) {
      disclosureStage = "error";
      disclosure = undefined;
      disclosureError = describePayrollError(reason, "The aggregate status could not be loaded.");
    }
  }

  async function publishDisclosure() {
    showDisclosureConfirm = false;
    disclosureError = "";
    disclosureHash = "";
    try {
      disclosureHash = await publishAggregateTotal(disclosureBatchId, (nextStage) => disclosureStage = nextStage);
      try {
        disclosure = await inspectAggregateDisclosure(disclosureBatchId, (nextStage) => disclosureStage = nextStage);
      } catch (reason) {
        disclosureStage = "error";
        disclosureError = `Publication confirmed, but the public value is still resolving. ${describePayrollError(reason, "Check again shortly.")}`;
      }
    } catch (reason) {
      disclosureStage = "error";
      disclosureError = describePayrollError(reason, "The aggregate could not be published.");
    }
  }

  const stageLabel: Record<SubmitStage, string> = {
    idle: "Review and encrypt", connecting: "Connecting treasury wallet", encrypting: "Encrypting amounts", approving: "Waiting for wallet approval",
    confirming: "Confirming on Sepolia", processing: "Nox is resolving handles", complete: "Batch confirmed", error: "Retry payroll",
  };
  const revealStageLabel: Record<RevealStage, string> = {
    idle: "Reveal my allocation", connecting: "Connecting wallet", reading: "Checking recipient access",
    decrypting: "Authorize private reveal", complete: "Reveal another batch", error: "Try private reveal again",
  };
  $: revealBusy = ["connecting", "reading", "decrypting"].includes(revealStage);
  const disclosureStageLabel: Record<DisclosureStage, string> = {
    idle: "Check disclosure", connecting: "Connecting treasury wallet", reading: "Reading batch status",
    approving: "Approve irreversible publication", confirming: "Confirming publication", decrypting: "Resolving public total",
    complete: "Check again", error: "Retry status check",
  };
  $: disclosureBusy = ["connecting", "reading", "approving", "confirming", "decrypting"].includes(disclosureStage);
</script>

<svelte:head><title>VeilPay — Private payroll</title></svelte:head>

<div class="app-shell">
  <header class="brand-rail">
    <a class="wordmark" href={homeHref} aria-label="VeilPay home"><span class="mark">V</span><span>VeilPay</span></a>
    <div class="network"><i></i><span>Sepolia target</span></div>
    <button class="rail-action" aria-label="Open privacy details" on:click={() => privacyOpen = !privacyOpen}>Privacy map</button>
  </header>

  <main class="payroll-main">
    <div class="page-meta"><span>PAYROLL REGISTER</span><span>PAY PERIOD 08 · AUG 2026</span></div>
    <h1>Amounts are visible here.<br />After signing, they disappear.</h1>
    <p class="intro">Review locally, encrypt in your wallet, and leave only access-controlled handles onchain.</p>

    <section class="ledger" aria-labelledby="ledger-heading">
      <div class="ledger-heading"><h2 id="ledger-heading">Recipients</h2><span>{recipients.length} private allocations</span></div>
      {#each recipients as recipient, index}
        <article class="recipient-row">
          <span class="row-index">0{index + 1}</span>
          <div class="identity-fields">
            <label><span>Name</span><input aria-label={`Recipient ${index + 1} name`} placeholder="Recipient name" autocomplete="off" value={recipient.name} on:input={(event) => updateRecipient(index, "name", event.currentTarget.value)} /></label>
            <label><span>Role</span><input aria-label={`Recipient ${index + 1} role`} placeholder="Team or role" autocomplete="off" value={recipient.role} on:input={(event) => updateRecipient(index, "role", event.currentTarget.value)} /></label>
          </div>
          <label class="address-field"><span>Wallet</span><input aria-label={`Recipient ${index + 1} wallet`} placeholder="0x…" autocomplete="off" spellcheck="false" value={recipient.address} on:input={(event) => updateRecipient(index, "address", event.currentTarget.value)} /></label>
          <label class="amount-field"><span>Allocation</span><span class="amount-input"><input type="number" min="0" step="0.01" placeholder="0.00" aria-label={`Recipient ${index + 1} amount`} value={recipient.amount} on:input={(event) => updateRecipient(index, "amount", event.currentTarget.value)} /><b>USDC</b></span></label>
        </article>
      {/each}
    </section>

    <section class="disclosure-desk" aria-labelledby="disclosure-heading">
      <div class="disclosure-copy">
        <span class="rail-kicker">PUBLIC ACCOUNTABILITY</span>
        <h2 id="disclosure-heading">Disclose the total, never the salaries.</h2>
        <p>Anyone can inspect a published aggregate. Only the treasury owner can make that disclosure, and the decision cannot be reversed.</p>
      </div>
      <div class="disclosure-console">
        <div class="disclosure-controls">
          <label><span>Batch ID</span><input type="number" min="0" step="1" inputmode="numeric" bind:value={disclosureBatchId} /></label>
          <button class="secondary-action" disabled={disclosureBusy} on:click={inspectDisclosure}>{disclosureStageLabel[disclosureStage]}</button>
        </div>
        <div class="disclosure-result" aria-live="polite">
          {#if disclosureBusy}<span class="status-line"><i></i>{disclosureStageLabel[disclosureStage]}</span>
          {:else if disclosureError}<p class="inline-error"><strong>Disclosure check needs attention.</strong> {disclosureError}</p>
          {:else if disclosure?.published}
            <span class="disclosure-status public">PUBLIC AGGREGATE</span>
            <strong>{disclosure.amount} USDC</strong>
            <small>Individual recipient allocations remain confidential.</small>
          {:else if disclosure}
            <span class="disclosure-status private">PRIVATE AGGREGATE</span>
            <strong class="masked-total">•••••• USDC</strong>
            <small>Only the treasury can decrypt this total.</small>
          {:else}
            <span class="disclosure-status neutral">NO BATCH LOADED</span>
            <strong class="masked-total">— USDC</strong>
            <small>Enter a batch ID to inspect its public status.</small>
          {/if}
        </div>
        {#if disclosureHash}<a class="disclosure-link" href={`https://sepolia.etherscan.io/tx/${disclosureHash}`} target="_blank" rel="noreferrer">Publication transaction ↗</a>{/if}
        {#if disclosure && !disclosure.published}
          <button class="publish-action" disabled={disclosureBusy} on:click={() => showDisclosureConfirm = true}>Publish aggregate permanently</button>
        {/if}
      </div>
    </section>
  </main>

  <aside class:open={privacyOpen} class="settlement-rail">
    <button class="close-rail" aria-label="Close privacy details" on:click={() => privacyOpen = false}>Close</button>
    <div class="rail-kicker">VISIBILITY LEDGER</div>
    <h2>Who sees what</h2>
    <section class="accounting-proof">
      <span>LOCAL ACCOUNTING CHECK</span>
      <div class="equation"><strong>{total.toLocaleString()}</strong><i>=</i><strong>{total.toLocaleString()}</strong></div>
      <p>Recipient allocations match the planned treasury debit.</p>
    </section>
    <dl class="viewer-list">
      <div><dt>Treasury</dt><dd>Aggregate + allocations</dd></div>
      <div><dt>Each recipient</dt><dd>Own allocation only</dd></div>
      <div><dt>Public observers</dt><dd>Addresses + handles</dd></div>
    </dl>
    <section class="recipient-access" aria-labelledby="recipient-access-title">
      <span class="rail-kicker">RECIPIENT ACCESS</span>
      <h3 id="recipient-access-title">Your allocation, on demand</h3>
      <p>Connect the recipient wallet. Nox verifies its access before returning one private amount.</p>
      <div class="batch-access-form">
        <label><span>Batch ID</span><input type="number" min="0" step="1" inputmode="numeric" bind:value={batchId} aria-describedby="recipient-access-note" /></label>
        <button class="reveal-action" disabled={revealBusy} on:click={revealAllocation}>{revealStageLabel[revealStage]}</button>
      </div>
      <div id="recipient-access-note" class="private-result" aria-live="polite">
        {#if revealBusy}<span class="status-line"><i></i>{revealStageLabel[revealStage]}</span>
        {:else if revealError}<p class="inline-error"><strong>Access not granted.</strong> {revealError}</p>
        {:else if revealed}
          <span>PRIVATE ALLOCATION · {revealed.allocation}</span>
          <strong>{revealed.amount} USDC</strong>
          <small>Visible only in this session. VeilPay does not save this value.</small>
        {:else}<span class="masked-value" aria-label="Allocation hidden">•••••• USDC</span>{/if}
      </div>
    </section>
    <div class="process-status" aria-live="polite">
      {#if busy}<span class="status-line"><i></i>{stageLabel[stage]}</span>{/if}
      {#if error}<p class="inline-error"><strong>Couldn’t submit.</strong> {error}</p>{/if}
      {#if hash}<p class="success-copy"><strong>Batch confirmed.</strong><a href={`https://sepolia.etherscan.io/tx/${hash}`} target="_blank" rel="noreferrer">View transaction</a></p>{/if}
    </div>
    <button class="primary-action" disabled={busy || errors.length > 0} on:click={() => stage === "error" ? sendPayroll() : showConfirm = true}>
      <span>{stageLabel[stage]}</span><span aria-hidden="true">→</span>
    </button>
    <p class="action-note">Values stay in this browser until encryption. VeilPay never stores plaintext payroll data.</p>
  </aside>
</div>

<div class="mobile-settlement">
  <span><small>LOCAL TOTAL</small><strong>{total.toLocaleString()} USDC</strong></span>
  <button disabled={errors.length > 0} on:click={() => privacyOpen = true}>Review privacy</button>
</div>

{#if showConfirm}
  <div class="modal-backdrop" role="presentation" on:click={() => showConfirm = false}>
    <div class="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title" tabindex="-1" on:click|stopPropagation on:keydown={(event) => event.key === "Escape" && (showConfirm = false)}>
      <span class="rail-kicker">FINAL LOCAL REVIEW</span><h2 id="confirm-title">Encrypt this payroll?</h2>
      <p>Two allocations totaling <strong>{total.toLocaleString()} USDC</strong> will be encrypted and submitted to Ethereum Sepolia.</p>
      <div class="dialog-actions"><button class="secondary-action" on:click={() => showConfirm = false}>Keep editing</button><button class="primary-action compact" on:click={sendPayroll}>Encrypt & request approval</button></div>
    </div>
  </div>
{/if}

{#if showDisclosureConfirm}
  <div class="modal-backdrop" role="presentation" on:click={() => showDisclosureConfirm = false}>
    <div class="confirm-dialog disclosure-dialog" role="alertdialog" aria-modal="true" aria-labelledby="disclosure-confirm-title" aria-describedby="disclosure-confirm-description" tabindex="-1" on:click|stopPropagation on:keydown={(event) => event.key === "Escape" && (showDisclosureConfirm = false)}>
      <span class="rail-kicker">IRREVERSIBLE DISCLOSURE</span>
      <h2 id="disclosure-confirm-title">Make batch {disclosureBatchId}’s total public?</h2>
      <p id="disclosure-confirm-description">The aggregate will become publicly decryptable forever. Individual recipient allocations remain private.</p>
      <div class="disclosure-warning"><strong>What changes</strong><span>Total: private → public</span><span>Salaries: remain private</span></div>
      <div class="dialog-actions"><button class="secondary-action" on:click={() => showDisclosureConfirm = false}>Keep private</button><button class="publish-action compact" on:click={publishDisclosure}>Publish permanently</button></div>
    </div>
  </div>
{/if}
