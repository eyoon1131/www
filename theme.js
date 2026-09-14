(function () {
  function isAuto() {
    return !localStorage.getItem('theme');
  }

  function currentTheme() {
    var explicit = document.documentElement.getAttribute('data-theme');
    if (explicit === 'light' || explicit === 'dark') return explicit;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  function buildToggle() {
    var wrapper = document.createElement('label');
    wrapper.className = 'theme-toggle';
    wrapper.setAttribute('title', 'Toggle dark mode');

    var autoLabel = document.createElement('span');
    autoLabel.className = 'theme-toggle-auto';
    autoLabel.textContent = 'Auto';
    autoLabel.setAttribute('aria-hidden', 'true');

    var input = document.createElement('input');
    input.type = 'checkbox';
    input.setAttribute('aria-label', 'Toggle dark mode');
    input.checked = currentTheme() === 'dark';

    function syncState() {
      wrapper.classList.toggle('theme-toggle--auto', isAuto());
      wrapper.classList.toggle('theme-toggle--checked', input.checked);
    }
    syncState();

    input.addEventListener('change', function () {
      setTheme(input.checked ? 'dark' : 'light');
      syncState();
    });

    wrapper.appendChild(input);
    wrapper.appendChild(autoLabel);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!isAuto()) return;
      input.checked = e.matches;
      syncState();
    });

    return wrapper;
  }

  function injectToggle() {
    var toggle = buildToggle();
    var navLinks = document.querySelector('.nav-links');

    if (navLinks) {
      var li = document.createElement('li');
      li.appendChild(toggle);
      navLinks.appendChild(li);
      return;
    }

    var nav = document.querySelector('nav');
    if (nav) {
      nav.appendChild(toggle);
      return;
    }

    toggle.classList.add('theme-toggle--fixed');
    document.body.appendChild(toggle);
  }

  injectToggle();
})();
