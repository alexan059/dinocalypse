function asyncLoadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
  });
}

async function imageLoader(assetList) {
  const imgs = await Promise.all(Object.entries(assetList).map(
    async ([name, src]) => [name, await asyncLoadImage(src)]
  ));

  return Object.fromEntries(imgs);
}

export default imageLoader;