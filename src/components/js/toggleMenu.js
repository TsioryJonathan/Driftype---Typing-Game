const menuBtn = document.querySelector('#hamburger')
const menuList = document.querySelector('#mobile-menu')

const navLinks = document.querySelectorAll('#link-list li')


menuBtn.addEventListener('click' , (e) => {
    menuList.classList.replace('translate-x-[999px]' ,'translate-x-0' )
})

document.querySelector('#close-button').addEventListener('click' , () => {
    menuList.classList.replace('translate-x-0' ,'translate-x-[999px]' )
})


navLinks.forEach((l) => {
    l.addEventListener('click' , () => {
        menuList.classList.replace('translate-x-0' ,'translate-x-[999px]' )
    })
})


