import type { IUnifiedApp } from 'unified-app';
import type { IUnifiedModel, IUnifiedController } from 'unified-resources';
import type { IBaseDocument } from 'unified-kv';
import { createUnifiedController } from 'unified-resources';


interface IAnswerBase {
  user: string;
  question: string;
  entries: string[];
} export interface IAnswer extends IAnswerBase, IBaseDocument {}

const AnswerSchema: IUnifiedModel<IAnswerBase> = {
  user: {
    type: 'string',
    ref: 'User',
    required: true,
  },
  question: {
    type: 'string',
    ref: 'Question',
    required: true,
  },
  entries: {
    type: 'string',
    array: true,
    required: true,
  },
};


declare module 'unified-app' {
  interface IUnifiedApp {
    answers: IUnifiedController<IAnswerBase>;
  }
}


export function install(app: IUnifiedApp) {

  app.addModel('Answer', AnswerSchema);

  app.answers = createUnifiedController<IAnswerBase>(app, 'Answer', AnswerSchema);


  app.addActions({
    'meta': {
      method: 'get',
      path: '/answers/meta',
      requirePermission: 'admin.poll.answers.meta',
      handler: () => {
        return app.models['Answer'];
      },
    },
    'list': {
      template: 'list',
      controller: app.answers,
      pathPrefix: '/answers',
      requirePermission: 'admin.poll.answers.list',
    },
    'count': {
      template: 'count',
      controller: app.answers,
      pathPrefix: '/answers',
      requirePermission: 'admin.poll.answers.count',
    },
    'retrieve': {
      template: 'retrieve',
      controller: app.answers,
      pathPrefix: '/answers',
      requirePermission: 'admin.poll.answers.retrieve',
    },
    'create': {
      template: 'create',
      controller: app.answers,
      pathPrefix: '/answers',
      requirePermission: 'admin.poll.answers.create',
    },
    'update': {
      template: 'update',
      controller: app.answers,
      pathPrefix: '/answers',
      requirePermission: 'admin.poll.answers.update',
    },
    'replace': {
      template: 'replace',
      controller: app.answers,
      pathPrefix: '/answers',
      requirePermission: 'admin.poll.answers.replace',
    },
    'delete': {
      template: 'delete',
      controller: app.answers,
      pathPrefix: '/answers',
      requirePermission: 'admin.poll.answers.delete',
    },
  });

}