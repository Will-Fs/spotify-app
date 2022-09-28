export const setImageSize = () => {
    const images = Array.from(document.querySelectorAll("#profile-img"));

    images.forEach(image => {
        image.height = image.width;
    })
}

document.body.onresize = () => {
    setImageSize();
}