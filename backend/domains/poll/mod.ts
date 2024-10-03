import { IUnifiedApp } from 'unified-app';
import { install as installQuestions } from './questions/mod.ts';
import { install as installAnswers } from './answers/mod.ts';


export function install(app: IUnifiedApp) {
  installQuestions(app);
  installAnswers(app);
}
