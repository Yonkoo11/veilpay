export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const CROSSFADE = 15;

export const COLORS = {
  bg: "#0d0f0e",
  bgSoft: "#171a18",
  panel: "rgba(24, 28, 25, 0.88)",
  panelStrong: "#1d211e",
  ink: "#f2f0e9",
  inkSoft: "#b8bbb4",
  muted: "#7d837d",
  lime: "#c8ff3d",
  limeDim: "#7c9c2c",
  amber: "#ffbd59",
  red: "#ff6b6b",
  border: "rgba(242, 240, 233, 0.14)",
  borderStrong: "rgba(200, 255, 61, 0.34)",
  black: "#050606",
} as const;

export const SCENE_DURATIONS = {
  hook: 279,
  privacy: 279,
  nox: 422,
  sepolia: 459,
  publicResult: 320,
  engineering: 332,
  close: 304,
} as const;

export const SCENE_ORDER = [
  "hook",
  "privacy",
  "nox",
  "sepolia",
  "publicResult",
  "engineering",
  "close",
] as const;

export const TOTAL_FRAMES =
  Object.values(SCENE_DURATIONS).reduce((sum, duration) => sum + duration, 0) -
  CROSSFADE * (SCENE_ORDER.length - 1);

export const COPY = {
  brand: "VEILPAY",
  eyebrow: "CONFIDENTIAL PAYROLL · PUBLIC SETTLEMENT",
  hookTitle: "Payroll belongs onchain.",
  hookAccent: "Salaries do not.",
  hookBody: "Private allocations. Verifiable settlement. One standard Ethereum wallet.",
  privacyTitle: "Confidential, not anonymous.",
  privacyBody: "VeilPay hides values while keeping the public-chain boundary explicit.",
  privacyCards: [
    { label: "PUBLIC", value: "Recipients · timing · encrypted handles", tone: "amber" },
    { label: "PRIVATE", value: "Individual allocations · total before publication", tone: "lime" },
    { label: "TRUST", value: "Nox gateway · KMS · runner · TEE", tone: "neutral" },
  ],
  noxTitle: "Privacy without breaking composability.",
  noxSteps: [
    { label: "BROWSER", value: "Encrypt 2 values" },
    { label: "NOX", value: "Validate + add privately" },
    { label: "VEILPAYROLL", value: "Store handles + ACLs" },
    { label: "RECIPIENTS", value: "Reveal only authorized value" },
  ],
  noxFooter: "No plaintext salary enters calldata.",
  sepoliaTitle: "Real Sepolia state. Real confidential path.",
  contractLabel: "VEILPAYROLL",
  contract: "0x1F82E5aB72B6Ec93e852533Ed9D021CbF51969AC",
  batchLabel: "BATCH 0 · CREATE",
  batchTx: "0x34a19e2d…eac6ec08",
  publishLabel: "AGGREGATE · PUBLISH",
  publishTx: "0x4b88c990…e5fcf8c045",
  privateProof: "AUTHORIZED PRIVATE PROOF",
  privateValues: "1 + 2 = 3 test units",
  publicTitle: "Disclose the total. Never the salaries.",
  publicKicker: "JUDGE-REPRODUCIBLE",
  publicBody: "Batch 0 publicly decrypts without a wallet or secret.",
  engineeringTitle: "Proof, not promises.",
  engineeringStats: [
    { value: "15 / 15", label: "HARDHAT + NOX", detail: "Encrypted math · ACL isolation · publication" },
    { value: "6 / 6", label: "BROWSER", detail: "Desktop · mobile · live Sepolia read" },
    { value: "0", label: "PROD VULNERABILITIES", detail: "npm audit --omit=dev" },
  ],
  repo: "github.com/Yonkoo11/veilpay",
  closeTitle: "Private payroll.",
  closeAccent: "Public accountability.",
  liveUrl: "yonkoo11.github.io/veilpay",
  closeMeta: "ETHEREUM SEPOLIA · iEXEC NOX · MIT OPEN SOURCE",
  socialStat: "3 USDC",
  socialLabel: "PUBLIC TOTAL",
  socialQuestion: "Can payroll settle onchain without publishing every salary?",
} as const;

export const SUBTITLES = [
  { text: "Payroll belongs onchain. Salaries do not belong in public.", start: 0, end: 115 },
  { text: "VeilPay keeps each allocation private while settlement stays verifiable.", start: 115, end: 264 },
  { text: "This is confidentiality, not anonymity.", start: 264, end: 340 },
  { text: "Addresses and timing remain visible. Individual amounts do not appear in plaintext onchain.", start: 340, end: 527 },
  { text: "The browser encrypts both values for the VeilPayroll contract.", start: 527, end: 630 },
  { text: "Nox validates those handles, adds them confidentially, and enforces access onchain.", start: 630, end: 782 },
  { text: "Each recipient gets only their allocation. The treasury can inspect the private total.", start: 782, end: 935 },
  { text: "Batch zero is real Sepolia state, created through the official Nox clients.", start: 935, end: 1076 },
  { text: "Authorized decryption returned one and two test units, with a confidential total of three.", start: 1076, end: 1236 },
  { text: "The publication transaction made only that total publicly decryptable.", start: 1236, end: 1379 },
  { text: "Any judge can open the live app, enter batch zero, and verify three USDC.", start: 1379, end: 1543 },
  { text: "No wallet or secret is needed to inspect the deliberately public aggregate.", start: 1543, end: 1684 },
  { text: "Fifteen contract and unit checks plus six browser checks pass.", start: 1684, end: 1806 },
  { text: "They cover encrypted arithmetic, recipient isolation, outsider denial, and responsive live reads.", start: 1806, end: 2000 },
  { text: "VeilPay is private payroll with a deliberate path to public accountability.", start: 2000, end: 2130 },
  { text: "Built on Ethereum Sepolia with iExec Nox.", start: 2130, end: 2214 },
] as const;

export const SOCIAL_DURATION = 330;
