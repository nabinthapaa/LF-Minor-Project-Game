export function sleep(milliseconds: number) {
  const start = Date.now();
  while (Date.now() - start < milliseconds) {}
}
