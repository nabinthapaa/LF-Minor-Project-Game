export function getImage(path: string) {
  const img = new Image();
  img.src = path;
  return img;
}

export function getAudio(path: string) {
  return new Audio(path);
}
