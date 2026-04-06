/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  MessageSquare, 
  Zap, 
  CheckSquare, 
  Clock, 
  Play, 
  CheckCircle2, 
  Info, 
  User, 
  Home as HomeIcon, 
  Calendar, 
  Sparkles, 
  Music, 
  ListTodo,
  ChevronRight,
  ArrowLeft,
  Hand,
  Brain,
  Target,
  Quote,
  Compass,
  AlertTriangle,
  XCircle,
  Volume2
} from 'lucide-react';
import { cn } from './lib/utils';
import { PageId, TabId, QuizAnswers, QuizContext, QuizTrigger, QuizReaction, QuizPain, QuizIntensity } from './types';

// --- Personalization Logic ---

const getPersonalizedContent = (answers: QuizAnswers | null) => {
  const defaults = {
    headline: "Plano Anti-Birra",
    subheadline: "Firmeza e menos estresse",
    supportMessage: "Vamos reduzir o estresse e trazer mais clareza para esses momentos.",
    urgencyText: "Seu plano foi organizado para corrigir o padrão antes que ele se fortaleça.",
    mainCardTitle: "O que fazer agora",
    recommendedAudio: "Como agir sem gritar",
    recommendedExercise: "Treino do \"não\" firme"
  };

  if (!answers) return defaults;

  const content = { ...defaults };

  // Contexto -> Headline & Main Card
  if (answers.context === 'Em público') {
    content.headline = "Vamos começar pelas situações em público.";
    content.mainCardTitle = "O que fazer quando a birra acontece em público";
  } else if (answers.context === 'Em casa') {
    content.headline = "Vamos começar pelas situações do dia a dia em casa.";
    content.mainCardTitle = "Como lidar com birras e enfrentamento em casa";
  } else if (answers.context === 'Na hora do banho ou de dormir') {
    content.headline = "Vamos começar pelas transições mais cansativas do dia.";
    content.mainCardTitle = "O que fazer no banho ou na hora de dormir";
  } else if (answers.context === 'Quando precisa parar algo que quer') {
    content.headline = "Vamos começar pelos momentos em que ele precisa parar algo que quer.";
    content.mainCardTitle = "Como agir quando ele não quer parar";
  }

  // Gatilho -> Subheadline, Audio, Exercise
  if (answers.trigger === 'Ele escuta um “não”') {
    content.subheadline = "Seu resultado mostrou mais dificuldade quando seu filho recebe limites ou escuta um “não”.";
    content.recommendedAudio = "Como agir sem voltar atrás";
    content.recommendedExercise = "Treino do “não” firme";
  } else if (answers.trigger === 'Quer algo e não consegue') {
    content.subheadline = "Seu resultado mostrou mais birras ligadas à frustração imediata.";
    content.recommendedAudio = "Como responder sem reforçar insistência";
    content.recommendedExercise = "Reduzir insistência";
  } else if (answers.trigger === 'Precisa parar o que está fazendo') {
    content.subheadline = "Seu resultado mostrou mais dificuldade nos momentos em que ele precisa parar algo que quer fazer.";
    content.recommendedAudio = "Como conduzir transições sem escalar";
    content.recommendedExercise = "Parar sem birra";
  } else if (answers.trigger === 'Já está cansado ou irritado') {
    content.subheadline = "Seu resultado mostrou que o comportamento costuma piorar quando ele já está cansado ou irritado.";
    content.recommendedAudio = "Como agir no fim do dia sem gritar";
    content.recommendedExercise = "Resposta sem explosão";
  }

  // Reação -> Support Message, Audio, Exercise (Overrides if applicable)
  if (answers.reaction === 'Repito várias vezes') {
    content.supportMessage = "Seu plano vai priorizar respostas mais claras e menos repetição.";
    content.recommendedAudio = "Como parar de repetir e ser mais firme";
    content.recommendedExercise = "Treino do comando curto";
  } else if (answers.reaction === 'Acabo gritando') {
    content.supportMessage = "Seu plano vai priorizar controle emocional e resposta firme sem gritar.";
    content.recommendedAudio = "Como agir sem gritar";
    content.recommendedExercise = "Resposta sem explosão";
  } else if (answers.reaction === 'Tento negociar') {
    content.supportMessage = "Seu plano vai priorizar clareza de limite e menos negociação no calor do momento.";
    content.recommendedAudio = "Como manter o limite sem entrar em discussão";
    content.recommendedExercise = "Treino do limite sem barganha";
  } else if (answers.reaction === 'Cedo para evitar confusão') {
    content.supportMessage = "Seu plano vai priorizar firmeza e constância para reduzir o ciclo da insistência.";
    content.recommendedAudio = "Como parar de ceder sem piorar a situação";
    content.recommendedExercise = "Sustentar o limite até o fim";
  }

  // Dor -> Emotional Text
  if (answers.pain === 'Me estresso e perco a paciência') {
    content.supportMessage = "Vamos reduzir o estresse e trazer mais clareza para esses momentos.";
  } else if (answers.pain === 'Passo vergonha na frente dos outros') {
    content.supportMessage = "Vamos começar pelas situações em que a birra mais expõe você.";
  } else if (answers.pain === 'Parece que ele não me respeita') {
    content.supportMessage = "Vamos trabalhar respostas mais firmes para recuperar clareza e limite.";
  } else if (answers.pain === 'Sinto que nada funciona') {
    content.supportMessage = "Vamos simplificar o que fazer para você sair da tentativa e erro.";
  }

  // Intensidade -> Urgency Text
  if (answers.intensity === 'baixa') {
    content.urgencyText = "Seu caso ainda parece mais leve, e agir cedo pode evitar que isso cresça.";
  } else if (answers.intensity === 'média') {
    content.urgencyText = "Seu plano foi organizado para corrigir o padrão antes que ele se fortaleça.";
  } else if (answers.intensity === 'alta') {
    content.urgencyText = "Como isso já aparece com frequência, seu plano vai priorizar respostas mais rápidas e mais consistentes.";
  } else if (answers.intensity === 'muito alta') {
    content.urgencyText = "Como isso já virou um padrão mais forte, seu plano vai começar pelo que tende a trazer mais diferença no curto prazo.";
  }

  return content;
};

// --- Components ---

const Background = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-background bg-pattern">
    <motion.div 
      animate={{ opacity: [0.05, 0.1, 0.05] }}
      transition={{ duration: 8, repeat: Infinity }}
      className="absolute top-10 right-10"
    >
      <img 
        src="https://res.cloudinary.com/dbwe8j1uq/image/upload/v1775417666/Gemini_Generated_Image_ta0mvnta0mvnta0m-removebg-preview_mqyzbt.png" 
        alt="" 
        className="w-[416px] h-[166px] object-contain brightness-0 invert"
        referrerPolicy="no-referrer"
      />
    </motion.div>
    <motion.div 
      animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.15, 0.05] }}
      transition={{ duration: 6, repeat: Infinity }}
      className="absolute bottom-40 left-10 text-secondary/10"
    >
      <Compass size={40} />
    </motion.div>
    <motion.div 
      animate={{ x: [-10, 10, -10] }}
      transition={{ duration: 12, repeat: Infinity }}
      className="absolute top-1/3 left-1/4 text-white/5"
    >
      <Brain size={60} />
    </motion.div>
    <div className="absolute top-1/2 right-1/4 opacity-5">
      <CheckSquare size={100} />
    </div>
  </div>
);

const Card = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void, key?: React.Key }) => (
  <motion.div 
    whileTap={onClick ? { scale: 0.98 } : undefined}
    onClick={onClick}
    className={cn("bg-card p-5 rounded-2xl border border-white/5 shadow-sm", className)}
  >
    {children}
  </motion.div>
);

const Button = ({ children, onClick, variant = 'primary', className }: { children: React.ReactNode, onClick: () => void, variant?: 'primary' | 'secondary' | 'outline', className?: string }) => {
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-secondary text-white hover:bg-secondary/90",
    outline: "border border-white/20 text-white hover:bg-white/5"
  };
  
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn("w-full py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2", variants[variant], className)}
    >
      {children}
    </motion.button>
  );
};

// --- Pages ---

const Quiz = ({ onComplete }: { onComplete: (answers: QuizAnswers) => void }) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});

  const questions = [
    {
      id: 'context',
      question: 'Onde a birra ou desobediência mais acontece?',
      options: ['Em público', 'Em casa', 'Na hora do banho ou de dormir', 'Quando precisa parar algo que quer']
    },
    {
      id: 'trigger',
      question: 'As birras do seu filho geralmente começam quando:',
      options: ['Ele escuta um “não”', 'Quer algo e não consegue', 'Precisa parar o que está fazendo', 'Já está cansado ou irritado']
    },
    {
      id: 'reaction',
      question: 'O que costuma acontecer com você nesses momentos?',
      options: ['Repito várias vezes', 'Acabo gritando', 'Tento negociar', 'Cedo para evitar confusão']
    },
    {
      id: 'pain',
      question: 'O que mais te incomoda nessas situações?',
      options: ['Me estresso e perco a paciência', 'Passo vergonha na frente dos outros', 'Parece que ele não me respeita', 'Sinto que nada funciona']
    },
    {
      id: 'intensity',
      question: 'Com que frequência e há quanto tempo isso acontece?',
      options: ['baixa', 'média', 'alta', 'muito alta'],
      label: 'Intensidade percebida'
    }
  ];

  const currentQuestion = questions[step - 1];

  const handleOption = (option: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: option };
    setAnswers(newAnswers);
    if (step < questions.length) {
      setStep(step + 1);
    } else {
      onComplete(newAnswers as QuizAnswers);
    }
  };

  return (
    <div className="flex flex-col h-screen p-8 justify-between relative z-10">
      <div className="mt-10">
        <div className="flex gap-2 mb-8">
          {questions.map((_, i) => (
            <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors", i < step ? "bg-primary" : "bg-white/10")} />
          ))}
        </div>
        <motion.div
          key={step}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold leading-tight">{currentQuestion.question}</h2>
          <div className="space-y-3">
            {currentQuestion.options.map(option => (
              <Card key={option} onClick={() => handleOption(option)} className="hover:border-primary/50 transition-colors cursor-pointer">
                <p className="font-medium">{option}</p>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const Login = ({ onLogin }: { onLogin: (email: string) => void }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }
    onLogin(email);
  };

  return (
    <div className="flex flex-col h-screen p-8 justify-center relative z-10">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="space-y-4"
      >
        <div className="text-center">
          <div className="w-[85vw] max-w-[437px] h-auto aspect-[416/166] flex items-center justify-center mx-auto">
            <img 
              src="https://res.cloudinary.com/dbwe8j1uq/image/upload/v1775417666/Gemini_Generated_Image_ta0mvnta0mvnta0m-removebg-preview_mqyzbt.png" 
              alt="Logo" 
              className="w-full h-full object-contain brightness-0 invert"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-1 mt-[-16px]">
            <h1 className="text-xl font-bold">Plano de Ação Anti-Birra</h1>
            <p className="text-primary font-semibold text-sm">Acesse com o e-mail usado na sua compra</p>
          </div>
          <p className="text-text-muted text-sm px-4">
            Use o mesmo e-mail informado no pagamento para liberar seu acesso ao aplicativo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-text-muted ml-1">Seu e-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full bg-card border border-white/10 rounded-xl py-4 px-4 text-white focus:border-primary outline-none transition-colors"
            />
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <Button onClick={() => {}} className="mt-4">Entrar no meu plano</Button>
          
          <p className="text-[10px] text-center text-text-muted px-6 leading-relaxed">
            Se sua compra foi aprovada recentemente, a liberação pode levar alguns minutos.
          </p>
        </form>
      </motion.div>
    </div>
  );
};

const LoginLoading = () => (
  <div className="flex flex-col h-screen items-center justify-center p-8 relative z-10">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      className="text-primary mb-6"
    >
      <Sparkles size={48} />
    </motion.div>
    <h2 className="text-xl font-bold">Verificando seu acesso...</h2>
  </div>
);

const LoginError = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col h-screen p-8 justify-center relative z-10">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center space-y-8"
    >
      <div className="bg-red-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
        <AlertTriangle size={40} className="text-red-500" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Não encontramos seu acesso</h2>
        <p className="text-text-muted text-sm">
          Verifique se você usou o mesmo e-mail da compra. Se o pagamento foi aprovado há pouco tempo, aguarde alguns minutos e tente novamente.
        </p>
      </div>

      <div className="space-y-3">
        <Button onClick={onRetry}>Tentar novamente</Button>
        <Button onClick={() => window.open('mailto:suporte@exemplo.com')} variant="outline">
          Falar com suporte
        </Button>
      </div>
    </motion.div>
  </div>
);

const Home = ({ setPage, quizAnswers, onLogout }: { setPage: (p: PageId) => void, quizAnswers: QuizAnswers | null, onLogout: () => void }) => {
  const content = getPersonalizedContent(quizAnswers);
  
  return (
    <div className="space-y-6">
      <img 
        src="https://res.cloudinary.com/dbwe8j1uq/image/upload/v1775495277/ChatGPT_Image_6_de_abr._de_2026_13_54_37_km51kx.webp" 
        alt="" 
        className="w-full h-auto rounded-xl object-cover"
        referrerPolicy="no-referrer"
      />
      
      <div className="flex items-center justify-between">
        <div className="flex-1 pr-4">
          <h2 className="text-xl font-bold leading-tight">{content.headline}</h2>
          <p className="text-text-muted text-xs mt-1">{content.subheadline}</p>
        </div>
        <button onClick={onLogout} className="w-12 h-12 rounded-full bg-card flex items-center justify-center border border-white/10 shrink-0 hover:bg-white/5 transition-colors">
          <User size={24} className="text-primary" />
        </button>
      </div>

      {/* Support and Urgency Messages */}
      <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 space-y-1">
        <p className="text-sm text-primary font-semibold">{content.supportMessage}</p>
        <p className="text-[11px] text-text-muted italic">{content.urgencyText}</p>
      </div>

      {/* Main Crisis Card */}
      <Card onClick={() => setPage('act-now')} className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500/20 relative overflow-hidden">
        <div className="absolute -right-4 -top-4 opacity-10">
          <Zap size={100} />
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="bg-red-500/20 p-3 rounded-xl">
            <Zap className="text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg leading-tight">{content.mainCardTitle}</h3>
            <p className="text-xs text-text-muted mt-1">Se seu filho está em crise, comece por aqui</p>
          </div>
        </div>
        <Button variant="primary" onClick={() => setPage('act-now')} className="mt-4 py-2 bg-red-500 hover:bg-red-600 relative z-10 text-sm">
          Ver orientação rápida
        </Button>
      </Card>

      {/* Recommended Section */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Recomendações para você</h4>
        <div className="grid grid-cols-1 gap-3">
          <Card onClick={() => setPage('audios')} className="flex items-center gap-4 py-3 bg-purple-500/5 border-purple-500/10">
            <div className="bg-purple-500/20 p-2 rounded-full">
              <Play size={16} className="text-purple-500 fill-purple-500" />
            </div>
            <div className="flex-1">
              <p className="text-[9px] text-purple-400 uppercase font-bold tracking-wider">Áudio Recomendado</p>
              <p className="text-sm font-bold">{content.recommendedAudio}</p>
            </div>
            <ChevronRight size={16} className="text-text-muted" />
          </Card>
          <Card onClick={() => setPage('exercises')} className="flex items-center gap-4 py-3 bg-orange-500/5 border-orange-500/10">
            <div className="bg-orange-500/20 p-2 rounded-full">
              <Target size={16} className="text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-[9px] text-orange-400 uppercase font-bold tracking-wider">Exercício Recomendado</p>
              <p className="text-sm font-bold">{content.recommendedExercise}</p>
            </div>
            <ChevronRight size={16} className="text-text-muted" />
          </Card>
        </div>
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card onClick={() => setPage('situations')} className="flex flex-col gap-3">
          <div className="bg-blue-500/10 w-fit p-2 rounded-lg">
            <MessageSquare size={20} className="text-blue-500" />
          </div>
          <h4 className="font-bold text-sm">Situações</h4>
          <p className="text-[10px] text-text-muted">Dia a dia real</p>
        </Card>
        <Card onClick={() => setPage('phrases')} className="flex flex-col gap-3">
          <div className="bg-green-500/10 w-fit p-2 rounded-lg">
            <Quote size={20} className="text-green-500" />
          </div>
          <h4 className="font-bold text-sm">Frases prontas</h4>
          <p className="text-[10px] text-text-muted">O que dizer</p>
        </Card>
      </div>

      {/* Plan Card */}
      <Card onClick={() => setPage('plan')} className="flex items-center gap-4 bg-primary/5 border-primary/10">
        <div className="bg-primary/20 p-3 rounded-xl">
          <Calendar className="text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-sm">Plano de 7 dias</h3>
          <p className="text-[10px] text-text-muted">Sua jornada de mudança</p>
        </div>
        <ChevronRight className="ml-auto text-text-muted" size={18} />
      </Card>
    </div>
  );
};

const GenericPage = ({ title, icon: Icon, children, onBack }: { title: string, icon: any, children: React.ReactNode, onBack: () => void }) => (
  <div className="space-y-6">
    <div className="flex items-center gap-4">
      <button onClick={onBack} className="p-2 bg-card rounded-xl border border-white/5">
        <ArrowLeft size={20} />
      </button>
      <h2 className="text-xl font-bold">{title}</h2>
      {Icon && <Icon className="ml-auto text-primary" size={24} />}
    </div>
    {children}
  </div>
);

// --- Content Data ---

const CRISIS_DATA = [
  { 
    id: 'gritando', 
    label: 'Ele está gritando', 
    icon: MessageSquare,
    meaning: 'Quando a criança começa a gritar, normalmente a situação já saiu do ponto da explicação.',
    todo: ['Fale pouco', 'Mantenha a voz firme e baixa', 'Não tente convencer no meio da crise', 'Mantenha o limite com clareza'],
    avoid: ['Gritar de volta', 'Explicar demais', 'Ameaçar', 'Mudar a decisão só para o grito parar'],
    phrase: 'Eu entendi que você ficou bravo, mas eu não vou mudar isso agora.',
    video: 'avLfgKBPf8o'
  },
  { 
    id: 'chao', 
    label: 'Ele se jogou no chão', 
    icon: Hand,
    meaning: 'Quando a crise chega nesse nível, o mais importante é não transformar a cena em discussão.',
    todo: ['Garanta segurança', 'Fale pouco', 'Mantenha o limite', 'Espere a intensidade baixar antes de explicar'],
    avoid: ['Negociar na hora', 'Ameaçar', 'Voltar atrás para encerrar a cena rápido'],
    phrase: 'Eu sei que você ficou bravo, mas a resposta continua a mesma.',
    video: 'avLfgKBPf8o'
  },
  { 
    id: 'enfrentando', 
    label: 'Ele está me enfrentando', 
    icon: ShieldCheck,
    meaning: 'Quando a criança enfrenta, a tendência do adulto é endurecer no impulso ou entrar em disputa.',
    todo: ['Mantenha postura firme', 'Não entre em debate longo', 'Fale de forma curta', 'Sustente o limite'],
    avoid: ['Ironia', 'Humilhação', 'Repetir sem direção', 'Transformar em confronto verbal'],
    phrase: 'Você pode não gostar, mas eu continuo sendo clara no que estou dizendo.',
    video: 'avLfgKBPf8o'
  },
  { 
    id: 'nada-funciona', 
    label: 'Nada do que eu faço funciona', 
    icon: AlertTriangle,
    meaning: 'Quando nada parece funcionar, geralmente o problema não é falta de esforço. É falta de uma resposta mais clara para aquele momento.',
    todo: ['Simplifique sua resposta', 'Fale menos', 'Mantenha uma única direção', 'Foque em não escalar mais a crise'],
    avoid: ['Testar várias coisas ao mesmo tempo', 'Mudar de estratégia a cada minuto', 'Agir no desespero'],
    phrase: 'Eu vou continuar com calma, mas não vou mudar isso agora.',
    video: '_yMtYNK7OuY'
  },
  { 
    id: 'explodir', 
    label: 'Eu estou quase explodindo', 
    icon: Brain,
    meaning: 'Quando você chega nesse ponto, a crise já atingiu também o seu limite emocional.',
    todo: ['Pare por dois segundos', 'Respire', 'Fale o mínimo necessário', 'Reduza a velocidade da sua resposta'],
    avoid: ['Reagir no impulso', 'Continuar falando sem parar', 'Querer resolver tudo naquele segundo'],
    phrase: 'Eu vou continuar, mas preciso falar com calma.',
    video: '4OFRAiE-FW4'
  }
];

const AUDIOS_DATA = [
  { id: 'agir-sem-gritar', title: 'Como agir sem gritar', file: 'COMO AGIR SEM GRITAR.mp3' },
  { id: 'quando-ele-grita', title: 'O que fazer quando ele grita', file: 'O QUE FAZER QUANDO ELE GRITA.mp3' },
  { id: 'quando-se-joga-chao', title: 'O que fazer quando se joga no chão', file: 'O QUE FAZER QUANDO ELE SE JOGA NO CHÃO.mp3' },
  { id: 'no-mercado', title: 'Como agir no mercado', file: 'COMO AGIR NO MERCADO.mp3' },
  { id: 'no-limite', title: 'Quando você está no limite', file: 'QUANDO VOCÊ ESTÁ NO LIMITE.mp3' },
  { id: 'manter-firmeza', title: 'Como manter firmeza sem ceder', file: 'COMO MANTER FIRMEZA SEM CEDER.mp3' },
];

const SITUATIONS_DATA = [ 
  { 
    id: 'mercado', 
    label: 'Mercado', 
    icon: ListTodo,
    meaning: 'No mercado, a birra cresce junto com a frustração e a pressão do ambiente.',
    todo: ['Fale pouco', 'Mantenha a decisão', 'Não negocie no impulso', 'Priorize clareza e saída rápida'],
    avoid: ['Ceder por vergonha', 'Discutir no corredor', 'Explicar demais'],
    phrase: 'Eu sei que você quer, mas hoje não vou levar.',
    video: 'avLfgKBPf8o'
  },
  { 
    id: 'banho', 
    label: 'Banho', 
    icon: Sparkles,
    meaning: 'O banho gera resistência quando interrompe outra atividade ou no cansaço.',
    todo: ['Avise antes', 'Frases curtas', 'Mantenha transição', 'Conduza com calma'],
    avoid: ['Transformar em discussão', 'Tempos extras', 'Voltar atrás'],
    phrase: 'Agora é hora do banho. Depois continua.',
    video: 'avLfgKBPf8o'
  },
  { 
    id: 'sair', 
    label: 'Hora de sair', 
    icon: Clock,
    meaning: 'Sair de casa ou encerrar atividade gera crise com mudança.',
    todo: ['Avise antes', 'Mostre o que vai acontecer', 'Mantenha decisão', 'Reduza fala'],
    avoid: ['Avisar e não cumprir', 'Negociar muito', 'Mudar combinado'],
    phrase: 'Agora vamos sair. Eu sei que você não gostou, mas vamos.',
    video: 'avLfgKBPf8o'
  },
  { 
    id: 'visitas', 
    label: 'Visitas', 
    icon: User,
    meaning: 'Em visitas, a criança fica mais estimulada e a mãe mais pressionada.',
    todo: ['Mantenha mesma regra', 'Fale pouco', 'Afaste se necessário', 'Não ceda por julgamento'],
    avoid: ['Relaxar limites', 'Agir pelos outros', 'Mudar regra para acabar'],
    phrase: 'Você pode ficar bravo, mas não vou mudar isso.',
    video: 'avLfgKBPf8o'
  },
  { 
    id: 'tela', 
    label: 'Tela', 
    icon: Zap,
    meaning: 'A interrupção da tela gera crise porque a criança quer continuar.',
    todo: ['Avise antes do fim', 'Desligue na hora', 'Mantenha decisão', 'Redirecione'],
    avoid: ['Sem aviso', 'Voltar atrás', 'Discutir demais'],
    phrase: 'A tela acabou. Vamos para outra.',
    video: 'avLfgKBPf8o'
  },
  { 
    id: 'brinquedos', 
    label: 'Guardar brinquedos', 
    icon: Target,
    meaning: 'Guardar é difícil porque encerra prazer e exige organização.',
    todo: ['Comando curto', 'Ajude no começo', 'Mantenha constância', 'Não transforme em briga'],
    avoid: ['Pedir sem direção', 'Fazer tudo pela criança', 'Desistir'],
    phrase: 'Hora de guardar. Vou começar com você.',
    video: 'avLfgKBPf8o'
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('login');
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [selectedCrisis, setSelectedCrisis] = useState<typeof CRISIS_DATA[0] | null>(null);
  const [selectedSituation, setSelectedSituation] = useState<typeof SITUATIONS_DATA[0] | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const session = localStorage.getItem('anti_birra_session');
    if (session === 'true') {
      setIsLoggedIn(true);
      setCurrentPage('home');
    } else {
      setCurrentPage('login');
    }
  }, []);

  const handleLogin = (email: string) => {
    setCurrentPage('login-loading');
    
    // Simulated validation delay
    setTimeout(() => {
      // Allow any email for testing
      const isAuthorized = true;
      
      if (isAuthorized) {
        setIsLoggedIn(true);
        localStorage.setItem('anti_birra_session', 'true');
        setCurrentPage('home');
      } else {
        setCurrentPage('login-error');
      }
    }, 2000);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('anti_birra_session');
    setCurrentPage('login');
  };

  const playAudio = (audioFile: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(`/${audioFile}`);
    audioRef.current.play();
    setPlayingAudio(audioFile);
    audioRef.current.onended = () => setPlayingAudio(null);
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingAudio(null);
  };

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    if (tab === 'home') setCurrentPage('home');
    if (tab === 'act-now') setCurrentPage('act-now');
    if (tab === 'situations') setCurrentPage('situations');
    if (tab === 'audios') setCurrentPage('audios');
    if (tab === 'plan') setCurrentPage('plan');
  };

  const renderContent = () => {
    if (!isLoggedIn && currentPage !== 'login' && currentPage !== 'login-loading' && currentPage !== 'login-error') {
      return <Login onLogin={handleLogin} />;
    }

    switch (currentPage) {
      case 'login':
        return <Login onLogin={handleLogin} />;
      case 'login-loading':
        return <LoginLoading />;
      case 'login-error':
        return <LoginError onRetry={() => setCurrentPage('login')} />;
      case 'home':
        return <Home setPage={setCurrentPage} quizAnswers={quizAnswers} onLogout={handleLogout} />;
      case 'quiz':
        return <Quiz onComplete={(answers) => { setQuizAnswers(answers); setCurrentPage('home'); }} />;
      case 'act-now':
        return (
          <GenericPage title="Agir Agora" icon={Zap} onBack={() => setCurrentPage('home')}>
            <div className="space-y-4">
              <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                <h3 className="font-bold text-sm mb-1">Seu filho está em crise agora?</h3>
                <p className="text-[10px] text-text-muted">Veja como agir sem piorar a situação.</p>
              </div>
              {CRISIS_DATA.map(item => (
                <Card key={item.id} onClick={() => { setSelectedCrisis(item); setCurrentPage('crisis-detail'); }} className="flex items-center gap-4">
                  <div className="bg-red-500/10 p-3 rounded-xl">
                    <item.icon size={20} className="text-red-500" />
                  </div>
                  <span className="font-bold text-sm">{item.label}</span>
                  <ChevronRight className="ml-auto text-text-muted" />
                </Card>
              ))}
            </div>
          </GenericPage>
        );
      case 'crisis-detail':
        return selectedCrisis && (
          <GenericPage title="Orientação" icon={Zap} onBack={() => setCurrentPage('act-now')}>
            <div className="space-y-4">
              <Card className="border-l-4 border-l-red-500">
                <h3 className="font-bold text-lg mb-4">{selectedCrisis.label}</h3>
                
                <section className="mb-4">
                  <h4 className="text-xs font-bold text-primary uppercase mb-2 flex items-center gap-1">
                    <Brain size={14} /> O que isso significa
                  </h4>
                  <p className="text-sm text-text-muted">{selectedCrisis.meaning}</p>
                </section>

                <section className="mb-4">
                  <h4 className="text-xs font-bold text-green-500 uppercase mb-2 flex items-center gap-1">
                    <CheckCircle2 size={14} /> O que fazer agora
                  </h4>
                  <ul className="space-y-2">
                    {selectedCrisis.todo.map((t, i) => (
                      <li key={i} className="text-sm text-text-muted flex gap-2">
                        <span className="text-green-500">•</span> {t}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="mb-4">
                  <h4 className="text-xs font-bold text-red-400 uppercase mb-2 flex items-center gap-1">
                    <XCircle size={14} /> O que evitar
                  </h4>
                  <ul className="space-y-2">
                    {selectedCrisis.avoid.map((a, i) => (
                      <li key={i} className="text-sm text-text-muted flex gap-2">
                        <span className="text-red-400">•</span> {a}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="mb-6 p-3 bg-primary/5 rounded-xl border border-primary/10">
                  <h4 className="text-xs font-bold text-primary uppercase mb-2 flex items-center gap-1">
                    <Quote size={14} /> Frase Pronta
                  </h4>
                  <p className="text-sm italic font-medium">"{selectedCrisis.phrase}"</p>
                </section>

                <Button onClick={() => setCurrentPage('audios')} variant="outline" className="py-3">
                  <Volume2 size={18} /> Ouvir áudio de apoio
                </Button>

                {selectedCrisis.video && (
                  <div className="mt-4 p-4 bg-card rounded-xl border border-white/5">
                    <p className="text-[10px] text-text-muted mb-2">🎥 Entenda melhor essa situação</p>
                    <p className="text-[9px] text-text-muted mb-3">Quando a crise chega nesse nível, é comum sentir que tudo saiu do controle. Mas na maioria das vezes, isso não começa ali. É um processo que foi se acumulando antes.</p>
                    <div className="relative w-full h-[180px] rounded-lg overflow-hidden">
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${selectedCrisis.video}?rel=0&playsinline=1`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </GenericPage>
        );
      case 'situations':
        return (
          <GenericPage title="Situações do Dia" icon={MessageSquare} onBack={() => setCurrentPage('home')}>
            <div className="space-y-4">
              <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                <h3 className="font-bold text-sm mb-1">Situações do dia a dia</h3>
                <p className="text-[10px] text-text-muted">Veja como agir nas situações em que a crise mais costuma aparecer.</p>
              </div>
              <div className="grid gap-4">
                {SITUATIONS_DATA.map(item => (
                  <Card key={item.id} onClick={() => { setSelectedSituation(item); setCurrentPage('situation-detail'); }} className="flex items-center gap-4">
                    <div className="bg-blue-500/10 p-3 rounded-xl">
                      <item.icon size={20} className="text-blue-500" />
                    </div>
                    <span className="font-bold text-sm">{item.label}</span>
                    <ChevronRight className="ml-auto text-text-muted" />
                  </Card>
                ))}
              </div>
            </div>
          </GenericPage>
        );
      case 'situation-detail':
        return selectedSituation && (
          <GenericPage title={selectedSituation.label} icon={MessageSquare} onBack={() => setCurrentPage('situations')}>
            <div className="space-y-4">
              <Card className="border-l-4 border-l-blue-500">
                <section className="mb-4">
                  <h4 className="text-xs font-bold text-primary uppercase mb-2">O que está por trás</h4>
                  <p className="text-sm text-text-muted">{selectedSituation.meaning}</p>
                </section>

                <section className="mb-4">
                  <h4 className="text-xs font-bold text-green-500 uppercase mb-2">Como agir</h4>
                  <ul className="space-y-2">
                    {selectedSituation.todo.map((t, i) => (
                      <li key={i} className="text-sm text-text-muted flex gap-2">
                        <span className="text-green-500">•</span> {t}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="mb-4">
                  <h4 className="text-xs font-bold text-red-400 uppercase mb-2">O que evitar</h4>
                  <ul className="space-y-2">
                    {selectedSituation.avoid.map((a, i) => (
                      <li key={i} className="text-sm text-text-muted flex gap-2">
                        <span className="text-red-400">•</span> {a}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="mb-6 p-3 bg-primary/5 rounded-xl border border-primary/10">
                  <h4 className="text-xs font-bold text-primary uppercase mb-2">Frase Pronta</h4>
                  <p className="text-sm italic font-medium">"{selectedSituation.phrase}"</p>
                </section>

                <Button onClick={() => setCurrentPage('audios')} variant="outline" className="py-3">
                  <Music size={18} /> Áudio Guiado
                </Button>

                {selectedSituation.video && (
                  <div className="mt-4 p-4 bg-card rounded-xl border border-white/5">
                    <p className="text-[10px] text-text-muted mb-2">🎥 Entenda melhor essa situação</p>
                    <p className="text-[9px] text-text-muted mb-3">Muitas vezes, a birra não é só teimosia. Ela é uma forma da criança expressar algo que ainda não sabe explicar.</p>
                    <div className="relative w-full h-[180px] rounded-lg overflow-hidden">
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${selectedSituation.video}?rel=0&playsinline=1`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </GenericPage>
        );
      case 'phrases':
        return (
          <GenericPage title="Frases Prontas" icon={Quote} onBack={() => setCurrentPage('home')}>
            <div className="space-y-4">
              {[
                { cat: 'Birra', text: 'Eu entendo que você está bravo, mas não posso deixar você bater.', obs: 'Valide a emoção antes de colocar o limite.' },
                { cat: 'Enfrentamento', text: 'Eu te ouvi. Agora, a regra é esta e não vamos mudar.', obs: 'Mantenha o tom de voz firme e baixo.' },
                { cat: 'Insistência', text: 'Eu já respondi. Não vamos mais falar sobre isso agora.', obs: 'Evite entrar em looping de explicações.' },
                { cat: 'Transição', text: 'Em 5 minutos vamos guardar os brinquedos.', obs: 'Dê tempo para o cérebro dele processar a mudança.' },
                { cat: 'Limite', text: 'Isso não é uma escolha. É hora de ir.', obs: 'Seja clara sobre o que não é negociável.' }
              ].map((item, i) => (
                <Card key={i}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">{item.cat}</span>
                    <button className="text-primary"><Volume2 size={18} /></button>
                  </div>
                  <p className="font-medium italic mb-2">"{item.text}"</p>
                  <p className="text-xs text-text-muted">{item.obs}</p>
                </Card>
              ))}
            </div>
          </GenericPage>
        );
      case 'audios':
        return (
          <GenericPage title="Áudios Guiados" icon={Music} onBack={() => setCurrentPage('home')}>
            <div className="space-y-4">
              {AUDIOS_DATA.map(audio => (
                <Card key={audio.id} onClick={() => playingAudio === audio.file ? stopAudio() : playAudio(audio.file)} className="flex items-center gap-4 cursor-pointer">
                  <div className="bg-purple-500/20 p-3 rounded-full">
                    {playingAudio === audio.file ? (
                      <Volume2 size={20} className="text-purple-500 animate-pulse" />
                    ) : (
                      <Play size={20} className="text-purple-500 fill-purple-500" />
                    )}
                  </div>
                  <span className="font-medium text-sm flex-1">{audio.title}</span>
                  <span className="text-[10px] text-text-muted">{playingAudio === audio.file ? 'Tocando...' : '▶'}</span>
                </Card>
              ))}
            </div>
          </GenericPage>
        );
      case 'exercises':
        return (
          <GenericPage title="Exercícios Práticos" icon={Target} onBack={() => setCurrentPage('home')}>
            <div className="space-y-4">
              {[
                { 
                  name: 'TREINO DO "NÃO"', 
                  when: 'Quando a criança quer algo que você não vai deixar.', 
                  fazer: 'Diga "não" de forma calma e curta. Não explique demais. Se ela insistir, repita a mesma resposta. Se precisar, tire o objeto ou afaste a criança. Mostre outra opção logo em seguida.',
                  frase: '“Agora não.” / “Esse não. Esse sim.”',
                  esperar: 'No começo, ela pode insistentir. Com repetição, ela entende melhor o limite.'
                },
                { 
                  name: 'PARAR SEM CONFUSÃO', 
                  when: 'Quando precisa parar uma brincadeira, sair de um lugar ou desligar algo.', 
                  fazer: 'Avise pouco antes. Use uma frase simples. Quando chegar a hora, mantenha o combinado. Não volte atrás só porque ela reclamou. Leve para a próxima atividade.',
                  frase: '“Já vai acaba.” / “Agora guardar.”',
                  esperar: 'A mudança pode ser difícil no início. Com o tempo, a criança tende a aceitar melhor.'
                },
                { 
                  name: 'RESPONDER SEM GRITAR', 
                  when: 'Quando você sentir que está ficando nervosa.', 
                  fazer: 'Pare por dois segundos. Respire fundo. Fale baixo e firme. Use poucas palavras. Se precisar, tire a criança da situação.',
                  frase: '“Agora chega.” / “Vamos sair daqui.”',
                  esperar: 'Você não precisa resolver tudo na hora. O objetivo é não piorar a situação.'
                },
                { 
                  name: 'DIMINUIR A INSISTÊNCIA', 
                  when: 'Quando a criança pede a mesma coisa muitas vezes.', 
                  fazer: 'Responda uma vez com clareza. Se ela repetir, fale a mesma coisa. Não abra nova conversa toda hora. Não mude a resposta por cansaço. Redirecione para outra coisa.',
                  frase: '“Eu já respondi.” / “A resposta continua a mesma.”',
                  esperar: 'Ela pode insistentir por um tempo. Se sua resposta ficar igual, isso tende a diminuir.'
                },
                { 
                  name: 'LIMITES DO DIA A DIA', 
                  when: 'Para deixar a rotina mais clara dentro de casa.', 
                  fazer: 'Escolha poucos limites importantes. Use sempre palavras parecidas. Reaja do mesmo jeito nas mesmas situações. Mostre o que vem depois. Repita isso todos os dias.',
                  frase: '“Bater não.” / “Agora guardar.” / “Aqui não pode.”',
                  esperar: 'A criança ainda vai testar. Mas com repetição ela entende melhor o que é esperado.'
                }
              ].map(ex => (
                <Card key={ex.name} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-primary text-sm">{ex.name}</h4>
                    <Music size={16} className="text-text-muted" />
                  </div>
                  <div className="text-xs space-y-1">
                    <p><span className="text-text-muted">Quando usar:</span> {ex.when}</p>
                    <p><span className="text-text-muted">O que fazer:</span> {ex.fazer}</p>
                    <p><span className="text-text-muted">Exemplos:</span> {ex.frase}</p>
                    <p><span className="text-text-muted font-bold">O que esperar:</span> {ex.esperar}</p>
                  </div>
                </Card>
              ))}
            </div>
          </GenericPage>
        );
      case 'plan':
        return (
          <GenericPage title="Plano de 7 Dias" icon={Calendar} onBack={() => setCurrentPage('home')}>
            <div className="space-y-6">
              <Card className="bg-primary/10 border-primary/20">
                <h3 className="font-bold text-sm mb-1">Plano de 7 Dias para Reduzir Birras</h3>
                <p className="text-[10px] text-text-muted">Siga um passo por dia para agir com mais firmeza e menos estresse.</p>
              </Card>
              
              <div className="space-y-4">
                {[
                  { 
                    day: 1, 
                    title: 'OBSERVAR ANTES DE REAGIR', 
                    objetivo: 'Perceber o que mais costuma desencadear a birra.',
                    fazer: 'Durante o dia, observe em quais momentos a birra aparece. Preste atenção se acontece: quando escuta "não", quando precisa parar algo, quando quer algo e não consegue, quando está cansada ou com fome.',
                    evitar: 'Reagir sem perceber o que veio antes, tratar todas as birras igual, ignorar o gatilho.',
                    checklist: ['Observei pelo menos 1 gatilho real', 'Percebi em que situação mais apareceu', 'Notei como eu costumo reagir']
                  },
                  { 
                    day: 2, 
                    title: 'ESCOLHER 1 LIMITE', 
                    objetivo: 'Começar a reduzir a confusão sobre o que pode e o que não pode.',
                    fazer: 'Escolha apenas 1 limite importante para manter com mais firmeza hoje. Exemplos: não bater, não jogar objetos, desligar a tela quando pedido. Diga de forma curta e mantenha a mesma resposta.',
                    evitar: 'Querer corrigir tudo no mesmo dia, mudar de ideia no meio da crise, dar muitas explicações.',
                    checklist: ['Escolhi 1 limite claro', 'Mantenha a mesma resposta', 'Evitei discutir demais']
                  },
                  { 
                    day: 3, 
                    title: 'FALAR MENOS, AGIR MAIS', 
                    objetivo: 'Parar de aumentar a tensão falando demais.',
                    fazer: 'Use frases curtas e diretas: "Agora não.", "Isso não pode.", "A resposta continua a mesma." Fale pouco, mantenha tom firme, use ação junto se necessário.',
                    evitar: 'Discursos longos, bronca sem direção, ameaças, repetir frases diferentes.',
                    checklist: ['Usei frases mais curtas', 'Evitei explicar demais', 'Manti tom firme']
                  },
                  { 
                    day: 4, 
                    title: 'NÃO REFORÇAR INSISTÊNCIA', 
                    objetivo: 'Quebrar o ciclo de repetir, negociar ou ceder no desgaste.',
                    fazer: 'Perceba se a criança insiste até conseguir. Responda uma vez com clareza, repita a mesma resposta se necessário, não abra nova negociação a cada insistência.',
                    evitar: 'Ceder para acabar logo, mudar resposta porque chorou, transformar em discussão.',
                    checklist: ['Identifiquei momentos de insistência', 'Evitei negociar no impulso', 'Mantenha a resposta']
                  },
                  { 
                    day: 5, 
                    title: 'MELHORAR TRANSIÇÕES', 
                    objetivo: 'Reduzir birras em momentos de mudança.',
                    fazer: 'Escolha 1 transição difícil (parar de brincar, desligar TV, ir para banho). Avise antes, use frases simples, mantenha a mudança quando chegar a hora.',
                    evitar: 'Avisar e não cumprir, dar muitos "só mais um pouco", transformar em briga.',
                    checklist: ['Escolhi 1 transição específica', 'Avisei antes', 'Mantenha a decisão']
                  },
                  { 
                    day: 6, 
                    title: 'CORRIGIR SEM GRITAR', 
                    objetivo: 'Reduzir sua própria escalada emocional.',
                    fazer: 'Quando sentir que vai perder a paciência: pare 2 segundos, respire fundo, use 1 frase curta. Frases: "Eu vou continuar, mas com calma.", "Não vou mudar isso agora."',
                    evitar: 'Reagir no impulso, gritar para encerrar, ironizar, discutir no auge.',
                    checklist: ['Percebi quando estava no limite', 'Respirei antes de reagir', 'Evitei gritar']
                  },
                  { 
                    day: 7, 
                    title: 'REVISÃO E PRÓXIMO PASSO', 
                    objetivo: 'Ver o que funcionou e o que precisa de atenção.',
                    fazer: 'Revise: qual gatilho mais aparece? Qual situação mais desgasta? Em qual momento você conseguiu agir melhor? O objetivo é perceber progresso, não perfeição.',
                   避免: 'Esperar perfeição em 7 dias, abandonar tudo, avaliar só pelo pior momento.',
                    checklist: ['Entendi melhor os gatilhos', 'Percebi padrões da minha reação', 'Sei qual será meu próximo foco']
                  }
                ].map(item => (
                  <Card key={item.day} className={cn("space-y-3", item.day > 2 && "opacity-50")}>
                    <div className="flex items-center gap-3">
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0", item.day <= 2 ? "bg-primary text-white" : "bg-background text-text-muted")}>
                        {item.day}
                      </div>
                      <h4 className="font-bold text-xs">{item.title}</h4>
                    </div>
                    <div className="text-[10px] space-y-1">
                      <p><span className="text-text-muted">Objetivo:</span> {item.objetivo}</p>
                      <p><span className="text-text-muted">O que fazer:</span> {item.fazer}</p>
                      <p><span className="text-text-muted">O que evitar:</span> {item.evitar}</p>
                      <div className="mt-2 pt-2 border-t border-white/5">
                        <p className="text-text-muted mb-1">Checklist:</p>
                        {item.checklist.map((check, i) => (
                          <p key={i} className="text-[9px]">• {check}</p>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </GenericPage>
        );
      case 'checklist':
        return (
          <GenericPage title="Checklist Rápido" icon={ListTodo} onBack={() => setCurrentPage('plan')}>
            <div className="space-y-4">
              <p className="text-sm text-text-muted px-1">Revise sua resposta para melhorar na próxima vez:</p>
              {[
                'Fui clara no limite?',
                'Mantive o limite até o fim?',
                'Cedi depois que ele chorou?',
                'Gritei ou perdi o controle?',
                'Repeti a mesma coisa muitas vezes?',
                'Fui consistente com a regra?',
                'Houve conexão após a crise?'
              ].map(item => (
                <Card key={item} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg border-2 border-primary/30 shrink-0" />
                  <span className="font-medium text-sm">{item}</span>
                </Card>
              ))}
            </div>
          </GenericPage>
        );
      default:
        return <Home setPage={setCurrentPage} quizAnswers={quizAnswers} onLogout={handleLogout} />;
    }
  };

  if (currentPage === 'login') return <Login onLogin={handleLogin} />;

  return (
    <div className="min-h-screen pb-24 relative">
      <Background />
      
      <main className="relative z-10 p-6 pt-10 max-w-md mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-white/5 px-6 py-3 z-50 flex justify-between items-center max-w-md mx-auto">
        <NavItem icon={HomeIcon} label="Início" active={activeTab === 'home'} onClick={() => handleTabChange('home')} />
        <NavItem icon={Zap} label="Agir Agora" active={activeTab === 'act-now'} onClick={() => handleTabChange('act-now')} />
        <NavItem icon={MessageSquare} label="Situações" active={activeTab === 'situations'} onClick={() => handleTabChange('situations')} />
        <NavItem icon={Music} label="Áudios" active={activeTab === 'audios'} onClick={() => handleTabChange('audios')} />
        <NavItem icon={Calendar} label="Plano" active={activeTab === 'plan'} onClick={() => handleTabChange('plan')} />
      </nav>
    </div>
  );
}

function NavItem({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1">
      <div className={cn("p-2 rounded-xl transition-colors", active ? "text-primary bg-primary/10" : "text-text-muted")}>
        <Icon size={20} />
      </div>
      <span className={cn("text-[10px] font-medium", active ? "text-primary" : "text-text-muted")}>{label}</span>
    </button>
  );
}
