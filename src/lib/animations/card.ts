// src/lib/animations/card.ts
export const wait = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

export const animateDrawCard = async (
  drawCallback: () => void,
  delay: number = 200
): Promise<void> => {
  await wait(delay);
  drawCallback();
};