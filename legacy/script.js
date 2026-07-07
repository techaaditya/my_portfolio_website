let menu = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');
let themeToggle = document.querySelector('#theme-toggle');
let body = document.body;

menu.onclick = () => {
    menu.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}

window.onscroll = () => {
    menu.classList.remove('bx-x');
    navbar.classList.remove('active');
}

themeToggle.onclick = () => {
    body.classList.toggle('dark-theme');
    if (body.classList.contains('dark-theme')) {
        themeToggle.classList.replace('bx-moon', 'bx-sun');
    } else {
        themeToggle.classList.replace('bx-sun', 'bx-moon');
    }
}

const typed = new Typed('.multiple-text',  {
    strings: ['Data Science Enthusiast', 'Python Developer', 'AI & ML Explorer', 'Machine Learning Student', 'Web Developer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Software Developer', 'Software Engineer', 'Data Analyst', 'Data Engineer', 'Data Scientist', 'Data Visualization Expert', 'Data Mining Expert', 'Data Wrangling Expert', 'Data Preprocessing Expert', 'Data Cleaning Expert', 'Data Transformation Expert', 'Data Modelling Expert', 'Data Analysis Expert', 'Data Interpretation Expert', 'Data Presentation Expert', 'Data Reporting Expert', 'Data Storytelling Expert', 'Data Visualization Expert', 'Data Communication Expert', 'Data Management Expert', 'Data Governance Expert', 'Data Quality Expert', 'Data Security Expert', 'Data Privacy Expert', 'Data Ethics Expert', 'Data Compliance Expert', 'Data Regulation Expert', 'Data Protection Expert'],
    typeSpeed: 80,
    backSpeed: 80,
    backDelay: 1200,
    loop: true,
});