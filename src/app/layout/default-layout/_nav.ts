export const navItems = [
  {
    name: 'Projects',
    url: '/projects',
    icon: 'cilFolderOpen'
  },
  {
    name: 'AI Code Generator',
    url: '/ai-code-generator',
    icon: 'cilCode'
  },
  {
    name: 'Admin',
    url: '/admin',
    icon: 'cilSettings',
    children: [
      {
        name: 'Projects',
        url: '/admin/projects',
        icon: 'cilFolderOpen'
      },
      {
        name: 'Tools',
        url: '/admin/tools',
        icon: 'cilWrench'
      },
      {
        name: 'Credentials',
        url: '/admin/credentials',
        icon: 'cilLockLocked'
      }
    ]
  }
];
