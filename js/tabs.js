document.addEventListener('DOMContentLoaded', () => {
  const tabButtons = document.querySelectorAll('[data-tab-target]');
  const tabContents = document.querySelectorAll('.tab-content');

  if (!tabButtons.length || !tabContents.length) {
    return;
  }

  const deactivateAllTabs = () => {
    tabButtons.forEach((button) => {
      button.classList.remove('border-accent-light');
      button.classList.add('border-transparent');
      button.classList.add('cursor-pointer');
      button.setAttribute('aria-selected', 'false');
    });
    tabContents.forEach((panel) => {
      panel.classList.add('hidden');
    });
  };

  const activateTab = (button) => {
    const targetSelector = button.dataset.tabTarget;
    const targetPanel = document.querySelector(targetSelector);
    if (!targetPanel) {
      return;
    }

    deactivateAllTabs();
    button.classList.remove('border-transparent');
    button.classList.add('border-accent-light');
    button.setAttribute('aria-selected', 'true');
    targetPanel.classList.remove('hidden');
  };

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => activateTab(button));
  });

  const initialTab = [...tabButtons].find((button) => button.classList.contains('border-accent-light')) || tabButtons[0];
  activateTab(initialTab);
});
