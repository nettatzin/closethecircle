// Tiny global flag so ambient prompts (e.g. the rescue email popup) never
// cover a modal the user just triggered (welcome banner, ripple confirmation).
let openCount = 0;

export function isBlockingModalOpen() {
  return openCount > 0;
}

export function registerBlockingModal() {
  openCount += 1;
  return () => {
    openCount = Math.max(0, openCount - 1);
  };
}
