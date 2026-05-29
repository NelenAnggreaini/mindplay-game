TODO: DND CSS cleanup in style.css

1) Identify DND section boundaries:
   - start: /* ===== DND (drag/drop) */
   - end: just before /* ===== Score Page */
2) Delete ALL CSS inside that boundary (remove duplicates and overrides).
3) Paste ONLY the provided "FINAL DND CSS" snippet (exact).
4) Verify no duplicate DND selectors remain in the removed region.
5) Smoke-check: ensure game pages render (no whitespace/overlap), and score/landing/dashboard unaffected.

