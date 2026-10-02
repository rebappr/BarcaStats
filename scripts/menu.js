const menuToggle =
    document.getElementById("menuToggle");

const menuOverlay =
    document.getElementById("menuOverlay");

const mainMenu =
    document.querySelector(".main-menu");

if(menuToggle && menuOverlay && mainMenu){

    menuToggle.addEventListener("click", () => {

        mainMenu.classList.toggle("open");
        menuOverlay.classList.toggle("show");

        menuToggle.textContent =
            mainMenu.classList.contains("open")
            ? "✕"
            : "☰";

        if(mainMenu.classList.contains("open")){

            setTimeout(() => {

                const input =
                    document.getElementById(
                        "mobilePersonSearch"
                    );

                if(input){
                    input.focus();
                }

            }, 250);
        }

    });

    menuOverlay.addEventListener("click", () => {

        mainMenu.classList.remove("open");
        menuOverlay.classList.remove("show");

        menuToggle.textContent = "☰";

    });

    window.addEventListener("resize", () => {

        if(window.innerWidth > 820){

            mainMenu.classList.remove("open");
            menuOverlay.classList.remove("show");

            menuToggle.textContent = "☰";

        }

    });

}

/* Mobile search sync */

document.addEventListener("DOMContentLoaded", () => {

    const mobileInput =
        document.getElementById("mobilePersonSearch");

    const desktopInput =
        document.getElementById("personSearch");

    if(!mobileInput || !desktopInput){
        return;
    }

    mobileInput.addEventListener("input", () => {

        desktopInput.value =
            mobileInput.value;

        desktopInput.dispatchEvent(
            new Event("input")
        );

        const desktopResults =
            document.getElementById(
                "personSearchResults"
            );

        const mobileResults =
            document.getElementById(
                "mobileSearchResults"
            );

        if(desktopResults && mobileResults){

            mobileResults.innerHTML =
                desktopResults.innerHTML;
        }

    });

});
