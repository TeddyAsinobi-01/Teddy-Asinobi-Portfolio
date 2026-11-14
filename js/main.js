/**
 * Teddy Asinobi portfolio: behaviour
 * Mobile menu, accessible tabs, active-link highlighting and the contact form.
 */
(() => {
  'use strict';

  /* Google Apps Script endpoint that saves messages to your Google Sheet */
  const FORM_ENDPOINT =
    'https://script.google.com/macros/s/AKfycbwMv01nhgVR6SJvONfTncnw4wpJtac_4Z7ue1ayw71eiLLx37ae5E6yy-14o5qMAfr2IQ/exec';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  /* Footer year ----------------------------------------------------------- */
  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  /* Mobile menu ----------------------------------------------------------- */
  const toggle = $('.nav-toggle');
  const menu = $('#site-menu');

  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
  };

  if (toggle && menu) {
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 48.01rem)').addEventListener('change', () => setMenu(false));
  }

  /* Tabs (WAI-ARIA tabs pattern with arrow-key support) -------------------- */
  const tabs = $('[data-tabs]');
  if (tabs) {
    const tabButtons = $$('[role="tab"]', tabs);
    const panels = $$('[role="tabpanel"]', tabs);

    const select = (tab, { focus = false } = {}) => {
      tabButtons.forEach((button) => {
        const active = button === tab;
        button.setAttribute('aria-selected', String(active));
        button.tabIndex = active ? 0 : -1;
      });
      panels.forEach((panel) => {
        panel.hidden = panel.id !== tab.getAttribute('aria-controls');
      });
      if (focus) tab.focus();
    };

    tabButtons.forEach((tab, index) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (event) => {
        const last = tabButtons.length - 1;
        const moves = {
          ArrowRight: index === last ? 0 : index + 1,
          ArrowLeft: index === 0 ? last : index - 1,
          Home: 0,
          End: last,
        };
        if (event.key in moves) {
          event.preventDefault();
          select(tabButtons[moves[event.key]], { focus: true });
        }
      });
    });

    select(tabButtons[0]);
  }

  /* Highlight the nav link for the section in view -------------------------- */
  const navLinks = $$('.site-nav__list a[href^="#"]:not(.btn)');
  if (navLinks.length && 'IntersectionObserver' in window) {
    const sections = navLinks
      .map((link) => $(link.getAttribute('href')))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            const match = link.getAttribute('href') === `#${entry.target.id}`;
            if (match) link.setAttribute('aria-current', 'true');
            else link.removeAttribute('aria-current');
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((section) => observer.observe(section));

    /* The contact section can't reach the middle of the screen, so clear the highlight at the page bottom */
    window.addEventListener('scroll', () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) navLinks.forEach((link) => link.removeAttribute('aria-current'));
    }, { passive: true });
  }

  /* Contact form ------------------------------------------------------------ */
  const form = $('form[name="submit-to-google-sheet"]');
  if (form) {
    const status = $('.form__status', form);
    const submit = $('button[type="submit"]', form);
    const label = $('.btn__label', submit);
    const idleLabel = label.textContent;

    const say = (message, state) => {
      status.textContent = message;
      status.dataset.state = state;
    };

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const invalid = $$('input, textarea', form).filter((field) => !field.checkValidity());
      $$('input, textarea', form).forEach((field) => field.removeAttribute('aria-invalid'));
      if (invalid.length) {
        invalid.forEach((field) => field.setAttribute('aria-invalid', 'true'));
        invalid[0].focus();
        say('Please fill in your name, a valid email and a message.', 'error');
        return;
      }

      submit.disabled = true;
      label.textContent = 'Sending…';
      say('', '');

      try {
        const response = await fetch(FORM_ENDPOINT, { method: 'POST', body: new FormData(form) });
        if (!response.ok) throw new Error(`Request failed (${response.status})`);
        form.reset();
        say('Message sent. Thank you, I will reply soon.', 'success');
      } catch (error) {
        console.error('Contact form error:', error);
        say('Your message did not send. Check your connection and try again, or email me directly.', 'error');
      } finally {
        submit.disabled = false;
        label.textContent = idleLabel;
        setTimeout(() => { if (status.dataset.state === 'success') say('', ''); }, 8000);
      }
    });
  }
})();
