document.addEventListener('DOMContentLoaded', function () {
    const body = document.body;
    const mobileMenu = document.querySelector('.mobile-menu');
    const navegacion = document.querySelector('.header .navegacion');
    const botonDarkMode = document.querySelector('.dark-mode-boton');
    const preferencia = window.matchMedia('(prefers-color-scheme: dark)');

    function aplicarTema(evento) {
        body.classList.toggle('dark-mode', evento.matches);
    }

    aplicarTema(preferencia);

    if (preferencia.addEventListener) {
        preferencia.addEventListener('change', aplicarTema);
    } else {
        preferencia.addListener(aplicarTema);
    }

    if (botonDarkMode) {
        botonDarkMode.addEventListener('click', function () {
            body.classList.toggle('dark-mode');
        });
    }

    if (mobileMenu && navegacion) {
        mobileMenu.addEventListener('click', function () {
            navegacion.classList.toggle('mostrar');
        });
    }
});
