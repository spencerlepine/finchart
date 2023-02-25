const config = {
  pageLinks: [
    {
      title: 'Reports',
      path: '/reports',
    },
    {
      title: 'Compare',
      path: '/compare',
    },
  ],
  settingLinks: [
    {
      title: 'Dashboard',
      path: '/dashboard',
    },
    {
      title: 'Settings',
      path: '/settings',
    },
    {
      title: 'Logout',
      path: '/logout',
    },
  ],
  INITIAL_FORM_PAGE_ID: 'income',
  FORM_PAGES_ORDER: [
    'income',
    'taxes',
    'spending',
    'investing',
    'savings',
    'cash',
    'assets',
    'liabilites',
    'goals',
    'credit-cards',
  ],
};

export default config;
