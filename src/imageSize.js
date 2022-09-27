document.body.onresize = () => {
    const images = Array.from(document.querySelectorAll("#profile-img"));
    console.log(images);

    images.forEach(image => {
        console.log("TEST?");
        image.height = image.width;
    })
}