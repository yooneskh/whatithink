import type { IUnifiedApp } from 'unified-app';
import type { IUnifiedModel, IUnifiedController } from 'unified-resources';
import type { IBaseDocument } from 'unified-kv';
import { createUnifiedController } from 'unified-resources';


interface IAnswerBase {
  user?: string;
  question: string;
  submitterIp?: string;
  answer?: string;
  entries: string[];
} export interface IAnswer extends IAnswerBase, IBaseDocument {}

const AnswerSchema: IUnifiedModel<IAnswerBase> = {
  user: {
    type: 'string',
    ref: 'User',
  },
  question: {
    type: 'string',
    ref: 'Question',
    required: true,
  },
  submitterIp: {
    type: 'string',
    hidden: true,
  },
  answer: {
    type: 'string',
    ref: 'Answer',
  },
  entries: {
    type: 'string',
    array: true,
    required: true,
    hideInTable: true
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
      // requirePermission: 'admin.poll.answers.retrieve',
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
    'submit-answer': {
      method: 'post',
      path: '/answers/submit',
      rateLimit: {
        points: 3,
        windowDuration: 60_000 * 60,
        blockDuration: 60_000 * 60,
      },
      handler: async ({ user, request, body }) => {

        const ip = request?.headers?.get('x-forwarded-for') || undefined;

        const previousAnswer = await app.answers.find({
          filter: {
            ...(user ? { user: user._id } : { submitterIp: ip }),
            question: body.question,
          },
        });

        if (previousAnswer) {
          app.answers.update({
            resourceId: previousAnswer._id,
            payload: {
              entries: body.entries,
            },
          });
        }

        return app.answers.create({
          document: {
            user: user?._id,
            question: body.question,
            submitterIp: ip,
            entries: body.entries,
          },
        });

      },
    },
  });

}
