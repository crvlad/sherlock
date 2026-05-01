import { calculateWeightedScore } from '../score.js';

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-zа-я0-9\s-]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const scenario = {
  id: 'foggy-harbor',
  title: 'Туман над доками',
  subtitle: 'Короткое учебное дело',
  introduction: `Лондон, раннее утро. В полицейской лодке у причала Сент-Кэтрин найден мертвым
агент страховой компании Генри Тарлоу. Портфель с контрактами исчез.

Лестрейд уверен, что это дело рук докеров-грабителей. Холмс сомневается:
"Слишком чистая работа для случайной драки".

Ваша задача: установить убийцу, мотив и метод.`,
  finalQuestion: 'Кто убил Генри Тарлоу и зачем?',
  sherlockLeadCount: 3,
  solution: {
    killer: 'Мартин Крейн',
    motive: 'Сокрытие страхового мошенничества',
    method: 'Отравление лауданумом в фляге, затем инсценировка падения в воду',
    explanation: `Мартин Крейн, бухгалтер доковой компании, подделывал страховые накладные.
Тарлоу это обнаружил и собирался передать документы в Скотланд-Ярд.

Крейн подмешал лауданум в флягу Тарлоу во время ночной встречи,
а после потери сознания жертвы сбросил тело к причалу, чтобы выдать смерть
за несчастный случай в тумане. Портфель он забрал и спрятал в конторе.`,
  },
};

const locations = [
  { id: 'baker-street', name: 'Baker Street 221B', district: 'Мэрилебон', x: 28, y: 22, description: 'Квартира Холмса и Уотсона.' },
  { id: 'scotland-yard', name: 'Скотланд-Ярд', district: 'Вестминстер', x: 42, y: 52, description: 'Полиция Лондона.' },
  { id: 'docks', name: 'Доки Сент-Кэтрин', district: 'Ист-Энд', x: 80, y: 54, description: 'Причалы, склады и туман.' },
  { id: 'city-office', name: 'Контора "Темз Иншуренс"', district: 'Сити', x: 62, y: 46, description: 'Страховая компания, где работал Тарлоу.' },
];

const leads = [
  {
    id: 'fh-001',
    locationId: 'docks',
    title: 'Осмотр причала',
    prerequisites: [],
    icon: '🔍',
    text: `На настиле причала видны следы волочения. В кармане Тарлоу найден ключ
от офисного сейфа и пустая фляга с сладковатым запахом.`,
  },
  {
    id: 'fh-002',
    locationId: 'scotland-yard',
    title: 'Отчет патологоанатома',
    prerequisites: ['fh-001'],
    icon: '⚕️',
    text: `Смерть наступила от передозировки лауданума до попадания в воду.
Следов борьбы почти нет.`,
  },
  {
    id: 'fh-003',
    locationId: 'city-office',
    title: 'Проверка бухгалтерии',
    prerequisites: ['fh-001'],
    icon: '📒',
    text: `В накладных обнаружены дубли страховых выплат. Подписи подделаны.
В ящике Мартина Крейна найден пропавший портфель Тарлоу.`,
  },
  {
    id: 'fh-004',
    locationId: 'city-office',
    title: 'Допрос Мартина Крейна',
    prerequisites: ['fh-002', 'fh-003'],
    icon: '👤',
    text: `Крейн путается в показаниях и признается: он подсыпал лауданум,
чтобы остановить Тарлоу и скрыть схему мошенничества.`,
  },
];

const newspapers = [
  {
    id: 'fh-news-1',
    title: 'Dockside Herald',
    date: '3 марта 1896',
    edition: 'Утренний выпуск',
    articles: [
      {
        headline: 'ТРУП АГЕНТА НАЙДЕН В ДОКАХ',
        text: 'Полиция рассматривает версии от ограбления до несчастного случая в тумане.',
      },
      {
        headline: 'СТРАХОВЫЕ ДОКУМЕНТЫ ПРОПАЛИ',
        text: 'В деле фигурируют контракты на крупные грузы, шедшие через Темзу.',
      },
    ],
  },
];

const directory = {
  persons: [
    {
      id: 'fh-p1',
      name: 'Крейн, Мартин',
      category: 'Бухгалтер',
      entry: 'Сотрудник "Темз Иншуренс". Отвечает за расчет страховых выплат по портовым грузам.',
    },
    {
      id: 'fh-p2',
      name: 'Тарлоу, Генри',
      category: 'Страховой агент',
      entry: 'Полевой агент. Проверял достоверность заявок на страховые выплаты.',
    },
  ],
  places: [
    {
      id: 'fh-pl1',
      name: 'Лауданум',
      category: 'Токсикология',
      entry: 'Спиртовая настойка опия. В больших дозах вызывает угнетение дыхания и потерю сознания.',
    },
  ],
};

export const FOGGY_HARBOR_CASE = {
  id: scenario.id,
  scenario,
  locations,
  leads,
  newspapers,
  directory,
  evaluateAccusation(answers, leadsVisited) {
    const killerText = normalizeText(answers?.killer);
    const motiveText = normalizeText(answers?.motive);
    const methodText = normalizeText(answers?.method);

    const killerMatch = ['крейн', 'мартин'].some(alias => killerText.includes(alias));
    const motiveMatch = ['мошеннич', 'страхов', 'сокрыт'].some(token => motiveText.includes(token));
    const methodMatch = ['лауданум', 'яд', 'фляг', 'отрав'].some(token => methodText.includes(token));

    return {
      isCorrect: killerMatch,
      score: calculateWeightedScore({
        leadsVisited,
        sherlockLeadCount: scenario.sherlockLeadCount,
        killerMatch,
        motiveMatch,
        methodMatch,
      }),
      killerMatch,
      motiveMatch,
      methodMatch,
      confidence: (killerMatch ? 2 : 0) + (motiveMatch ? 1 : 0) + (methodMatch ? 1 : 0),
    };
  },
};
