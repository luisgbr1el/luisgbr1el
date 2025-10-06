const supportedLanguages = ['en', 'pt-BR'];

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
	options = langSelect.children;
	for (const option of options) {
		if (option.value === language) option.selected = true;
	}

	setCursor(0);

	let mouseX = 0, mouseY = 0;
	let cursorX = 0, cursorY = 0;

	$(document).mousemove(function(event) {
		mouseX = event.clientX;
		mouseY = event.clientY;
		
		$('#cursor-container').css({
			left: mouseX + 'px',
			top: mouseY + 'px'
		});
	});

	function animateCursor() {
		const easing = 1.0;
		
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
		
		animationId = requestAnimationFrame(animateCursor);
	}
	
	animateCursor();

	$(document).on('mouseenter', 'a.button, .navbar-button, a.social-media', function() {
		setCursor(1);
	});

	$(document).on('mouseleave', 'a.button, .navbar-button, a.social-media', function() {
		setCursor(0);
	});

	$('#about').hide();
	$('#projects').hide();
	$('#contact').hide();
	$('#about').fadeIn(1000, 'swing');
	$('#projects').fadeIn(1000, 'swing');
	$('#contact').fadeIn(1000, 'swing');

	$('.navbar-button').click(function(e) {
		e.preventDefault();
		const target = $(this).attr('href');
		const targetElement = $(target);
		
		if (targetElement.length) {
			$('html, body').animate({
				scrollTop: targetElement.offset().top
			}, 100, 'easeInOutCubic');
		}
	});

	$('.button').click(function(e) {
		const href = $(this).attr('href');
		
		if (href && (href.startsWith('mailto:') || href.startsWith('http:') || href.startsWith('https:')))
			return;
		
		e.preventDefault();
		const targetElement = $(href);
		
		if (targetElement.length) {
			$('html, body').animate({
				scrollTop: targetElement.offset().top
			}, 100, 'easeInOutCubic');
		}
	});

})();

function setLanguage(language) {
	localStorage.setItem('language', language);
	setTranslation();
}

async function setTranslation() {
	const response = await fetch('./assets/translations.json');
	const translation = await response.json();
	const language = localStorage.getItem('language') || 'en';

	for (const key in translation) {
		const elements = document.getElementsByClassName(key);

		for (const element of elements) {
			element.innerHTML = translation[key][language] || translation[key]['en'];
		}
	}
}

function setCursor(type) {
	let cursorDiv = document.getElementById('custom-cursor');
	let container = document.getElementById('cursor-container');

	if (!cursorDiv) {
		cursorDiv = document.createElement('div');
		cursorDiv.id = 'custom-cursor';
		cursorDiv.style.position = 'fixed';
		cursorDiv.style.pointerEvents = 'none';
		cursorDiv.style.width = '30px';
		cursorDiv.style.height = '30px';
		cursorDiv.style.borderRadius = '50%';
		cursorDiv.style.zIndex = '9998';
		cursorDiv.style.border = '1px solid aliceblue';
		cursorDiv.style.transform = 'translate(-50%, -50%)';
		document.body.appendChild(cursorDiv);

		container = document.createElement('div');
		container.id = 'cursor-container';
		container.style.position = 'fixed';
		container.style.pointerEvents = 'none';
		container.style.borderRadius = '50%';
		container.style.zIndex = '9999';
		container.style.transform = 'translate(-50%, -50%)';
		document.body.appendChild(container);
	}

	const $cursorDiv = $(cursorDiv);
	const $container = $(container);

	switch (type) {
		case 0: // default
			$container.stop().animate({
				width: '4px',
				height: '4px'
			}, 200, 'swing');
			$container.css({
				'backgroundColor': 'aliceblue'
			});
			$cursorDiv.css({
				'borderColor': 'aliceblue',
				'border': '1px solid aliceblue'
			});
			break;
		case 1: // pointer/hover
			$container.stop().animate({
				width: '10px',
				height: '10px'
			}, 200, 'swing');
			$container.css({
				'backgroundColor': 'white'
			});
			$cursorDiv.css({
				'border': 'none'
			});
			break;
	}
}