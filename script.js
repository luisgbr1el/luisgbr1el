const supportedLanguages = ['en', 'pt-BR'];

function isMobile() {
    return window.innerWidth <= 768;
}

function setupNavbarLinks() {
    $('.navbar-button').off('click').on('click', function(e) {
        const href = $(this).attr('href');
        if (!href || !href.startsWith('#')) return;

        e.preventDefault();
        const targetElement = $(href);

        if (isMobile()) {
            toggleNavbar();
            setTimeout(() => {
                if (targetElement.length) {
                    $('html, body').animate({
                        scrollTop: targetElement.offset().top - 70
                    }, 500, 'easeInOutCubic');
                }
            }, 250);
        } else {
            if (targetElement.length) {
                $('html, body').animate({
                    scrollTop: targetElement.offset().top - 80
                }, 500, 'easeInOutCubic');
            }
        }
    });
}

(function() {
    $.easing.easeInOutCubic = function(x) {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    };

    let language = localStorage.getItem('language');

    if (!language)
        language = navigator.language || navigator.userLanguage;

    if (!supportedLanguages.includes(language)) language = 'en';

    setLanguage(language);

    const langSelect = document.getElementById("lang-select");
    if (langSelect) {
        const options = langSelect.children;
        for (const option of options) {
            if (option.value === language) option.selected = true;
        }
    }

    setCursor(0);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    $(document).on('mousemove', function(event) {
        mouseX = event.clientX;
        mouseY = event.clientY;

        $('#cursor-container').css({
            left: mouseX + 'px',
            top: mouseY + 'px'
        });
    });

    function animateCursor() {
        const easing = 0.2;

        if (cursorX === 0 && cursorY === 0) {
            cursorX = mouseX;
            cursorY = mouseY;
        }

        cursorX += (mouseX - cursorX) * easing;
        cursorY += (mouseY - cursorY) * easing;

        $('#custom-cursor').css({
            left: cursorX + 'px',
            top: cursorY + 'px'
        });

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    $(document).on('mouseenter', 'a, button, select, .button, .navbar-button, .social-media', function() {
        setCursor(1);
    });

    $(document).on('mouseleave', 'a, button, select, .button, .navbar-button, .social-media', function() {
        setCursor(0);
    });

    $('#about, #projects, #contact').hide().fadeIn(1000, 'swing');

    setupNavbarLinks();

    $(window).on('resize', function() {
        setupNavbarLinks();
    });

    $('.button').on('click', function(e) {
        const href = $(this).attr('href');
        if (href && (href.startsWith('mailto:') || href.startsWith('http:') || href.startsWith('https:')))
            return;

        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetElement = $(href);
            if (targetElement.length) {
                $('html, body').animate({
                    scrollTop: targetElement.offset().top - 80
                }, 500, 'easeInOutCubic');
            }
        }
    });

})();

function setLanguage(language) {
    localStorage.setItem('language', language);
    setTranslation();
}

async function setTranslation() {
    try {
        const response = await fetch('./assets/translations.json');
        if (!response.ok) return;
        const translation = await response.json();
        const language = localStorage.getItem('language') || 'en';

        for (const key in translation) {
            const elements = document.getElementsByClassName(key);
            for (const element of elements) {
                element.innerHTML = translation[key][language] || translation[key]['en'];
            }
        }
    } catch (e) {
        console.error("Erro ao carregar traduções:", e);
    }
}

function setCursor(type) {
    let cursorDiv = document.getElementById('custom-cursor');
    let container = document.getElementById('cursor-container');

    if (!cursorDiv) {
        cursorDiv = document.createElement('div');
        cursorDiv.id = 'custom-cursor';
        document.body.appendChild(cursorDiv);
    }

    if (!container) {
        container = document.createElement('div');
        container.id = 'cursor-container';
        document.body.appendChild(container);
    }

    const $cursorDiv = $(cursorDiv);
    const $container = $(container);

    switch (type) {
        case 0: // Normal
            $container.stop().animate({ width: '4px', height: '4px' }, 200, 'swing');
            $container.css({ 'backgroundColor': '#f0f8ff' });
            $cursorDiv.css({
                'width': '30px',
                'height': '30px',
                'borderColor': 'rgba(240, 248, 255, 0.4)',
                'borderWidth': '1px',
                'borderStyle': 'solid',
                'backgroundColor': 'transparent'
            });
            break;
        case 1: // Hover
            $container.stop().animate({ width: '8px', height: '8px' }, 200, 'swing');
            $container.css({ 'backgroundColor': '#fff' });
            $cursorDiv.css({
                'width': '45px',
                'height': '45px',
                'borderColor': 'var(--color-secondary)',
                'borderWidth': '1.5px',
                'borderStyle': 'solid',
                'backgroundColor': 'rgba(110, 0, 228, 0.1)'
            });
            break;
    }
}

function toggleNavbar() {
    const navbar = document.getElementById('navbar');
    const bars = document.getElementById('bars');

    if (!navbar || !bars) return;

    bars.style.opacity = '0';

    setTimeout(() => {
        const isOpen = navbar.classList.toggle('active');
        bars.textContent = isOpen ? '✕' : '☰';
        bars.style.opacity = '1';
    }, 150);
}