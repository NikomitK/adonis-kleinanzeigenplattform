import.meta.glob(['../images/**'])
import.meta.glob(['../images/icons/**'])

let navLinks = document.querySelectorAll('.nav-link-container a')
navLinks.forEach(link => {
    if (link.getAttribute('href') == window.location.pathname) {
        link.ariaCurrent = 'page'
        link.ariaDisabled = 'true'
    }
})


let navbarToggler = document.getElementById('navbar-toggler')
let mobileNavLinks = document.getElementById('mobile-nav-links')

if (window.screen.width > 768) {
    mobileNavLinks.ariaHidden = 'true'
}

navbarToggler.addEventListener('click', function () {
    if (navbarToggler.getAttribute("aria-expanded") == "true") {
        navbarToggler.setAttribute("aria-expanded", "false")
        mobileNavLinks.style.height = "0px"
        mobileNavLinks.classList.remove('shown')
    } else {
        navbarToggler.setAttribute("aria-expanded", "true")
        mobileNavLinks.classList.add('shown')
        mobileNavLinks.style.height = `calc(${mobileNavLinks.scrollHeight}px + 2em)`
    }

})


// Ich weiß, nicht ganz best-practice, aber die alternative mit event listener per js wäre so unfassbar viel unleserlicher und im fall einer so kleinen website mit einem entwickler sind resultierende naming collisions eher ein kleineres problem 
window.saveListing = function saveListing(id) {
    console.log('clicked');
    fetch(`/anzeige/${id}/save`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => {
            response.status == 200 ? location.reload() : console.log('error');
        }).catch(error => {
            console.log(error);
        });
}

window.unsaveListing = function unsaveListing(id) {
    console.log('clicked');
    fetch(`/anzeige/${id}/unsave`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => {
            response.status == 200 ? location.reload() : console.log('error');
        }).catch(error => {
            console.log(error);
        });
} 
