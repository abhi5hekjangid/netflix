const logo = document.getElementById('logo');
// Add a click event listener to the logo
logo.addEventListener('click', function () {
  // Navigate to the home page (index.html)
  window.location.href = 'index.html';
});

// show current active nav link as bold
const activePage = window.location.pathname;
const navLinks = document.getElementsByClassName('nav-item');
for(let i=0; i<navLinks.length;i++){
    if(navLinks[i].href.includes(`${activePage}`)){
        navLinks[i].classList.add('active');
    }
}