export type PageId = 
  | 'home'
  | 'now'
  | 'crises'
  | 'phrases'
  | 'audios'
  | 'prevent'
  | 'crisis-detail'
  | 'phrase-category'
  | 'audio-player'
  | 'trainer'
  | 'plan-day'
  | 'recover-control'
  | 'quiz'
  | 'login'
  | 'login-loading'
  | 'login-error'
  // Legacy IDs for backwards compatibility
  | 'act-now'
  | 'situations'
  | 'exercises'
  | 'plan'
  | 'checklist'
  | 'situation-detail';

export type TabId = 'now' | 'crises' | 'phrases' | 'audios' | 'prevent'
  // Legacy IDs for backwards compatibility
  | 'home'
  | 'act-now'
  | 'situations'
  | 'plan';

export type QuizContext = 'Em público' | 'Em casa' | 'Na hora do banho ou de dormir' | 'Quando precisa parar algo que quer';
export type QuizTrigger = 'Ele escuta um "não"' | 'Quer algo e não consegue' | 'Precisa parar o que está fazendo' | 'Já está cansado ou irritado';
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