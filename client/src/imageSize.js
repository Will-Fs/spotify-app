export const setImageSize = (e) => {
  if (!e) return;
  const img = e.target;
  if (img.width !== img.height) {
    img.height = img.width;
  }
};

const setImageSizes = () => {
  const images = Array.from(document.querySelectorAll('#profile-img'));

  images.forEach((img) => {
    if (img.width !== img.height) {
      img.height = img.width;
    }
  });
};

document.body.onresize = () => {
  setImageSizes();
};
