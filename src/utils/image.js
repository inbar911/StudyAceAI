export async function compressImage(file, maxDim = 1024, quality = 0.85) {
  if (!file || !file.type.startsWith('image/')) return null;
  const dataUrl = await new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
  const img = await new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = dataUrl;
  });
  const ratio = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.round(img.width * ratio);
  const h = Math.round(img.height * ratio);
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  canvas.getContext('2d').drawImage(img, 0, 0, w, h);
  const outDataUrl = canvas.toDataURL('image/jpeg', quality);
  return {
    dataUrl: outDataUrl,
    base64: outDataUrl.split(',')[1],
    mediaType: 'image/jpeg'
  };
}
