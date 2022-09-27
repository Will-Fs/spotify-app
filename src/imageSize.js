document.body.onresize = () => {
    const images = Array.from(document.querySelectorAll("#profile-img"));

    images.forEach(image => {
        image.height = image.width;
    })
}