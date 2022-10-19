export const findLargestImage = (images) => {
  if (images.length === 1) return images[0].url;

  let largestImage = { image: null, size: 0 };

  images.forEach((image) => {
    if (image.width > largestImage.size) {
      largestImage.image = image;
      largestImage.size = image.width;
    }
  });

  return largestImage.image?.url;
};
