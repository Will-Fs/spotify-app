export const scrollStyles = () => {
   const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
   const navbar = document.querySelector("nav");
   console.log(window.scrollY)
   const ratio = window.scrollY/vh;
   console.log(ratio);
   const opacity = ratio * 4;
   navbar.style.setProperty("--nav-opacity", opacity)
   navbar.style.setProperty("--nav-blur", `${opacity * 3}px`)

    
//   
}