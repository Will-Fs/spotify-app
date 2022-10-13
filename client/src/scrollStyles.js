export const scrollStyles = () => {
    const objectContainer = document.querySelector(".object-info-container");
    // console.log(objectContainer.style.height)
    const tracksHeader = document.querySelector(".tracks-header");
    if (tracksHeader) {
        if (window.scrollY > objectContainer.clientHeight + 70) {
            tracksHeader.style = "\
                background-color: rgba(var(--body-bg-color-value), 0.8);\
                backdrop-filter: blur(3px);"
        }
        else {
            tracksHeader.style = "none";
        }
    }
    
//   
}