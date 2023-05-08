//Init the waveform and the animation

const portfolio = document.querySelectorAll('.portfolio-img');

portfolio.forEach((i) =>
    i.addEventListener('mouseover', function () {
        i.classList.add('fa');
        i.classList.add('fa-play-circle');
        i.style.cursor = 'pointer';
    }),
);
portfolio.forEach((i) =>
    i.addEventListener('mouseout', function () {
        if (window.innerWidth > 700) {
            i.classList.remove('fa');
            i.classList.remove('fa-play-circle');
        }
    }),
);
