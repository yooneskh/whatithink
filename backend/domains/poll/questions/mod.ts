import type { IUnifiedApp } from 'unified-app';
import type { IUnifiedModel, IUnifiedController } from 'unified-resources';
import type { IBaseDocument } from 'unified-kv';
import { createUnifiedController } from 'unified-resources';


interface IQuestionBase {
  user: string;
  name: string;
  slug: string;
  entries: {
    name: string;
    image?: string;
  }[];
} export interface IQuestion extends IQuestionBase, IBaseDocument {}

const QuestionSchema: IUnifiedModel<IQuestionBase> = {
  user: {
    type: 'string',
    ref: 'User',
    required: true,
  },
  name: {
    type: 'string',
    required: true,
    titleable: true,
  },
  slug: {
    type: 'string',
    required: true,
    hideInTable: true,
  },
  entries: {
    type: 'series',
    required: true,
    seriesColumns: 3,
    hideInTable: true,
    seriesSchema: {
      name: {
        type: 'string',
        required: true,
        width: 6,
      },
      image: {
        type: 'string',
        ref: 'Media',
        width: 6,
      },
    },
  },
};


declare module 'unified-app' {
  interface IUnifiedApp {
    questions: IUnifiedController<IQuestionBase>;
  }
}


export function install(app: IUnifiedApp) {

  app.addModel('Question', QuestionSchema);

  app.questions = createUnifiedController<IQuestionBase>(app, 'Question', QuestionSchema);


  app.addActions({
    'meta': {
      method: 'get',
      path: '/questions/meta',
      requirePermission: 'admin.poll.questions.meta',
      handler: () => {
        return app.models['Question'];
      },
    },
    'list': {
      template: 'list',
      controller: app.questions,
      pathPrefix: '/questions',
    },
    'count': {
      template: 'count',
      controller: app.questions,
      pathPrefix: '/questions',
    },
    'retrieve': {
      template: 'retrieve',
      controller: app.questions,
      pathPrefix: '/questions',
    },
    'create': {
      template: 'create',
      controller: app.questions,
      pathPrefix: '/questions',
      permissionFunction: ({ user, hasPermission, body }) => {
        return hasPermission('admin.poll.questions.create') || (user && user._id === body.user);
      },
    },
    'update': {
      template: 'update',
      controller: app.questions,
      pathPrefix: '/questions',
      requirePermission: 'admin.poll.questions.update',
    },
    'replace': {
      template: 'replace',
      controller: app.questions,
      pathPrefix: '/questions',
      requirePermission: 'admin.poll.questions.replace',
    },
    'delete': {
      template: 'delete',
      controller: app.questions,
      pathPrefix: '/questions',
      requirePermission: 'admin.poll.questions.delete',
    },
  });

}
