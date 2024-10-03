import { IUnifiedApp } from 'unified-app';


export function install(app: IUnifiedApp) {
  app.addActions({
    'get-admin-header-links': {
      method: 'get',
      path: '/admin/header/links',
      handler: () => {      
        return [
          {
            label: 'Dashboard',
            to: { name: 'admin.dashboard' },
          },
          {
            label: 'User Control',
            children: [
              {
                label: 'Users',
                to: { name: 'admin.resources', params: { resourceIdentifier: 'users' } },
              },
            ],
          },
          {
            label: 'Poll',
            children: [
              {
                label: 'Questions',
                to: { name: 'admin.resources', params: { resourceIdentifier: 'questions' } },
              },
              {
                label: 'Answers',
                to: { name: 'admin.resources', params: { resourceIdentifier: 'answers' } },
              },
            ],
          },
        ];
      },
    },
  });
}