(function () {
  'use strict';

  const storageKey = 'theme-preference';
  const root = document.documentElement;
  const picker = document.querySelector('.theme-picker');
  const options = document.querySelectorAll('[data-theme-value]');
  const labels = document.querySelectorAll('[data-theme-label]');
  const themeNames = { system: 'System', light: 'Light', dark: 'Dark' };

  function savedTheme() {
    try {
      const value = localStorage.getItem(storageKey);
      return themeNames[value] ? value : 'system';
    } catch (error) {
      return 'system';
    }
  }

  function applyTheme(theme, save) {
    const chosenTheme = themeNames[theme] ? theme : 'system';
    root.dataset.theme = chosenTheme;

    options.forEach(function (option) {
      option.setAttribute('aria-pressed', String(option.dataset.themeValue === chosenTheme));
    });
    labels.forEach(function (label) {
      label.textContent = themeNames[chosenTheme];
    });

    if (save) {
      try {
        localStorage.setItem(storageKey, chosenTheme);
      } catch (error) {
        // The theme still works for this visit if storage is unavailable.
      }
    }
  }

  applyTheme(savedTheme(), false);

  options.forEach(function (option) {
    option.addEventListener('click', function () {
      applyTheme(option.dataset.themeValue, true);
      picker.removeAttribute('open');
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && picker.open) {
      picker.removeAttribute('open');
      picker.querySelector('summary').focus();
    }
  });

  window.addEventListener('storage', function (event) {
    if (event.key === storageKey) applyTheme(savedTheme(), false);
  });

  document.getElementById('year').textContent = new Date().getFullYear();
}());
