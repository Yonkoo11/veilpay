# Demo decisions

## Narration provider

Recommendation: use local Edge TTS as the fallback voice source, generated in one continuous pass and normalized to broadcast-friendly loudness.

Rationale: Gemini TTS is unavailable in this environment and no Azure Speech credential is configured. The narration remains reproducible and contains no fabricated claims.

Override: replace `public/audio/narration.mp3`, rerun Whisper, then update subtitle timestamps and scene timing in `src/constants.ts`.

## Visual strategy

Recommendation: Strategy B, a continuous narration over smooth transitions between verified screenshots and evidence cards.

Rationale: it avoids wallet-popup and gateway-latency risk while still showing only real Sepolia and test evidence.

## Music

Recommendation: no background music.

Rationale: the technical proof and narration should remain clear, and a music asset would add licensing risk near the deadline.
