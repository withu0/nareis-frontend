export const ariaLabels = {
  navigation: {
    main: 'Main navigation',
    user: 'User account menu',
    footer: 'Footer navigation',
    breadcrumb: 'Breadcrumb navigation'
  },
  buttons: {
    close: 'Close dialog',
    menu: 'Toggle menu',
    search: 'Search',
    filter: 'Filter results',
    sort: 'Sort options'
  },
  forms: {
    required: 'Required field',
    optional: 'Optional field',
    error: 'Error message',
    success: 'Success message'
  }
};

export function announceToScreenReader(message: string) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => document.body.removeChild(announcement), 1000);
}

export function trapFocus(element: HTMLElement) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
}