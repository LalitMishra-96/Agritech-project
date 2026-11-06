/**
 * AgriSmart AI — Smart Agriculture Assistant
 * Vanilla JavaScript UI Controller (Part 2)
 *
 * Handles:
 * 1. Sidebar navigation & dynamic view switching
 * 2. Mobile drawer open/close & backdrop handling
 * 3. Notification & Profile dropdowns (with click-outside dismiss)
 * 4. Search input interaction & keyboard shortcuts
 * 5. Quick action navigation from Dashboard cards
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- Element Selectors ---
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
  const navLinks = document.querySelectorAll('.nav-link[data-view]');
  const viewSections = document.querySelectorAll('.view-section');

  // Header Elements
  const headerPageTitle = document.getElementById('headerPageTitle');
  const headerPageSubtext = document.getElementById('headerPageSubtext');
  const searchInput = document.getElementById('globalSearchInput');

  // Dropdowns
  const notifBtn = document.getElementById('notifBtn');
  const notifDropdown = document.getElementById('notifDropdown');
  const notifBadgeDot = document.getElementById('notifBadgeDot');
  const profileTrigger = document.getElementById('profileTrigger');
  const profileDropdown = document.getElementById('profileDropdown');

  // Interactive buttons linking to views
  const actionNavButtons = document.querySelectorAll('[data-target-view]');

  // --- Module Metadata for Header Updates ---
  const viewMetadata = {
    dashboard: {
      title: 'Executive Dashboard',
      subtitle: 'Overview of real-time farm health, AI advisories, and conditions.'
    },
    crop: {
      title: 'AI Crop Recommendation',
      subtitle: 'Analyze soil nutrients (N, P, K, pH) and weather to predict optimal crops.'
    },
    irrigation: {
      title: 'Smart Irrigation Advisor',
      subtitle: 'Calculate daily water requirements and automated watering schedules.'
    },
    fertilizer: {
      title: 'Fertilizer Guidance',
      subtitle: 'Diagnose nutrient deficiencies and generate precise application dosages.'
    },
    weather: {
      title: 'Weather & Agrometeorology',
      subtitle: 'Localized weather forecasts with actionable agronomic advisories.'
    },
    history: {
      title: 'Consultation History',
      subtitle: 'Review, compare, and export past AI crop and soil recommendations.'
    }
  };

  // ========================================================================
  // 1. Navigation & View Switching Logic
  // ========================================================================

  /**
   * Switches the active view and synchronizes sidebar state and header titles
   * @param {string} viewId - ID of the target view (e.g. 'dashboard', 'crop')
   */
  function navigateToView(viewId) {
    if (!viewId) return;

    // 1. Update Sidebar Active State
    navLinks.forEach(link => {
      if (link.dataset.view === viewId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // 2. Switch Visible Section
    viewSections.forEach(section => {
      if (section.id === `view-${viewId}`) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });

    // 3. Update Header Page Title & Subtext
    if (viewMetadata[viewId]) {
      headerPageTitle.textContent = viewMetadata[viewId].title;
      headerPageSubtext.textContent = viewMetadata[viewId].subtitle;
    }

    // 4. Close Mobile Drawer if open
    closeMobileSidebar();

    // 5. Scroll to top of content smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Bind click event to sidebar nav items
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = link.dataset.view;
      navigateToView(targetView);
    });
  });

  // Global event delegation for any element with [data-target-view]
  document.addEventListener('click', (e) => {
    const targetTrigger = e.target.closest('[data-target-view]');
    if (targetTrigger) {
      e.preventDefault();
      const targetView = targetTrigger.dataset.targetView;
      navigateToView(targetView);
    }
  });

  // ========================================================================
  // 2. Mobile Sidebar Drawer Handling
  // ========================================================================

  function openMobileSidebar() {
    sidebar.classList.add('mobile-open');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeMobileSidebar() {
    sidebar.classList.remove('mobile-open');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openMobileSidebar);
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', closeMobileSidebar);
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeMobileSidebar);
  }

  // ========================================================================
  // 3. Dropdowns (Notifications & Profile) with Click-Outside Handling
  // ========================================================================

  function closeAllDropdowns() {
    if (notifDropdown) notifDropdown.classList.remove('open');
    if (profileDropdown) profileDropdown.classList.remove('open');
  }

  // Toggle Notification Panel
  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = notifDropdown.classList.contains('open');
      closeAllDropdowns();
      if (!isOpen) {
        notifDropdown.classList.add('open');
        // Dismiss unread indicator dot on open
        if (notifBadgeDot) {
          notifBadgeDot.style.display = 'none';
        }
      }
    });
  }

  // Toggle Profile Dropdown
  if (profileTrigger && profileDropdown) {
    profileTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = profileDropdown.classList.contains('open');
      closeAllDropdowns();
      if (!isOpen) {
        profileDropdown.classList.add('open');
      }
    });
  }

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-panel') &&
        !e.target.closest('#notifBtn') &&
        !e.target.closest('#profileTrigger')) {
      closeAllDropdowns();
    }
  });

  // ========================================================================
  // 4. Search Bar & Keyboard Shortcuts
  // ========================================================================

  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) return;

        // Simple UX feedback for search
        if (query.includes('crop') || query.includes('wheat') || query.includes('seed')) {
          navigateToView('crop');
        } else if (query.includes('water') || query.includes('irrig')) {
          navigateToView('irrigation');
        } else if (query.includes('fertil') || query.includes('npk')) {
          navigateToView('fertilizer');
        } else if (query.includes('weather') || query.includes('rain')) {
          navigateToView('weather');
        } else if (query.includes('hist') || query.includes('log')) {
          navigateToView('history');
        } else {
          // Provide friendly non-intrusive feedback
          searchInput.blur();
          alert(`Search for "${query}": Explore modules via the sidebar or quick actions.`);
        }
      }
    });
  }

  // Keyboard accessibility:
  // - Press '/' or 'Ctrl+K' to focus search
  // - Press 'Escape' to dismiss dropdowns and mobile drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDropdowns();
      closeMobileSidebar();
    } else if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && document.activeElement !== searchInput) {
      if (searchInput) {
        e.preventDefault();
        searchInput.focus();
      }
    }
  });

  // Log successful initialisation
  console.log('AgriSmart AI — Dashboard Shell Initialized successfully (Part 2)');
});
