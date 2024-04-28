document.addEventListener('DOMContentLoaded', (e) => {
    const htmlToAdd = localStorage.getItem('roomoutline');
    document.body.innerHTML = htmlToAdd;

    const bc = document.querySelector('.scaledup');
    const dif = window.innerWidth - bc.children[0].getBoundingClientRect().right;
    bc.style.left = `${dif / 2}px`;
});