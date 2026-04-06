export type PageId = 
  | 'home'
  | 'act-now'
  | 'situations'
  | 'phrases'
  | 'audios'
  | 'exercises'
  | 'plan'
  | 'checklist'
  | 'crisis-detail'
  | 'situation-detail'
  | 'quiz'
  | 'login'
  | 'login-loading'
  | 'login-error';

export type TabId = 'home' | 'act-now' | 'situations' | 'audios' | 'plan';

export type QuizContext = 'Em público' | 'Em casa' | 'Na hora do banho ou de dormir' | 'Quando precisa parar algo que quer';
export type QuizTrigger = 'Ele escuta um “não”' | 'Quer algo e não consegue' | 'Precisa parar o que está fazendo' | 'Já está cansado ou irritado';
export type QuizReaction = 'Repito várias vezes' | 'Acabo gritando' | 'Tento negociar' | 'Cedo para evitar confusão';
export type QuizPain = 'Me estresso e perco a paciência' | 'Passo vergonha na frente dos outros' | 'Parece que ele não me respeita' | 'Sinto que nada funciona';
export type QuizIntensity = 'baixa' | 'média' | 'alta' | 'muito alta';

export interface QuizAnswers {
  context: QuizContext;
  trigger: QuizTrigger;
  reaction: QuizReaction;
  pain: QuizPain;
  intensity: QuizIntensity;
}
