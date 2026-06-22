(function () {
  'use strict';

  /* Нижняя навигация: активная вкладка и скролл */
  var bottomNav = document.querySelector('.bottom-nav');
  if (bottomNav) {
    var tabs = bottomNav.querySelectorAll('.bottom-nav__btn');
    var sections = {};

    tabs.forEach(function (btn) {
      var targetId = btn.getAttribute('data-target');
      if (targetId) {
        sections[targetId] = document.getElementById(targetId);
      }

      btn.addEventListener('click', function (e) {
        var id = btn.getAttribute('data-target');
        var target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          tabs.forEach(function (t) { t.classList.remove('bottom-nav__btn--active'); });
          btn.classList.add('bottom-nav__btn--active');
        }
      });
    });

    /* Подсветка активной вкладки при скролле */
    var sectionIds = Object.keys(sections);
    if (sectionIds.length > 0) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            tabs.forEach(function (t) {
              t.classList.toggle('bottom-nav__btn--active', t.getAttribute('data-target') === id);
            });
          }
        });
      }, { rootMargin: '-40% 0px -50% 0px' });

      sectionIds.forEach(function (id) {
        var el = sections[id];
        if (el) { observer.observe(el); }
      });
    }
  }

  /* Верхняя навигация: скролл по клику */
  var navLinks = document.querySelectorAll('.navbar__link');
  var navSections = {};

  navLinks.forEach(function (link) {
    var targetId = link.getAttribute('data-target');
    if (targetId) {
      navSections[targetId] = document.getElementById(targetId);
    }

    link.addEventListener('click', function (e) {
      var id = link.getAttribute('data-target');
      var target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        navLinks.forEach(function (l) { l.classList.remove('navbar__link--active'); });
        link.classList.add('navbar__link--active');
      }
    });
  });

  /* Подсветка на десктопе через Intersection Observer */
  var navSectionIds = Object.keys(navSections);
  if (navSectionIds.length > 0) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinks.forEach(function (l) {
            l.classList.toggle('navbar__link--active', l.getAttribute('data-target') === id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });

    navSectionIds.forEach(function (id) {
      var el = navSections[id];
      if (el) { navObserver.observe(el); }
    });
  }

  /* Анимация чисел в статистике */
  var statNumbers = document.querySelectorAll('.stats__number');
  if (statNumbers.length > 0) {
    var statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var raw = el.getAttribute('data-count');
          if (raw === null) return;
          var target = parseFloat(raw.replace(/\s/g, '').replace(',', '.'));
          if (isNaN(target)) return;
          var suffix = raw.replace(/[0-9.,\s]/g, '');
          var duration = 1200;
          var startTime = null;

          function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.round(eased * target);
            el.textContent = current + suffix;
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              el.textContent = raw;
            }
          }

          requestAnimationFrame(step);
          statsObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(function (num) { statsObserver.observe(num); });
  }

  /* Параллакс для hero (только десктоп) */
  var heroImage = document.querySelector('.hero__image-wrapper img');
  if (heroImage && window.innerWidth > 834) {
    var heroWrapper = document.querySelector('.hero__image-wrapper');
    window.addEventListener('mousemove', function (e) {
      var rect = heroWrapper.getBoundingClientRect();
      var centerX = rect.left + rect.width / 2;
      var centerY = rect.top + rect.height / 2;
      var deltaX = (e.clientX - centerX) / rect.width;
      var deltaY = (e.clientY - centerY) / rect.height;
      var moveX = deltaX * 10;
      var moveY = deltaY * 10;
      heroImage.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px) scale(1.05)';
      heroImage.style.transition = 'transform 0.15s ease-out';
    });
  }

  /* Кнопка «Наверх» */
  var scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* Кастомные кнопки с data-scroll-to */
  var scrollButtons = document.querySelectorAll('[data-scroll-to]');
  scrollButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = btn.getAttribute('data-scroll-to');
      if (target === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (target === 'footer') {
        var footer = document.querySelector('.footer');
        if (footer) {
          footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        var el = document.getElementById(target);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

})();
