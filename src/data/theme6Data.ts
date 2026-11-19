export type StudySection =
  | 'overview'
  | 'concepts'
  | 'vocabulary'
  | 'spectrum'
  | 'quizzes';

export interface SpecificOutcome {
  code: string;
  officialText: string;
  studentTranslation: string;
}

export interface ProgressionStep {
  stepNumber: string;
  title: string;
  summary: string;
  keyFigureOrEvent: string;
}

export interface CheckpointQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ComparisonRow {
  aspect: string;
  leftLabel: string;
  rightLabel: string;
}

export interface ComparisonTableData {
  title: string;
  leftHeading: string;
  rightHeading: string;
  rows: ComparisonRow[];
}

export interface StudyTopic {
  id: string;
  title: string;
  kicker: string;
  plainTakeaway: string;
  keyPoints: string[];
  rejectsLiberalism: string;
  spotlightTitle?: string;
  spotlightText?: string;
}

export interface ChapterIllustration {
  imagePath: string;
  alt: string;
  title: string;
  caption: string;
  visualCues: string[];
}

export interface ChapterVideo {
  id: string;
  youtubeId: string;
  startSeconds?: number;
  title: string;
  durationHint: string;
  slideContext: string;
  watchFor: string;
}

export interface StudyChapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  illustration: ChapterIllustration;
  videos: ChapterVideo[];
  topics: StudyTopic[];
  comparison: ComparisonTableData;
  checkpoint: CheckpointQuestion;
}

export interface SorterItem {
  id: string;
  statement: string;
  correctBucket: 'communism' | 'fascism' | 'both';
  explanation: string;
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  summary: string;
  regime: 'Soviet Union' | 'Germany';
  orderIndex: number;
}

export type PrimarySourceCategory =
  | 'Soviet Communism'
  | 'Fascism & Nazism'
  | 'Dictatorship Techniques';

export type PrimarySourceVisualKind =
  | 'versailles-table'
  | 'bomb-trajectory'
  | 'population-growth'
  | 'hierarchy-pyramid'
  | 'holodomor-cycle'
  | 'election-bars';

export interface PrimarySourceItem {
  id: string;
  title: string;
  category: PrimarySourceCategory;
  sourceType:
    | 'Visual Political Cartoon'
    | 'Historical Textbook Excerpt'
    | 'Literary Satire'
    | 'Political Slogan'
    | 'Historical Document Chart'
    | 'Power Structure Diagram'
    | 'Policy Case Study'
    | 'Election Data Visual';
  slideRef: string;
  imagePath?: string;
  imageAlt?: string;
  visualChart?: PrimarySourceVisualKind;
  excerpt?: string;
  attribution: string;
  contextNote: string;
  clues: string[];
  question: string;
  options: string[];
  correctIndex: number;
  modelAnalysis: string;
  writtenPrompt: string;
  sampleWrittenResponse: string;
  keyTerms: string[];
}

export interface VocabTerm {
  id: string;
  term: string;
  category: 'Soviet Communism' | 'Fascism & Nazism' | 'Dictatorship & Spectrum';
  definition: string;
  example: string;
  memoryTip: string;
}

export interface SpectrumQuadrant {
  id: 'dem-socialism' | 'dem-capitalism' | 'communism' | 'fascism';
  title: string;
  countryExamples: string;
  politicalAxis: 'High Political Freedom' | 'High Political Control';
  economicAxis: 'Economic Collectivism' | 'Economic Individualism';
  description: string;
  liberalismStance: string;
  quadrantNumber: number;
}

export interface SpectrumChallenge {
  id: string;
  statement: string;
  correctQuadrantId: SpectrumQuadrant['id'];
  explanation: string;
}

export interface TechniqueScenario {
  id: string;
  scenario: string;
  regime: 'Soviet Union' | 'Nazi Germany' | 'Modern / General Dictatorship';
  correctTechnique: string;
  options: string[];
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  track: 'communism' | 'fascism' | 'techniques';
  sourceQuote?: string;
  sourceAttribution?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizTrackMeta {
  id: 'communism' | 'fascism' | 'techniques' | 'full-review';
  title: string;
  subtitle: string;
  questionCount: number;
}

export const SPECIFIC_OUTCOMES: SpecificOutcome[] = [
  {
    code: 'S.O. 2.9',
    officialText: 'Analyze ideological systems that rejected liberalism.',
    studentTranslation:
      'Explain why Communism (USSR) and Fascism (Nazi Germany) rose up and rejected individual rights, democracy, and free-market capitalism.',
  },
  {
    code: 'S.O. 3.3',
    officialText:
      'Explore the extent to which governments should reflect the will of the people.',
    studentTranslation:
      'Compare how democracies listen to citizens versus how dictatorships control or fake public support using propaganda, fear, and one-sided elections.',
  },
  {
    code: 'S.O. 3.5',
    officialText:
      'Examine the extent to which the practices of political and economic systems reflect the values of liberalism.',
    studentTranslation:
      'Identify where Communism and Fascism sit on the political-economic spectrum and judge how far their real-world policies strayed from liberal freedoms.',
  },
];

export const IDEOLOGY_PROGRESSION: ProgressionStep[] = [
  {
    stepNumber: '01',
    title: 'Classical Liberalism Falls Short',
    summary:
      'During the Industrial Revolution, unregulated capitalism created huge wealth for factory owners while workers faced dangerous jobs and deep poverty.',
    keyFigureOrEvent: 'Industrial Revolution (18th–19th century)',
  },
  {
    stepNumber: '02',
    title: 'Modern Liberalism & Socialism Emerge',
    summary:
      'People demanded fairer conditions. Modern liberalism added government protections, while Utopian Socialists imagined cooperative communities.',
    keyFigureOrEvent: 'Robert Owen (Utopian Socialism)',
  },
  {
    stepNumber: '03',
    title: 'Marxism (Scientific Socialism)',
    summary:
      'Karl Marx and Friedrich Engels argued workers must overthrow business owners through revolution to build a classless society with no private property.',
    keyFigureOrEvent: 'Karl Marx & Friedrich Engels (The Communist Manifesto)',
  },
  {
    stepNumber: '04',
    title: '20th-Century Rejections of Liberalism',
    summary:
      'In times of crisis, countries turned to extremes: the USSR adopted authoritarian Communism (far left), while Germany turned to Fascism (far right).',
    keyFigureOrEvent: 'Lenin & Stalin (USSR) · Hitler & Mussolini (Fascism)',
  },
];

export const STUDY_CHAPTERS: StudyChapter[] = [
  {
    id: 'communism-rise',
    number: 'Chapter 01',
    title: 'From Czarist Russia to Leninism',
    subtitle: 'Why Russia rejected liberal reform and turned to a communist revolution.',
    estimatedMinutes: 6,
    illustration: {
      imagePath: '/src/assets/images/scene_russian_revolution_1795096450983.jpg',
      alt: 'Illustration of early 20th-century Russian workers and peasants marching through snow with cloth banners',
      title: '1917: Workers & Peasants Demand Change',
      caption:
        'Exhausted by World War I, hunger, and centuries of Czarist rule, everyday Russians rallied behind Lenin’s call for "Peace! Land! Bread!"',
      visualCues: [
        'Factory workers and rural peasants marching together',
        'Plain cloth banners echoing revolutionary demands',
        'Winter backdrop recalling Petrograd protests of 1905 and 1917',
      ],
    },
    videos: [
      {
        id: 'vid-animal-farm',
        youtubeId: 'LAeKX5n-5IE',
        title: 'Animal Farm: Satire of Soviet Communism',
        durationHint: 'Slide 3 Clip',
        slideContext: 'Orwell’s critique of inequality inside a "utopian" revolution',
        watchFor: 'Notice why the pigs gradually replace the old human rulers with a new dictatorship.',
      },
      {
        id: 'vid-what-is-communism',
        youtubeId: 'bc7EGTfVCg8',
        startSeconds: 111,
        title: 'What Is Communism?',
        durationHint: 'Slide 5 Explainer',
        slideContext: 'How Marxism evolved into 20th-century Soviet Communism',
        watchFor: 'Look for the gap between Marx’s stateless ideal and real communist states.',
      },
      {
        id: 'vid-bloody-sunday',
        youtubeId: 'cj84BRMe-Us',
        title: 'Bloody Sunday (1905) & Growing Unrest',
        durationHint: 'Slide 17 Clip',
        slideContext: 'Peaceful march to the Winter Palace met with gunfire',
        watchFor: 'See how violence in 1905 shattered Russian trust in the Czar.',
      },
      {
        id: 'vid-russian-rev',
        youtubeId: 'KOK1TMSyKcM',
        title: 'The Russian Revolution of 1917',
        durationHint: 'Slide 24 Overview',
        slideContext: 'From Kerensky’s Provisional Government to Bolshevik takeover',
        watchFor: 'Track how War Communism failed and led to Lenin’s NEP.',
      },
      {
        id: 'vid-history-lenin',
        youtubeId: '9N8hsXQapjY',
        title: 'TED-Ed: History vs. Vladimir Lenin',
        durationHint: 'Slide 32 Debate',
        slideContext: 'Was Lenin a hero who toppled tyranny or a dictator who built another?',
        watchFor: 'Weigh Lenin’s reforms against the Red Terror and single-party rule.',
      },
    ],
    topics: [
      {
        id: 'russia-czars',
        title: 'The Failure of Liberal Reform in Russia',
        kicker: 'Pre-1917 Background',
        plainTakeaway:
          'Russia stayed poor and tightly controlled by an absolute monarch (the Czar) long after other countries adopted democracy and industry.',
        keyPoints: [
          'In the 1800s, Russia relied on subsistence agriculture (farming just enough to survive), and most people were impoverished serfs (peasants tied to landowners).',
          'The Czar had absolute control over political, economic, and social life—citizens lacked basic liberal rights like free speech or representation.',
          'Czar Alexander II freed the serfs and introduced small liberal reforms (local councils, ending capital punishment), but radical socialists wanted faster change and assassinated him.',
          'The next ruler, Czar Alexander III, reversed those reforms and cracked down on freedoms, convincing many Russians that peaceful reform would never work.',
        ],
        rejectsLiberalism:
          'Absolute Czarist rule denied individual rights and rule of law; when moderate reforms failed, radicals rejected gradual liberal democracy altogether.',
        spotlightTitle: 'Animal Farm Connection',
        spotlightText:
          'George Orwell’s Animal Farm criticizes Soviet communism by showing how a revolution promising total equality can turn into a new dictatorship with rigid classes and power struggles.',
      },
      {
        id: 'bloody-sunday-1905',
        title: 'Rapid Industrialization & Bloody Sunday (1905)',
        kicker: 'Sparking Revolution',
        plainTakeaway:
          'Late, rapid factory growth widened the gap between rich and poor, and peaceful protesters were shot outside the Czar’s palace.',
        keyPoints: [
          'Foreign investors built factories quickly in the late 1800s, forcing Russian workers into terrible conditions and long hours.',
          'In 1898, Marxists formed the Socialist Democratic Labour Party (SDLP), including Lenin, Trotsky, and Stalin. The Czar banned the party and exiled members, who published an underground newspaper called Iskra ("Spark").',
          'In January 1905 ("Bloody Sunday"), unarmed workers marched to Czar Nicholas II’s Winter Palace asking for food and better conditions; soldiers opened fire, killing hundreds.',
          'Nationwide strikes and the creation of the St. Petersburg Soviet (workers’ council) forced the Czar to sign the October Manifesto, promising basic civil rights and political parties—setting the stage for 1917.',
        ],
        rejectsLiberalism:
          'Although the October Manifesto briefly promised civil liberties, the Czar’s violence and resistance to sharing power pushed workers toward revolutionary socialism.',
      },
      {
        id: 'lenin-1917',
        title: 'Leninism & the 1917 Bolshevik Revolution',
        kicker: '1917–1924',
        plainTakeaway:
          'After the temporary democratic government stayed in World War I, Lenin won over exhausted workers and peasants with "Peace! Land! Bread!"',
        keyPoints: [
          'When Czar Nicholas II was forced to abdicate in 1917, a temporary liberal democratic government led by Alexander Kerensky took over.',
          'Kerensky’s government lost public support because it kept Russia fighting in WWI and refused to give land to poor rural peasants.',
          'Vladimir Lenin and Leon Trotsky led the communist Bolsheviks to seize power in October 1917, promising "Peace! Land! Bread!"',
          'Unlike Karl Marx (who believed a true communist society would eventually need no government at all), Lenin believed a strong Communist government was required—and used the "Red Terror" to silence rivals.',
          'A brutal Russian Civil War followed between the Bolshevik Red Army and the Anti-Bolshevik White Army (backed by liberal countries like Canada, Britain, France, and the US). The Red Army won.',
        ],
        rejectsLiberalism:
          'Lenin replaced multi-party democracy with single-party Bolshevik rule and accepted violent revolution as a tool to crush opposition.',
      },
      {
        id: 'war-communism-nep',
        title: 'War Communism vs. The New Economic Policy (NEP)',
        kicker: 'Early Soviet Economy',
        plainTakeaway:
          'Pure state control (War Communism) caused economic collapse and famine, forcing Lenin to allow limited private business (NEP) to save the economy.',
        keyPoints: [
          'Under War Communism (1918–1921), Lenin nationalized all land and factories, abolished money, and forced peasants to hand over surplus grain.',
          'War Communism failed miserably: peasants planted less food (causing severe famine), and untrained workers could not run factories efficiently.',
          'In 1921, Lenin launched the New Economic Policy (NEP), calling it a "temporary retreat" toward capitalism to get the economy moving again.',
          'Under the NEP, the state kept control of major industries, banking, and resources, while allowing small private businesses, private peasant farms, and the return of money.',
          'In 1922, the USSR (Union of Soviet Socialist Republics) was officially formed. Early changes gave workers more say, promoted gender equality, and briefly allowed art and music to flourish.',
        ],
        rejectsLiberalism:
          'Both systems rejected full free-market capitalism, though the NEP temporarily borrowed small-scale private enterprise to prevent total collapse.',
      },
    ],
    comparison: {
      title: 'Economic Shift: War Communism vs. New Economic Policy (NEP)',
      leftHeading: 'War Communism (1918–1921)',
      rightHeading: 'New Economic Policy (1921)',
      rows: [
        {
          aspect: 'Property & Business',
          leftLabel: 'All factories, land, and private property nationalized by the state.',
          rightLabel: 'State controls major industries/banks; small private businesses allowed.',
        },
        {
          aspect: 'Agriculture',
          leftLabel: 'Surplus grain seized from peasants to feed workers and soldiers.',
          rightLabel: 'Peasants can own land, pay taxes, and sell extra crops for profit.',
        },
        {
          aspect: 'Money',
          leftLabel: 'Money abolished in favor of state distribution.',
          rightLabel: 'Money reintroduced to restart trade and stability.',
        },
        {
          aspect: 'Result',
          leftLabel: 'Failed badly—production crashed and severe famine hit.',
          rightLabel: 'Stabilized the economy and helped citizens recover from war.',
        },
      ],
    },
    checkpoint: {
      id: 'cp-1',
      question:
        'Why did Alexander Kerensky’s temporary liberal democratic government lose the support of most Russians in 1917?',
      options: [
        'It abolished all money and seized grain from peasants.',
        'It refused to give land to poor peasants and kept fighting in WWI.',
        'It formed an alliance with Nazi Germany.',
        'It tried to bring back Czar Nicholas II as an absolute ruler.',
      ],
      correctIndex: 1,
      explanation:
        'People were exhausted by WWI and starving. Because Kerensky stayed in the war and delayed land reform, Lenin’s slogan "Peace! Land! Bread!" quickly won support.',
    },
  },
  {
    id: 'stalinism',
    number: 'Chapter 02',
    title: 'Stalinism & Total Control in the USSR',
    subtitle: 'How Joseph Stalin turned the Soviet Union into a brutal totalitarian dictatorship.',
    estimatedMinutes: 6,
    illustration: {
      imagePath: '/src/assets/images/scene_collectivization_fields_1795096451614.jpg',
      alt: 'Illustration of 1930s grain fields with wooden farm carts and distant industrial smokestacks',
      title: 'Collectivization & Rapid Industrialization (1928–1933)',
      caption:
        'Stalin forced peasants onto collective farms (kolkhozy) to extract grain and fund massive Five-Year Plan factories—sparking the devastating Holodomor in Ukraine.',
      visualCues: [
        'Grain carts leaving rural farms toward urban factories',
        'Smokestacks representing Stalin’s Five-Year Plan steel & heavy industry',
        'Harsh human toll on kulaks and Ukrainian farming families',
      ],
    },
    videos: [
      {
        id: 'vid-gulags',
        youtubeId: '8l7wzzD2Bv0',
        title: 'Inside Stalin’s Gulag Prison System',
        durationHint: 'Slide 37 Explainer',
        slideContext: 'How forced-labor camps crushed political dissent',
        watchFor: 'Observe who was sent to the Gulags and how fear kept citizens obedient.',
      },
      {
        id: 'vid-stalin-doc',
        youtubeId: 'sRcNq4OYTyE',
        title: 'Totalitarian Control Under Stalin & Hitler',
        durationHint: 'Slide 127 Documentary',
        slideContext: 'Comparing dictatorship techniques in the 1930s',
        watchFor: 'Spot examples of purges, censorship, and secret police terror.',
      },
    ],
    topics: [
      {
        id: 'stalin-rise',
        title: 'Power Struggle & Stalin’s Dictatorship',
        kicker: '1924–1928',
        plainTakeaway:
          'After Lenin died in 1924, Stalin pushed out Leon Trotsky and built a regime driven by fear, absolute power, and terror.',
        keyPoints: [
          'Lenin had warned against trusting Stalin, but after Lenin’s death in 1924, Stalin outmaneuvered Leon Trotsky in a bitter power struggle.',
          'By 1928, Stalin was supreme leader. Trotsky was removed from the Communist Party, exiled, and later assassinated in Mexico.',
          'Stalin completely rejected liberal values like individual freedoms, capitalism, and multi-party democracy.',
          'He maintained control using the secret police (NKVD), the Gulag prison camp system for opponents, and the Great Purges (1936–1939) inside the party and army.',
          'His regime even rewrote history books and altered Soviet archives so the past matched state propaganda.',
        ],
        rejectsLiberalism:
          'Replaced rule of law, due process, and political pluralism with secret police terror, forced labor camps, and absolute one-person control.',
      },
      {
        id: 'five-year-collectivization',
        title: 'Five-Year Plans & Collectivization',
        kicker: '1928–1933',
        plainTakeaway:
          'Stalin forced the USSR to industrialize rapidly and combined private farms into state-run collective farms, crushing wealthier peasants.',
        keyPoints: [
          'Stalin ended the NEP and launched Five-Year Plans to rapidly industrialize the Soviet Union into a global powerhouse through strict economic planning.',
          'To feed factory workers and fund industrialization, Stalin introduced collectivization (1929–1933), forcing peasants to merge individual farms into large collective farms (kolkhozy).',
          'Peasants kept their homes, but all land, livestock, and equipment became collective property.',
          'Prosperous peasants—called kulaks—resisted by destroying machinery, burning crops, and killing cattle rather than handing them over.',
          'Stalin launched an all-out offensive against the kulaks in 1930, sending millions to Gulags or executing them.',
        ],
        rejectsLiberalism:
          'Completely eliminated private property rights and economic freedom, prioritizing state industrial targets over individual human lives.',
      },
      {
        id: 'holodomor',
        title: 'The Holodomor (1932–1933)',
        kicker: 'Terror-Famine in Ukraine',
        plainTakeaway:
          'Stalin used impossible grain quotas and seized food to break Ukrainian resistance, starving 7 to 10 million people.',
        keyPoints: [
          'In 1932–1933, drought combined with Stalin’s forced collectivization policies caused catastrophic famine, centered in Ukraine.',
          'Stalin set massive grain quotas and withheld stockpiled grain from starving villages to crush resistance and suppress Ukrainian nationalism.',
          'Between 7 and 10 million people died of starvation in what is remembered as the Holodomor ("death by hunger").',
        ],
        rejectsLiberalism:
          'Demonstrates the extreme human cost when a totalitarian state strips citizens of property, mobility, and the fundamental right to life.',
      },
      {
        id: 'core-communist-values',
        title: 'Core Communist Values vs. Soviet Reality',
        kicker: 'Theory Check',
        plainTakeaway:
          'On paper, communism aimed for total equality and a classless society; in practice, Soviet leaders used extreme state power to enforce it.',
        keyPoints: [
          'Core Communist Values: Egalitarianism (equal treatment for men, women, and nationalities), Collectivism (group before individual), and Self-Sacrifice.',
          'Economic Values: Public Ownership (no private property) and Central Economic Planning.',
          'Political & Social Goals: A Classless Society, a Workers’ Government ("dictatorship of the proletariat") during transition, and Internationalism (global working-class solidarity).',
          'Key Gap: Marx pictured the state withering away, yet 20th-century communism in the USSR (and Maoism in China) created huge, permanent authoritarian governments.',
        ],
        rejectsLiberalism:
          'Places collective economic equality and state direction far above individual liberty, private enterprise, or personal choice.',
      },
    ],
    comparison: {
      title: 'Ideology Check: Karl Marx’s Theory vs. Stalin’s USSR',
      leftHeading: 'Marxist Communist Theory',
      rightHeading: 'Stalinism in Practice',
      rows: [
        {
          aspect: 'Role of Government',
          leftLabel: 'Workers’ government is temporary; true communism needs no government.',
          rightLabel: 'Permanent, all-powerful totalitarian state led by a single dictator.',
        },
        {
          aspect: 'Equality & Classes',
          leftLabel: 'Classless society with no hierarchy and shared power.',
          rightLabel: 'Strict party hierarchy; dissidents and kulaks imprisoned in Gulags.',
        },
        {
          aspect: 'Economy',
          leftLabel: 'Collective ownership of factories and resources for everyone’s needs.',
          rightLabel: 'Forced Five-Year Plans & collectivization prioritizing state military/industrial power.',
        },
        {
          aspect: 'Citizen Voice',
          leftLabel: 'Cooperation and representation for all working people.',
          rightLabel: 'NKVD secret police, Great Purges, censorship, and rewritten history.',
        },
      ],
    },
    checkpoint: {
      id: 'cp-2',
      question:
        'Who were the "kulaks" targeted during Stalin’s collectivization campaign?',
      options: [
        'Members of the NKVD secret police who opposed Trotsky.',
        'Prosperous peasant farmers who resisted giving up their private land and livestock.',
        'German diplomats stationed in Moscow before World War II.',
        'Factory managers hired under Kerensky’s Provisional Government.',
      ],
      correctIndex: 1,
      explanation:
        'Kulaks were wealthier peasants who refused to surrender their private farms to state collective farms (kolkhozy). Many destroyed their own crops and cattle and were sent to Gulags.',
    },
  },
  {
    id: 'fascism-germany',
    number: 'Chapter 03',
    title: 'Fascism & The Rise of Nazi Germany',
    subtitle: 'How crisis, resentment, and extreme nationalism destroyed Germany’s young democracy.',
    estimatedMinutes: 7,
    illustration: {
      imagePath: '/src/assets/images/scene_weimar_crisis_1795096450712.jpg',
      alt: 'Illustration of 1923 Weimar Germany street with locked factory gates and a wooden cart stacked with paper currency',
      title: 'Weimar Crisis: Hyperinflation & Unemployment',
      caption:
        'Punished by the Treaty of Versailles, crushed by 1923 hyperinflation, and hit by the 1930s Great Depression, desperate Germans lost faith in democracy.',
      visualCues: [
        'Stacks of nearly worthless German paper marks in a handcart',
        'Padlocked factory gates representing 5+ million unemployed by 1932',
        'Ordinary citizens vulnerable to scapegoating and extreme promises',
      ],
    },
    videos: [
      {
        id: 'vid-hyperinflation',
        youtubeId: 'QmZ36uABULY',
        title: 'Hyperinflation Horror Stories: Germany in the 1920s',
        durationHint: 'Slide 66 Clip',
        slideContext: 'How printing money wiped out life savings',
        watchFor: 'Notice how middle-class anger turned people against the Weimar government.',
      },
      {
        id: 'vid-depression-dictators',
        youtubeId: 'Ojo8-GhhQcA',
        title: 'Crash Course: Economic Depression & the Dictators',
        durationHint: 'Slide 69 Lesson',
        slideContext: 'Connecting the 1929 crash to the rise of totalitarian leaders',
        watchFor: 'See why democracies looked weak during global economic collapse.',
      },
      {
        id: 'vid-hitler-rise',
        youtubeId: 'jFICRFKtAc4',
        title: 'TED-Ed: How Did Hitler Rise to Power?',
        durationHint: 'Slide 80 Explainer',
        slideContext: 'From Weimar elections to the Reichstag Fire and Enabling Act',
        watchFor: 'Trace the legal steps Hitler used to dismantle democracy from within.',
      },
      {
        id: 'vid-nuremberg',
        youtubeId: 'n2cTufshW9Q',
        title: 'The Nuremberg Laws (1935)',
        durationHint: 'Slide 85 Clip',
        slideContext: 'Turning antisemitism into official Nazi law',
        watchFor: 'Identify the rights stripped from Jewish Germans in 1935.',
      },
      {
        id: 'vid-kristallnacht',
        youtubeId: 'G7W8fT83h_k',
        title: 'Kristallnacht: Night of the Broken Glass (1938)',
        durationHint: 'Slide 88 Clip',
        slideContext: 'Escalation from legal discrimination to mass violence',
        watchFor: 'Note the destruction of synagogues, homes, and mass arrests.',
      },
      {
        id: 'vid-holocaust-cc',
        youtubeId: 'iQeDvnapdlg',
        startSeconds: 10,
        title: 'Crash Course: Holocaust, Genocide & Mass Murder',
        durationHint: 'Slide 90 Lesson',
        slideContext: 'Systematic murder of 6M Jewish people and 14M+ total victims',
        watchFor: 'Understand how eugenics and dehumanization led to state-organized genocide.',
      },
      {
        id: 'vid-life-nazi',
        youtubeId: 'cDFFis0j4JM',
        title: 'Life in Nazi Germany',
        durationHint: 'Slide 91 Overview',
        slideContext: 'Daily control through propaganda, youth groups, and fear',
        watchFor: 'Observe how citizens were pressured to conform or stay silent.',
      },
    ],
    topics: [
      {
        id: 'understandings-fascism',
        title: 'What Is Fascism?',
        kicker: 'Core Ideas',
        plainTakeaway:
          'Fascism is a far-right dictatorship that rejects both liberal democracy and communist equality—putting the nation and "strong" elite above individual rights.',
        keyPoints: [
          'Fascism grew after WWI (especially in Mussolini’s Italy and Hitler’s Germany) as a reaction against liberal democracy and the fear of communism.',
          'Unlike communism (which opposes economic freedom), fascism allows some private business—as long as businesses serve the needs of the state—while banning unions and workers’ rights.',
          'Fascists strongly reject social and political freedoms: they believe only an elite group and one supreme leader (Fuehrer-prinzip) should hold power.',
          'While communism looks forward to an equal future utopia, fascism looks backward to an idealized past and promotes extreme inequality.',
        ],
        rejectsLiberalism:
          'Openly attacks democracy, individual rights ("only some are worthy"), and minority protections in favor of obedience and national dominance.',
      },
      {
        id: 'social-darwinism-eugenics',
        title: 'Social Darwinism & Eugenics',
        kicker: 'Pseudoscientific Justification',
        plainTakeaway:
          'Fascists twisted "survival of the fittest" into an excuse for racism, discrimination, and genocide.',
        keyPoints: [
          'Social Darwinism applies "survival of the fittest" to human groups and nations—claiming powerful people or countries dominate because they are naturally superior.',
          'In the 1800s it was used to justify laissez-faire inequality; in the 20th century, fascists used it to argue nations are locked in a violent struggle for survival.',
          'Eugenics proposed "improving" the human species by encouraging reproduction among people with "desirable" traits and stopping or eliminating people with disabilities, illnesses, or targeted backgrounds.',
          'Nazi leaders used Social Darwinism and eugenics to justify stripping rights from minorities and carrying out mass murder.',
        ],
        rejectsLiberalism:
          'Destroys the core liberal principle that all human beings are born equal and deserve equal protection under the law.',
      },
      {
        id: 'weimar-crisis',
        title: 'The Treaty of Versailles & Weimar Crisis',
        kicker: '1919–1932 Germany',
        plainTakeaway:
          'Harsh WWI penalties, hyperinflation, and the Great Depression made desperate Germans lose faith in their new democratic government.',
        keyPoints: [
          'After WWI, Germany’s new liberal democracy—the Weimar Republic—was forced to sign the Treaty of Versailles (1919).',
          'Treaty terms punished Germany harshly: territorial losses (e.g., Alsace-Lorraine and colonies), strict military limits (small army, no air force or submarines), the War Guilt clause, and $33 billion in reparations.',
          'When Germany could not pay in 1923, the government printed huge amounts of money, causing hyperinflation that wiped out ordinary citizens’ life savings.',
          'In the 1930s Great Depression, American loans dried up and over 5 million Germans became unemployed. Weak, divided coalition governments looked unable to solve the crisis.',
          'Meanwhile, business owners and landowners feared a 1917-style communist revolution—making many willing to support extreme anti-communist leaders.',
        ],
        rejectsLiberalism:
          'Severe economic hardship and weak multi-party politics convinced millions that liberal democracy could not protect or feed them.',
      },
      {
        id: 'hitler-power-holocaust',
        title: 'Hitler’s Rise, Enabling Act & The Holocaust',
        kicker: '1923–1945',
        plainTakeaway:
          'Hitler used scapegoats and fear of communism to gain legal power in 1933, passed the Enabling Act to become dictator, and unleashed the Holocaust.',
        keyPoints: [
          'After a failed 1923 coup landed him in jail, Hitler wrote Mein Kampf ("My Struggle") and promised to use legal elections instead of force.',
          'The Nazis gained support by blaming Germany’s struggles on scapegoats: the Weimar government, Communists, Jewish people, and minorities.',
          'Appointed Chancellor on January 30, 1933, Hitler used the Reichstag Fire (Feb 27, 1933)—blamed on a Communist—to stoke fear and win a snap election.',
          'He then passed the Enabling Act, eliminating political opposition and individual rights and turning Germany into a one-party dictatorship.',
          'Nazi rule used SA and SS terror, propaganda, and youth groups while persecuting Jewish people, Roma, people with disabilities, homosexuals, and political opponents.',
          'Escalation of persecution: Nuremberg Laws (1935) stripped Jewish citizenship and banned intermarriage → Kristallnacht (Nov 9–10, 1938, "Night of the Broken Glass") burned synagogues/shops and sent ~30,000 Jewish people to camps → The Holocaust murdered over 6 million Jewish people and more than 14 million people in total.',
        ],
        rejectsLiberalism:
          'Showed how a democracy can be dismantled from within when civil rights, minority protections, and opposition parties are legally abolished.',
      },
    ],
    comparison: {
      title: 'Two Extremes: Communism (USSR) vs. Fascism (Nazi Germany)',
      leftHeading: 'Communism (Far Left)',
      rightHeading: 'Fascism (Far Right)',
      rows: [
        {
          aspect: 'View of Equality',
          leftLabel: 'Strives for total social and economic equality (classless society).',
          rightLabel: 'Resists equality; promotes hierarchy and racial/national superiority.',
        },
        {
          aspect: 'Time Orientation',
          leftLabel: 'Radical: rejects the past to build an idealized future utopia.',
          rightLabel: 'Reactionary: looks back to an idealized, glorious national past.',
        },
        {
          aspect: 'Economic System',
          leftLabel: 'Public/state ownership; private property abolished.',
          rightLabel: 'Private enterprise allowed if directed by the state; unions banned.',
        },
        {
          aspect: 'Political Freedoms',
          leftLabel: 'Totalitarian one-party rule; no political opposition allowed.',
          rightLabel: 'Totalitarian one-party rule; cult of the leader; no opposition allowed.',
        },
      ],
    },
    checkpoint: {
      id: 'cp-3',
      question:
        'How did Adolf Hitler use the 1933 Reichstag Fire to turn Germany into a dictatorship?',
      options: [
        'He resigned as Chancellor to protest the Treaty of Versailles.',
        'He blamed the fire on Communists to fuel public fear, win an election, and pass the Enabling Act.',
        'He invited the Soviet Red Army to help rebuild the German parliament.',
        'He immediately abolished all private businesses in Germany.',
      ],
      correctIndex: 1,
      explanation:
        'Hitler used the Reichstag Fire to convince Germans a communist revolution was underway, winning enough parliamentary support to pass the Enabling Act and eliminate all opposition.',
    },
  },
  {
    id: 'dictatorship-techniques',
    number: 'Chapter 04',
    title: 'How Dictatorships Keep Power',
    subtitle: 'Totalitarianism vs. authoritarianism, radical vs. reactionary change, and the 9 techniques of control.',
    estimatedMinutes: 5,
    illustration: {
      imagePath: '/src/assets/images/source_propaganda_control_1795096450719.jpg',
      alt: 'Editorial cartoon of a shadowy figure behind a podium pulling strings attached to newspapers, a radio mic, and school textbooks',
      title: 'Manufacturing Consent: Media & Education Control',
      caption:
        'Totalitarian dictatorships do not rely on force alone—they control newspapers, radio broadcasts, and schoolbooks to shape what citizens believe.',
      visualCues: [
        'Puppet strings linking the podium to press, radio, and schoolbooks',
        'Censorship removes opposing viewpoints before citizens ever hear them',
        'Indoctrination through curriculum targets the next generation',
      ],
    },
    videos: [
      {
        id: 'vid-rev-control',
        youtubeId: 'j-tICpleWLI',
        title: 'Russian Revolution & Rise of Single-Party Control',
        durationHint: 'Slide 24 Clip',
        slideContext: 'How revolutionary movements consolidate authoritarian power',
        watchFor: 'Notice how opposition groups are silenced once a regime takes hold.',
      },
      {
        id: 'vid-econ-chaos',
        youtubeId: 'o-PNlhhVhZ8',
        title: 'Hyperinflation & Political Desperation',
        durationHint: 'Slide 66 Clip',
        slideContext: 'Why crisis makes people receptive to scapegoating',
        watchFor: 'Connect economic collapse to citizens accepting extreme leaders.',
      },
      {
        id: 'vid-youth-indoctrination',
        youtubeId: 'lRjeAzTHtCQ',
        title: 'Youth Movements & Indoctrination in Nazi Germany',
        durationHint: 'Slide 85 Clip',
        slideContext: 'Training young citizens for obedience and loyalty',
        watchFor: 'Look at how schools and youth leagues replaced independent thinking.',
      },
    ],
    topics: [
      {
        id: 'totalitarian-vs-authoritarian',
        title: 'Totalitarian vs. Authoritarian Governments',
        kicker: 'Comparing Systems',
        plainTakeaway:
          'All totalitarian regimes are authoritarian, but totalitarianism goes further by controlling every part of your private and public life.',
        keyPoints: [
          'Authoritarianism: All government decisions are made by one person or a small group (e.g., Absolute Monarchy, Oligarchy, or a military Junta). Leaders are not elected and ignore the will of the people.',
          'Totalitarianism: The government controls EVERY aspect of citizens’ lives—media, schools, economy, art, and beliefs—imposing one official ideology with zero tolerance for opposition.',
          'Both Stalin’s USSR and Hitler’s Germany used a strict hierarchical pyramid: one charismatic leader at the top (Stalin = "Man of Steel", Mussolini = "Il Duce", Hitler = "Führer"), top party elites below, local party members, and the obedient masses at the bottom.',
        ],
        rejectsLiberalism:
          'Directly opposes S.O. 3.3 (will of the people) because power flows top-down from an unaccountable ruler rather than bottom-up from voters.',
      },
      {
        id: 'radical-vs-reactionary',
        title: 'Radical vs. Reactionary Regimes',
        kicker: 'Direction of Change',
        plainTakeaway:
          'Radical regimes tear down traditions to chase a brand-new future; reactionary regimes try to pull society back to an idealized past.',
        keyPoints: [
          'Radical (Far Left — e.g., Soviet Union): Rejects political and economic traditions of the past and pushes complete transformation toward public ownership and a classless society.',
          'Reactionary (Far Right — e.g., Nazi Germany): Wants to restore an idealized past of national greatness and accepts natural inequality and hierarchy.',
        ],
        rejectsLiberalism:
          'Both reject modern liberal democracy’s balanced, evolutionary reform in favor of sweeping, forced transformation.',
      },
      {
        id: 'nine-techniques',
        title: 'The 9 Techniques of Dictatorships',
        kicker: 'How Dictators Keep People in Line',
        plainTakeaway:
          'Dictators stay in power through a mix of brainwashing (propaganda, schools, rallies) and punishment (secret police, censorship, eliminating rivals).',
        keyPoints: [
          '1. Censorship: Controlling or blocking newspapers, radio, books, art, and social media (e.g., hiding war casualties or banning negative news).',
          '2. Glorifying the Leader: Portraying the dictator as a flawless savior ("Man of Steel", "Führer") to build unquestioning loyalty.',
          '3. Indoctrination through Curriculum: Rewriting textbooks and youth programs (like Hitler Youth or Nazi math problems about bombing and racial populations) to shape young minds.',
          '4. Scapegoating: Blaming national problems on targeted minorities or enemies to take pressure off the dictator.',
          '5. Popular Movements & Rallies: Massive rallies and energetic speeches to create emotional unity.',
          '6. Propaganda: Posters, radio, and film designed to convince citizens of the leader’s greatness and ideology.',
          '7. Fear, Force & Terror: Using secret police (NKVD, SS) and harsh penalties so citizens are too afraid to resist.',
          '8. Elimination of Opposition & Stopping Dissidents: Banning rival parties and jailing or exiling critics (dissidents), such as sending kulaks to Gulags.',
          '9. Controlled Participation & One-Sided Elections: Staging rallies and rigged elections (90%–100% landslides) to create the illusion of public choice.',
        ],
        rejectsLiberalism:
          'Each technique attacks a specific liberal pillar—free press, free speech, fair elections, independent courts, and minority rights.',
      },
    ],
    comparison: {
      title: 'How Both Regimes Used Dictatorship Techniques',
      leftHeading: 'Stalin’s Soviet Union',
      rightHeading: 'Hitler’s Nazi Germany',
      rows: [
        {
          aspect: 'Secret Police & Terror',
          leftLabel: 'NKVD secret police, Great Purges (1936–39), and Gulag camps.',
          rightLabel: 'SA stormtroopers, SS, Gestapo, and concentration camps.',
        },
        {
          aspect: 'Scapegoats Targeted',
          leftLabel: 'Kulaks, "bourgeois" capitalists, and political rivals like Trotsky.',
          rightLabel: 'Jewish population, Communists, Weimar politicians, Roma, and minorities.',
        },
        {
          aspect: 'Indoctrination & Media',
          leftLabel: 'Rewriting Soviet history archives and censoring art/literature.',
          rightLabel: 'Hitler Youth, Nazi math textbooks, posters, and radio propaganda.',
        },
        {
          aspect: 'Leader Cult',
          leftLabel: 'Stalin ("Man of Steel") glorified as infallible guide.',
          rightLabel: 'Hitler ("Führer") worshipped under the Fuehrer-prinzip.',
        },
      ],
    },
    checkpoint: {
      id: 'cp-4',
      question:
        'Why do dictatorships still bother holding elections where the dictator receives 95% to 100% of the vote?',
      options: [
        'To give opposition parties a fair chance to win seats in parliament.',
        'To give the illusion of democratic legitimacy and controlled participation without real choice.',
        'Because the Treaty of Versailles forced all countries to hold annual votes.',
        'To encourage citizens to openly criticize government policies.',
      ],
      correctIndex: 1,
      explanation:
        'One-sided elections and controlled participation make the regime look popular and legitimate at home and abroad, even though voters have no genuine democratic choice.',
    },
  },
];

export const VOCAB_TERMS: VocabTerm[] = [
  {
    id: 'communism',
    term: 'Communism',
    category: 'Soviet Communism',
    definition:
      'A far-left ideology based on Marxism where property is publicly owned, social classes are eliminated, and incomes are equalized.',
    example: 'The Soviet Union under Lenin and Stalin became the world’s first communist state.',
    memoryTip: 'Think "community" — everything is owned collectively rather than privately.',
  },
  {
    id: 'marxism',
    term: 'Marxism (Scientific Socialism)',
    category: 'Soviet Communism',
    definition:
      'Karl Marx and Friedrich Engels’ theory that workers will violently overthrow business owners to create a classless society with no private property.',
    example: 'Russian activists read The Communist Manifesto for inspiration against the Czar.',
    memoryTip: 'Marx wrote the theory; Lenin and Stalin put their own versions into practice.',
  },
  {
    id: 'czar',
    term: 'Czar',
    category: 'Soviet Communism',
    definition:
      'The absolute monarch who held complete political, social, and economic control over Russia before 1917.',
    example: 'Czar Nicholas II was forced to abdicate during the 1917 Russian Revolution.',
    memoryTip: 'Derived from "Caesar" — an all-powerful emperor.',
  },
  {
    id: 'subsistence-agriculture',
    term: 'Subsistence Agriculture',
    category: 'Soviet Communism',
    definition:
      'Farming only enough food for your own family to survive, leaving little surplus to sell or grow the economy.',
    example: '1800s Russia relied heavily on subsistence farming by poor serfs, slowing industrialization.',
    memoryTip: '"Subsist" = just barely survive.',
  },
  {
    id: 'bloody-sunday',
    term: 'Bloody Sunday (1905)',
    category: 'Soviet Communism',
    definition:
      'January 1905 event where the Czar’s soldiers opened fire on peaceful St. Petersburg marchers demanding food and better working conditions.',
    example: 'Bloody Sunday sparked nationwide strikes and the 1905 Russian Revolution.',
    memoryTip: '1905 turning point: peaceful march turned deadly, destroying trust in the Czar.',
  },
  {
    id: 'october-manifesto',
    term: 'October Manifesto',
    category: 'Soviet Communism',
    definition:
      'A 1905 promise signed by Czar Nicholas II allowing political parties and granting basic civil rights like freedom of speech and religion.',
    example: 'Signed after the St. Petersburg Soviet led a general strike across Russia.',
    memoryTip: 'A temporary liberal concession forced out of the Czar in 1905.',
  },
  {
    id: 'bolsheviks',
    term: 'Bolsheviks',
    category: 'Soviet Communism',
    definition:
      'The radical communist party led by Vladimir Lenin that seized power in Russia in October 1917.',
    example: 'Their slogan "Peace! Land! Bread!" rallied war-weary soldiers, workers, and peasants.',
    memoryTip: 'Lenin’s party that fought the Red vs. White Civil War.',
  },
  {
    id: 'red-terror',
    term: 'Red Terror',
    category: 'Soviet Communism',
    definition:
      'Lenin’s violent campaign of torture and executions to eliminate political rivals after an assassination attempt on his life.',
    example: 'Showed that Lenin’s government would not tolerate liberal opposition.',
    memoryTip: 'Red = Bolsheviks; Terror = silencing rivals by force.',
  },
  {
    id: 'war-communism',
    term: 'War Communism (1918–1921)',
    category: 'Soviet Communism',
    definition:
      'Lenin’s emergency economic policy during the Russian Civil War that nationalized land/factories, abolished money, and seized surplus grain.',
    example: 'Failed miserably as peasants planted fewer crops, causing severe famine and industrial drop.',
    memoryTip: 'Extreme command economy during wartime — caused famine.',
  },
  {
    id: 'nep',
    term: 'New Economic Policy (NEP)',
    category: 'Soviet Communism',
    definition:
      'Lenin’s 1921 "temporary retreat" combining state control of big industries with small private businesses, private peasant farms, and money.',
    example: 'Restored stability to the Soviet economy after the disaster of War Communism.',
    memoryTip: 'NEP = New Economic compromise (state + small private enterprise).',
  },
  {
    id: 'gulag',
    term: 'Gulag',
    category: 'Soviet Communism',
    definition:
      'The Soviet forced-labor prison camp system used to isolate and punish anyone who opposed Stalin’s rule.',
    example: 'Millions of dissidents, kulaks, and Purge victims were sent to Gulags in Siberia.',
    memoryTip: 'Soviet prison camps for political enemies.',
  },
  {
    id: 'nkvd',
    term: 'NKVD',
    category: 'Soviet Communism',
    definition:
      'Stalin’s secret police force used to spy on citizens, arrest suspects, and enforce absolute obedience through terror.',
    example: 'Carried out arrests and executions during Stalin’s Great Purges (1936–1939).',
    memoryTip: 'Stalin’s equivalent of Nazi secret police.',
  },
  {
    id: 'collectivization',
    term: 'Collectivization',
    category: 'Soviet Communism',
    definition:
      'Stalin’s policy (1929–1933) forcing peasants to give up private farms and join large state-run collective farms (kolkhozy).',
    example: 'Land, animals, and machinery became shared group property under state quotas.',
    memoryTip: '"Collect" private farms into one giant state-controlled farm.',
  },
  {
    id: 'kulaks',
    term: 'Kulaks',
    category: 'Soviet Communism',
    definition:
      'Prosperous peasant farmers in the Soviet Union who resisted Stalin’s collectivization and were targeted for elimination.',
    example: 'Many kulaks burned crops and killed cattle rather than surrender them; millions were sent to Gulags.',
    memoryTip: 'Wealthier peasants crushed by Stalin’s 1930 offensive.',
  },
  {
    id: 'holodomor',
    term: 'The Holodomor (1932–1933)',
    category: 'Soviet Communism',
    definition:
      'A devastating, Stalin-era planned famine in Ukraine caused by forced grain quotas and withholding stockpiled food to crush resistance.',
    example: 'Starved 7 to 10 million people and suppressed Ukrainian nationalism.',
    memoryTip: 'Holodomor = Ukrainian terror-famine under Stalin.',
  },
  {
    id: 'five-year-plans',
    term: 'Five-Year Plans',
    category: 'Soviet Communism',
    definition:
      'Stalin’s strict central economic plans designed to rapidly industrialize the Soviet Union at any human cost.',
    example: 'Turned the USSR into a major industrial and military power within a decade.',
    memoryTip: 'Central economic targets set every 5 years.',
  },
  {
    id: 'egalitarianism',
    term: 'Egalitarianism',
    category: 'Soviet Communism',
    definition:
      'The belief that all people—regardless of class, gender, or nationality—should be treated equally.',
    example: 'A core value of communist theory that fascists strongly rejected.',
    memoryTip: 'Egal = Equal (like French "égalité").',
  },
  {
    id: 'fascism',
    term: 'Fascism',
    category: 'Fascism & Nazism',
    definition:
      'A far-right, authoritarian nationalist ideology led by a single dictator that rejects democracy, equality, and individual rights.',
    example: 'Mussolini’s Italy and Hitler’s Nazi Germany were fascist dictatorships.',
    memoryTip: 'Far-right extreme nationalism + dictatorship + inequality.',
  },
  {
    id: 'social-darwinism',
    term: 'Social Darwinism',
    category: 'Fascism & Nazism',
    definition:
      'The belief in "survival of the fittest" applied to human societies—claiming stronger groups or nations naturally deserve power over weaker ones.',
    example: 'Fascists used Social Darwinism to justify war, racism, and human inequality.',
    memoryTip: 'Darwin’s nature theory twisted into an excuse for inequality.',
  },
  {
    id: 'eugenics',
    term: 'Eugenics',
    category: 'Fascism & Nazism',
    definition:
      'An ideology advocating the "improvement" of the human species by promoting traits viewed as superior and eliminating or sterilizing others.',
    example: 'The Nazis used eugenics to target people with disabilities and justify genocide.',
    memoryTip: 'Eu- (good) + gen- (genes) — deadly Nazi pseudoscience.',
  },
  {
    id: 'weimar-republic',
    term: 'Weimar Republic',
    category: 'Fascism & Nazism',
    definition:
      'Germany’s post-WWI liberal democratic government (1919–1933) that struggled with the Treaty of Versailles, hyperinflation, and the Great Depression.',
    example: 'Many Germans blamed the Weimar Republic for accepting WWI defeat and economic ruin.',
    memoryTip: 'The weak democracy Hitler replaced in 1933.',
  },
  {
    id: 'treaty-of-versailles',
    term: 'Treaty of Versailles (1919)',
    category: 'Fascism & Nazism',
    definition:
      'The harsh WWI peace treaty that stripped German territory, limited its military, forced it to accept War Guilt, and demanded $33B in reparations.',
    example: 'Hitler gained popularity by promising to tear up the Treaty of Versailles.',
    memoryTip: '414 of 440 clauses punished Germany — fueled deep resentment.',
  },
  {
    id: 'hyperinflation',
    term: 'Hyperinflation',
    category: 'Fascism & Nazism',
    definition:
      'Out-of-control price increases paired with a currency losing almost all its value, wiping out people’s savings.',
    example: 'In 1923, Germany printed massive amounts of marks, making money nearly worthless.',
    memoryTip: 'Money loses value so fast a loaf of bread costs billions.',
  },
  {
    id: 'enabling-act',
    term: 'The Enabling Act (1933)',
    category: 'Fascism & Nazism',
    definition:
      'The law passed after the Reichstag Fire that gave Hitler absolute power to make laws without parliament, ending German democracy.',
    example: 'Wiped out opposition parties and civil rights in 1933.',
    memoryTip: '"Enabled" Hitler to legally become a dictator.',
  },
  {
    id: 'nuremberg-laws',
    term: 'Nuremberg Laws (1935)',
    category: 'Fascism & Nazism',
    definition:
      'Nazi racial laws defining who was considered Jewish, stripping Jewish Germans of citizenship, and banning marriage with "Aryan" Germans.',
    example: 'Turned antisemitic prejudice into official state law.',
    memoryTip: '1935 legal persecution defining "pure Aryans" vs. targets.',
  },
  {
    id: 'kristallnacht',
    term: 'Kristallnacht (Nov 9–10, 1938)',
    category: 'Fascism & Nazism',
    definition:
      '"Night of the Broken Glass"—a coordinated Nazi-led rampage destroying Jewish homes, shops, and synagogues; 91 killed and ~30,000 sent to camps.',
    example: 'Marked a sharp shift from legal discrimination to widespread violent terror.',
    memoryTip: 'Broken glass from smashed Jewish storefronts across Germany.',
  },
  {
    id: 'totalitarianism',
    term: 'Totalitarianism',
    category: 'Dictatorship & Spectrum',
    definition:
      'A political system where the government exerts total control over EVERY aspect of citizens’ public and private lives and enforces one ideology.',
    example: 'Both Stalin’s USSR and Hitler’s Germany were totalitarian dictatorships.',
    memoryTip: '"Total" = controls 100% of life (schools, media, beliefs, economy).',
  },
  {
    id: 'authoritarianism',
    term: 'Authoritarianism',
    category: 'Dictatorship & Spectrum',
    definition:
      'A political system where power is concentrated in one leader or small group (monarchy, oligarchy, junta) without democratic accountability.',
    example: 'Citizens have few civil liberties and cannot vote leaders out.',
    memoryTip: 'Authority sits at the top without the will of the people.',
  },
  {
    id: 'radical-reactionary',
    term: 'Radical vs. Reactionary',
    category: 'Dictatorship & Spectrum',
    definition:
      'Radical (far left) seeks complete change away from past traditions toward a classless future; Reactionary (far right) seeks a return to an idealized past and hierarchy.',
    example: 'USSR = Radical; Nazi Germany = Reactionary.',
    memoryTip: 'Radical = Root-level future change; Reactionary = Reacting back to the past.',
  },
  {
    id: 'scapegoating',
    term: 'Scapegoating',
    category: 'Dictatorship & Spectrum',
    definition:
      'Blaming a country’s economic or social problems on an innocent minority or rival group to redirect public anger away from the dictator.',
    example: 'Hitler blamed Jewish people and Communists for Germany’s post-WWI struggles.',
    memoryTip: 'Finding someone else to take the blame.',
  },
  {
    id: 'indoctrination',
    term: 'Indoctrination',
    category: 'Dictatorship & Spectrum',
    definition:
      'Intentionally using schools, youth groups, or media to teach people to accept one ideology without questioning it.',
    example: 'Nazi school math problems taught racial hierarchy and military bombing calculations.',
    memoryTip: 'Teaching "what" to think, not "how" to think critically.',
  },
  {
    id: 'dissident',
    term: 'Dissident',
    category: 'Dictatorship & Spectrum',
    definition:
      'Someone who openly speaks out against or opposes the government and its policies.',
    example: 'Dictatorships imprison or exile dissidents, like Stalin sending critics to Gulags.',
    memoryTip: 'Diss-ident = someone who expresses dissent (disagreement).',
  },
];

export const SPECTRUM_QUADRANTS: SpectrumQuadrant[] = [
  {
    id: 'dem-socialism',
    quadrantNumber: 1,
    title: 'Democratic Socialism',
    countryExamples: 'Sweden',
    politicalAxis: 'High Political Freedom',
    economicAxis: 'Economic Collectivism',
    description:
      'Citizens keep full democratic rights, free elections, and civil liberties while the government plays a strong role in providing social programs and regulating the economy.',
    liberalismStance: 'Reflects modern liberalism & democratic will of the people.',
  },
  {
    id: 'dem-capitalism',
    quadrantNumber: 2,
    title: 'Democratic Capitalism',
    countryExamples: 'Canada · United States',
    politicalAxis: 'High Political Freedom',
    economicAxis: 'Economic Individualism',
    description:
      'Multi-party democracy and individual rights are paired with private property, market competition, and economic freedom (with varying levels of social safety nets).',
    liberalismStance: 'Core liberal model balancing political and economic freedom.',
  },
  {
    id: 'communism',
    quadrantNumber: 3,
    title: 'Communism (Totalitarian Left)',
    countryExamples: 'Soviet Union (USSR)',
    politicalAxis: 'High Political Control',
    economicAxis: 'Economic Collectivism',
    description:
      'Maximum government control over both politics and the economy. Private property is abolished, industries are state-planned, and one party rules without opposition.',
    liberalismStance: 'Rejects capitalism, private property, individual freedoms, and democracy.',
  },
  {
    id: 'fascism',
    quadrantNumber: 4,
    title: 'Fascism (Totalitarian Right)',
    countryExamples: 'Nazi Germany · Fascist Italy',
    politicalAxis: 'High Political Control',
    economicAxis: 'Economic Individualism',
    description:
      'Maximum political control by an all-powerful leader and single party, paired with private business ownership directed to serve national goals (while banning unions).',
    liberalismStance: 'Rejects democracy, human equality, minority rights, and civil liberties.',
  },
];

export const SPECTRUM_CHALLENGES: SpectrumChallenge[] = [
  {
    id: 'sc-1',
    statement:
      '"All private farms and factories belong to the state. Citizens cannot vote for opposition parties or criticize the Five-Year Plan."',
    correctQuadrantId: 'communism',
    explanation:
      'High government economic control (no private farms/factories) + high political control (no opposition) = Quadrant 3: Communism.',
  },
  {
    id: 'sc-2',
    statement:
      '"Private companies may keep operating and earn profits as long as they build weapons for the nation—but labor unions and rival parties are illegal."',
    correctQuadrantId: 'fascism',
    explanation:
      'Private enterprise serving the state (economic right) + one-party dictatorship (political control) = Quadrant 4: Fascism.',
  },
  {
    id: 'sc-3',
    statement:
      '"Citizens freely vote in multi-party elections and enjoy strong universal healthcare and public education funded by higher taxes."',
    correctQuadrantId: 'dem-socialism',
    explanation:
      'High political freedom (multi-party democracy) + economic collectivism (strong public programs) = Quadrant 1: Democratic Socialism (e.g., Sweden).',
  },
  {
    id: 'sc-4',
    statement:
      '"Entrepreneurs compete freely in the marketplace while citizens elect representatives and rely on a Charter of Rights to protect free speech."',
    correctQuadrantId: 'dem-capitalism',
    explanation:
      'High political freedom + economic individualism = Quadrant 2: Democratic Capitalism (e.g., Canada & the US).',
  },
];

export const DICTATORSHIP_TECHNIQUES_LIST = [
  'Censorship',
  'Glorifying the Leader',
  'Indoctrination through Curriculum',
  'Scapegoating',
  'Propaganda',
  'Fear, Force & Terror',
  'Stopping Dissidents / Eliminating Opposition',
  'One-Sided Elections / Controlled Participation',
];

export const TECHNIQUE_SCENARIOS: TechniqueScenario[] = [
  {
    id: 'ts-1',
    scenario:
      'In Nazi Germany, high school math textbooks asked students to calculate the trajectory of a bomb dropped from a warplane and compare the yearly state cost of caring for mentally ill patients.',
    regime: 'Nazi Germany',
    correctTechnique: 'Indoctrination through Curriculum',
    options: [
      'Indoctrination through Curriculum',
      'One-Sided Elections / Controlled Participation',
      'Censorship',
      'Scapegoating',
    ],
    explanation:
      'Dictators rewrite school textbooks and curriculum so young people absorb war values, racism, and state ideology from childhood.',
  },
  {
    id: 'ts-2',
    scenario:
      'Stalin’s government altered official Soviet historical archives and photographs to erase rivals like Leon Trotsky and present only a state-approved version of history.',
    regime: 'Soviet Union',
    correctTechnique: 'Censorship',
    options: [
      'Censorship',
      'One-Sided Elections / Controlled Participation',
      'Scapegoating',
      'Glorifying the Leader',
    ],
    explanation:
      'Censorship manipulates or hides information (newspapers, books, archives, social media) so citizens only see what benefits the regime.',
  },
  {
    id: 'ts-3',
    scenario:
      'After the 1933 Reichstag Fire, Hitler blamed the Communist Party and previously blamed Jewish citizens and the Weimar government for Germany’s economic collapse.',
    regime: 'Nazi Germany',
    correctTechnique: 'Scapegoating',
    options: [
      'Scapegoating',
      'Indoctrination through Curriculum',
      'One-Sided Elections / Controlled Participation',
      'Glorifying the Leader',
    ],
    explanation:
      'Scapegoating directs public frustration toward a targeted group or enemy, taking pressure off the dictator.',
  },
  {
    id: 'ts-4',
    scenario:
      'Mussolini called himself "Il Duce" (the leader), Hitler used "Führer" (guide), and Stalin adopted "Man of Steel" while posters portrayed each ruler as nearly flawless saviors.',
    regime: 'Modern / General Dictatorship',
    correctTechnique: 'Glorifying the Leader',
    options: [
      'Glorifying the Leader',
      'Censorship',
      'Fear, Force & Terror',
      'Scapegoating',
    ],
    explanation:
      'Building a charismatic "cult of the leader" encourages citizens to feel dependent on and unquestioningly loyal to the ruler.',
  },
  {
    id: 'ts-5',
    scenario:
      'During collectivization, Stalin sent prosperous peasants (kulaks) who spoke against seizing their farms to forced-labor Gulags, and eliminated rivals in the 1936–1939 Purges.',
    regime: 'Soviet Union',
    correctTechnique: 'Stopping Dissidents / Eliminating Opposition',
    options: [
      'Stopping Dissidents / Eliminating Opposition',
      'One-Sided Elections / Controlled Participation',
      'Indoctrination through Curriculum',
      'Propaganda',
    ],
    explanation:
      'Dissidents (people who speak out) and rival politicians are imprisoned, exiled, or executed so no organized opposition can survive.',
  },
  {
    id: 'ts-6',
    scenario:
      'In North Korea, elections are held where Kim Jong Un receives 100% of the vote, similar to massive staged rallies in Nuremberg that made Nazi control look universally popular.',
    regime: 'Modern / General Dictatorship',
    correctTechnique: 'One-Sided Elections / Controlled Participation',
    options: [
      'One-Sided Elections / Controlled Participation',
      'Indoctrination through Curriculum',
      'Censorship',
      'Fear, Force & Terror',
    ],
    explanation:
      'Controlled participation and rigged 90%–100% elections create the illusion that citizens freely choose and support the dictatorship.',
  },
];

export const QUIZ_TRACKS: QuizTrackMeta[] = [
  {
    id: 'communism',
    title: 'Communism & the Soviet Union',
    subtitle: 'Czars, 1905 & 1917 Revolutions, War Communism vs. NEP, Stalinism & Holodomor',
    questionCount: 8,
  },
  {
    id: 'fascism',
    title: 'Fascism & Nazi Germany',
    subtitle: 'Versailles, Weimar crisis, Social Darwinism, Enabling Act & Holocaust',
    questionCount: 8,
  },
  {
    id: 'techniques',
    title: 'Dictatorship Techniques & Spectrum',
    subtitle: 'Totalitarian vs. Authoritarian, Radical vs. Reactionary, Grid & 9 Techniques',
    questionCount: 8,
  },
  {
    id: 'full-review',
    title: 'Full Theme 6 Practice Test',
    subtitle: '15 mixed 30-2 style questions covering all outcomes (S.O. 2.9, 3.3, 3.5)',
    questionCount: 15,
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Track 1: Communism (8 questions)
  {
    id: 'q-c1',
    track: 'communism',
    question:
      'How did 20th-century Soviet communism differ from Karl Marx’s original vision of communism?',
    options: [
      'Marx wanted private businesses to stay open, whereas Stalin allowed free-market capitalism.',
      'Marx believed a true communist society would eventually have no government, whereas the USSR built a massive, powerful state.',
      'Marx supported absolute monarchy, whereas Lenin supported multi-party democracy.',
      'Marx focused only on farmers, whereas the USSR banned all factories.',
    ],
    correctIndex: 1,
    explanation:
      'Marx envisioned the state eventually disappearing once classes were gone. In practice, Lenin and Stalin created huge, authoritarian government control.',
  },
  {
    id: 'q-c2',
    track: 'communism',
    question: 'What was the main historical significance of "Bloody Sunday" in January 1905?',
    options: [
      'It ended the Russian Civil War with a White Army victory.',
      'Czarist soldiers shot unarmed marchers asking for food and reforms, sparking mass strikes and the 1905 Revolution.',
      'Stalin signed an agreement with Germany to divide Poland.',
      'Peasants voluntarily donated all their grain to factory workers.',
    ],
    correctIndex: 1,
    explanation:
      'When the Czar’s troops fired on peaceful protesters outside the Winter Palace, public outrage triggered strikes, the St. Petersburg Soviet, and the October Manifesto.',
  },
  {
    id: 'q-c3',
    track: 'communism',
    sourceQuote: '"Peace! Land! Bread!"',
    sourceAttribution: 'Bolshevik Party Slogan, 1917',
    question:
      'Why did this slogan win huge support for Vladimir Lenin and the Bolsheviks in 1917?',
    options: [
      'It promised to keep Russia fighting in WWI until Germany paid reparations.',
      'It directly addressed what Russians wanted most: exiting WWI, giving land to peasants, and ending starvation.',
      'It promised to restore Czar Nicholas II to the throne with limited powers.',
      'It called for foreign European capitalists to buy more Russian factories.',
    ],
    correctIndex: 1,
    explanation:
      'Kerensky’s Provisional Government kept Russia in WWI and refused land reform. Lenin promised the exact three things workers, soldiers, and peasants desperately needed.',
  },
  {
    id: 'q-c4',
    track: 'communism',
    question: 'Why did Lenin’s policy of War Communism (1918–1921) fail?',
    options: [
      'Peasants planted fewer crops after grain was seized, and untrained workers struggled to manage factories.',
      'Foreign investors bought too many private farms and drove prices down.',
      'Workers demanded higher taxes and refused to use money.',
      'The White Army captured Moscow and shut down the railroads.',
    ],
    correctIndex: 0,
    explanation:
      'Because peasants got little in return for seized grain, they grew less—causing famine—while inexperienced workers running factories caused industrial output to plummet.',
  },
  {
    id: 'q-c5',
    track: 'communism',
    question: 'Why did Lenin describe the New Economic Policy (NEP) of 1921 as a "temporary retreat"?',
    options: [
      'It pulled Russian troops out of Poland during World War I.',
      'It temporarily allowed limited private enterprise, land ownership, and money alongside state socialism to revive the economy.',
      'It gave full political power back to the Russian nobility.',
      'It permanently abolished the Communist Party.',
    ],
    correctIndex: 1,
    explanation:
      'To recover from War Communism’s collapse, Lenin blended state control of big industries with small private businesses and peasant crop sales.',
  },
  {
    id: 'q-c6',
    track: 'communism',
    question:
      'Which statement best describes the conflict between Joseph Stalin and Leon Trotsky after Lenin’s death in 1924?',
    options: [
      'Trotsky wanted to bring back the Czar, while Stalin wanted to copy Canada’s democracy.',
      'They struggled for leadership of the USSR; Stalin won by 1928 and had Trotsky expelled, exiled, and later assassinated.',
      'They shared power peacefully until Stalin retired in 1939.',
      'Trotsky led the White Army with support from Britain and the United States.',
    ],
    correctIndex: 1,
    explanation:
      'Trotsky had been Lenin’s close ally, while Lenin distrusted Stalin. Stalin outmaneuvered Trotsky, removed him from the party, and had him killed in exile in Mexico.',
  },
  {
    id: 'q-c7',
    track: 'communism',
    question: 'What was the purpose of Stalin’s "collectivization" policy between 1929 and 1933?',
    options: [
      'To give every peasant family a private deed to sell farmland on the open market.',
      'To force individual farms into large state-directed collective farms (kolkhozy) and break the power of kulaks.',
      'To allow foreign European banks to manage Soviet agriculture.',
      'To shut down Soviet factories and return the USSR to subsistence farming.',
    ],
    correctIndex: 1,
    explanation:
      'Stalin wanted higher grain output to fuel rapid Five-Year Plan industrialization and to eliminate prosperous independent peasants (kulaks).',
  },
  {
    id: 'q-c8',
    track: 'communism',
    question: 'What was the Holodomor (1932–1933)?',
    options: [
      'A secret Soviet peace treaty signed with the Weimar Republic.',
      'A massive man-made famine in Ukraine caused by Stalin’s forced grain quotas and withholding of food, starving 7–10 million people.',
      'An underground Marxist newspaper edited by Lenin while in exile.',
      'The name of Stalin’s 1936 military alliance with Britain and France.',
    ],
    correctIndex: 1,
    explanation:
      'Stalin demanded impossible grain quotas and withheld stockpiled grain from starving Ukrainians, crushing resistance to collectivization and Ukrainian nationalism.',
  },

  // Track 2: Fascism & Nazi Germany (8 questions)
  {
    id: 'q-f1',
    track: 'fascism',
    question: 'How does fascism’s view of the economy compare to communism’s view of the economy?',
    options: [
      'Both completely abolish private business and private property.',
      'Communism opposes economic freedom and private property, while fascism allows private enterprise as long as it serves the state (and bans unions).',
      'Fascism eliminates all money, while communism protects laissez-faire capitalism.',
      'Both encourage independent labor unions to strike for higher wages.',
    ],
    correctIndex: 1,
    explanation:
      'Fascism sits on the right side economically (government-directed private enterprise, anti-union), whereas communism sits on the far left (public ownership).',
  },
  {
    id: 'q-f2',
    track: 'fascism',
    sourceQuote:
      '"People and nations achieve power and advantage over others simply because they are stronger and fitter—nature itself creates inequality."',
    sourceAttribution: 'Summary of Social Darwinist Viewpoint',
    question: 'How did Nazi fascists apply this idea in Germany?',
    options: [
      'To argue that all citizens deserve equal voting rights and social welfare.',
      'To justify racial superiority, eugenics, discrimination, and war against groups labeled "inferior".',
      'To encourage workers to form international unions across Europe.',
      'To support free-market competition with zero government interference.',
    ],
    correctIndex: 1,
    explanation:
      'Fascists adopted Social Darwinism ("survival of the fittest") and eugenics to claim "Aryan" Germans were superior and could dominate or eliminate others.',
  },
  {
    id: 'q-f3',
    track: 'fascism',
    question: 'Which term of the 1919 Treaty of Versailles caused intense economic and national anger in Germany?',
    options: [
      'Forcing Germany to join the Soviet Union.',
      'Placing sole War Guilt on Germany, cutting its military and territory, and demanding $33 billion in reparations.',
      'Requiring Germany to abolish its currency and adopt the Russian ruble.',
      'Giving Alsace-Lorraine to Italy instead of France.',
    ],
    correctIndex: 1,
    explanation:
      '414 of the treaty’s 440 clauses punished Germany—hurting national pride and triggering debt that contributed to 1923 hyperinflation.',
  },
  {
    id: 'q-f4',
    track: 'fascism',
    question:
      'Why did support for extreme parties like the Nazi Party jump sharply after 1929?',
    options: [
      'The Great Depression ended American loans and pushed German unemployment past 5 million, making the Weimar democracy look helpless.',
      'Germany experienced a massive economic boom and citizens wanted to reward the Weimar coalition.',
      'The Treaty of Versailles was cancelled in 1929 and Germany regained all colonies.',
      'Hitler had already abolished all elections before the Depression began.',
    ],
    correctIndex: 0,
    explanation:
      'Coming after 1923 hyperinflation wiped out savings, the 1930s Depression devastated everyday Germans, making them desperate for strong, extreme solutions.',
  },
  {
    id: 'q-f5',
    track: 'fascism',
    question: 'What did the Enabling Act of 1933 accomplish for Adolf Hitler?',
    options: [
      'It freed political prisoners held by the Weimar government.',
      'It wiped out political opposition and individual rights, turning Germany from a democracy into a dictatorship.',
      'It created a permanent coalition between the Nazi Party and the Communist Party.',
      'It allowed German voters to recall the Chancellor every six months.',
    ],
    correctIndex: 1,
    explanation:
      'Passed shortly after the Reichstag Fire and snap election, the Enabling Act let Hitler rule by decree without parliament or opposition.',
  },
  {
    id: 'q-f6',
    track: 'fascism',
    question: 'What was the main purpose of the Nuremberg Laws passed in 1935?',
    options: [
      'To guarantee equal religious freedom for all minorities in Germany.',
      'To legally define who was Jewish, strip Jewish Germans of citizenship, and ban marriage with "Aryan" Germans.',
      'To limit the power of the SS and SA stormtroopers.',
      'To divide Germany into collective farming zones.',
    ],
    correctIndex: 1,
    explanation:
      'The Nuremberg Laws institutionalized Nazi racial hierarchy—defining Jewish ancestry by bloodlines and removing basic legal rights.',
  },
  {
    id: 'q-f7',
    track: 'fascism',
    question: 'What happened during Kristallnacht ("Night of the Broken Glass") on November 9–10, 1938?',
    options: [
      'The German parliament building caught fire before the 1933 election.',
      'Nazis and supporters vandalized and burned Jewish shops, homes, and synagogues, killing 91 and sending ~30,000 Jews to concentration camps.',
      'The Weimar Republic officially signed the Treaty of Versailles.',
      'Hitler wrote Mein Kampf while serving a prison sentence.',
    ],
    correctIndex: 1,
    explanation:
      'Sparked by the shooting of a Nazi official in Paris, Kristallnacht was a nationwide wave of state-backed antisemitic violence and mass arrests.',
  },
  {
    id: 'q-f8',
    track: 'fascism',
    question:
      'Besides over six million Jewish people, who else was persecuted and murdered in the Holocaust?',
    options: [
      'Only foreign soldiers captured on the battlefield.',
      'Millions of others including Polish people, Roma, people with disabilities, Soviet POWs, Jehovah’s Witnesses, homosexuals, and political opponents.',
      'Only members of the Weimar cabinet who signed the Treaty of Versailles.',
      'Wealthy German industrialists who supported the Nazi economy.',
    ],
    correctIndex: 1,
    explanation:
      'Over 14 million people are believed to have been killed in the Holocaust as the Nazis targeted every group excluded from their vision of society.',
  },

  // Track 3: Dictatorship Techniques & Spectrum (8 questions)
  {
    id: 'q-t1',
    track: 'techniques',
    question: 'What is the key difference between a totalitarian government and a general authoritarian government?',
    options: [
      'Authoritarian governments allow free multi-party elections, whereas totalitarian governments do not.',
      'Totalitarianism goes further by using state power to control EVERY aspect of citizens’ public and private lives and impose one official ideology.',
      'Authoritarianism only exists on the far left, while totalitarianism only exists on the far right.',
      'Totalitarian governments never use police or military force.',
    ],
    correctIndex: 1,
    explanation:
      'Authoritarian systems concentrate power in one person or small group (like an absolute monarchy or junta), while totalitarian regimes control schools, media, beliefs, and daily life completely.',
  },
  {
    id: 'q-t2',
    track: 'techniques',
    question: 'Why is Stalin’s USSR classified as "radical" while Nazi Germany is classified as "reactionary"?',
    options: [
      'Radical regimes reject past traditions to build a far-left classless future; reactionary regimes look back to an idealized past and accept hierarchy.',
      'Radical regimes protect private property, while reactionary regimes abolish all money.',
      'Radical regimes hold fair elections, while reactionary regimes use secret police.',
      'Both words mean the exact same thing on the political spectrum.',
    ],
    correctIndex: 0,
    explanation:
      'On the political spectrum, "radical" sits far left (total rejection of past traditions for future equality) and "reactionary" sits far right (idealizing the past and natural inequality).',
  },
  {
    id: 'q-t3',
    track: 'techniques',
    question:
      'On a two-axis Political-Economic Grid (Political Freedom vs. Control; Economic Collectivism vs. Individualism), where are Communism and Fascism located?',
    options: [
      'Both sit in the top half (Maximum Political Freedom).',
      'Both sit in the bottom half (Maximum Political Control), with Communism on the economic left and Fascism on the economic right.',
      'Communism sits at the top right, and Fascism sits at the bottom left.',
      'Both sit in the exact center next to Canada and Sweden.',
    ],
    correctIndex: 1,
    explanation:
      'Both Communism and Fascism are totalitarian (high political control), but Communism enforces economic collectivism (left) while Fascism keeps state-directed private enterprise (right).',
  },
  {
    id: 'q-t4',
    track: 'techniques',
    question:
      'Which dictatorship technique is being used when a government blocks social media, underreports war casualties, and bans negative news about the leader?',
    options: ['Scapegoating', 'Censorship', 'Controlled Participation', 'Eugenics'],
    correctIndex: 1,
    explanation:
      'Censorship is the manipulation and exclusion of information across newspapers, TV, books, and online platforms to protect the state.',
  },
  {
    id: 'q-t5',
    track: 'techniques',
    question:
      'An editorial cartoon shows a dictator standing behind a journalist, steering the journalist’s pen with a steering wheel. Which concept does this best illustrate?',
    options: [
      'Multi-party democracy',
      'Laissez-faire capitalism',
      'State censorship and control of the press',
      'Collective farming',
    ],
    correctIndex: 2,
    explanation:
      'When the state directs exactly what writers and journalists are allowed to publish, it destroys freedom of the press through censorship.',
  },
  {
    id: 'q-t6',
    track: 'techniques',
    question:
      'In a dictatorship, what is a "dissident" and how does the regime typically respond to them?',
    options: [
      'A loyal party official rewarded with high office.',
      'Someone who speaks out against government policies; they are often imprisoned, exiled, or silenced.',
      'A foreign investor building factories in the country.',
      'An election official who counts ballots fairly.',
    ],
    correctIndex: 1,
    explanation:
      'Dissidents challenge the regime’s ideology or policies. Dictatorships stop dissent through arrests, exile, or prison camps (like Gulags).',
  },
  {
    id: 'q-t7',
    track: 'techniques',
    question:
      'How do Absolute Monarchies, Oligarchies, and Military Juntas all reject the liberal principle of "the will of the people" (S.O. 3.3)?',
    options: [
      'They hold frequent referendums on every major law.',
      'Power is held by one unelected ruler, a small elite, or military leaders rather than representatives chosen freely by citizens.',
      'They allow any political party to win a majority in parliament.',
      'They guarantee full freedom of speech and protest.',
    ],
    correctIndex: 1,
    explanation:
      'All three are authoritarian systems where decisions come from an unaccountable individual or small group rather than democratic voters.',
  },
  {
    id: 'q-t8',
    track: 'techniques',
    question:
      'In both the USSR and Nazi Germany, why did regimes heavily invest in youth movements (such as Hitler Youth) and rewritten school textbooks?',
    options: [
      'To teach students how to debate multiple political viewpoints freely.',
      'To indoctrinate young citizens into the regime’s ideology and ensure the dictatorship lasts for future generations.',
      'To prepare teenagers to emigrate to democratic countries.',
      'To replace factory workers with elementary students permanently.',
    ],
    correctIndex: 1,
    explanation:
      'Indoctrination through curriculum shapes young people’s beliefs early, securing long-term loyalty to the leader and state.',
  },
];

export const SORTER_ITEMS: SorterItem[] = [
  {
    id: 'sort-1',
    statement: 'Abolishes private property so farms and factories are publicly owned',
    correctBucket: 'communism',
    explanation:
      'Communism sits on the far left economically, replacing private property with collective/state ownership.',
  },
  {
    id: 'sort-2',
    statement: 'Allows private businesses to operate if they serve state goals, while banning labor unions',
    correctBucket: 'fascism',
    explanation:
      'Fascism sits on the economic right—keeping private enterprise under government direction and crushing workers’ unions.',
  },
  {
    id: 'sort-3',
    statement: 'Uses secret police, prison/concentration camps, and terror to crush opposition',
    correctBucket: 'both',
    explanation:
      'Both Stalin’s USSR (NKVD & Gulags) and Hitler’s Germany (SS/Gestapo & camps) relied on terror to stay in power.',
  },
  {
    id: 'sort-4',
    statement: 'Strives for a classless society and total social and economic equality (egalitarianism)',
    correctBucket: 'communism',
    explanation:
      'Communist theory aims to erase class divisions and equalize incomes, looking toward an idealized future utopia.',
  },
  {
    id: 'sort-5',
    statement: 'Promotes racial superiority, Social Darwinism, and "natural" human inequality',
    correctBucket: 'fascism',
    explanation:
      'Fascism rejects equality completely, teaching that a superior nation or "master race" should dominate others.',
  },
  {
    id: 'sort-6',
    statement: 'Rejects multi-party democracy, free press, and individual civil liberties',
    correctBucket: 'both',
    explanation:
      'Both Communism in the USSR and Fascism in Nazi Germany were totalitarian rejections of liberal democracy.',
  },
  {
    id: 'sort-7',
    statement: 'Is "reactionary" — drawing inspiration from an idealized, glorious national past',
    correctBucket: 'fascism',
    explanation:
      'Fascism is reactionary (far right), wanting to restore past national strength and hierarchy.',
  },
  {
    id: 'sort-8',
    statement: 'Is "radical" — rejecting past traditions to build an international workers’ future',
    correctBucket: 'communism',
    explanation:
      'Communism is radical (far left), tearing down traditional property and class systems to build something new.',
  },
  {
    id: 'sort-9',
    statement: 'Builds a "cult of the leader" with special titles and unquestioning obedience',
    correctBucket: 'both',
    explanation:
      'Both regimes glorified a supreme leader: Stalin ("Man of Steel"), Hitler ("Führer"), and Mussolini ("Il Duce").',
  },
  {
    id: 'sort-10',
    statement: 'Uses school curriculum, youth groups, and state propaganda to indoctrinate citizens',
    correctBucket: 'both',
    explanation:
      'Totalitarian states on both extremes control education and media to ensure lifelong ideological loyalty.',
  },
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'tl-1',
    year: 'Jan 1905',
    title: 'Bloody Sunday in St. Petersburg',
    summary:
      'Czarist soldiers shoot unarmed workers marching to the Winter Palace, sparking Russia’s 1905 Revolution.',
    regime: 'Soviet Union',
    orderIndex: 0,
  },
  {
    id: 'tl-2',
    year: 'Oct 1917',
    title: 'Bolshevik Revolution ("Peace! Land! Bread!")',
    summary:
      'Lenin and Trotsky overthrow Kerensky’s weak Provisional Government to create a communist state.',
    regime: 'Soviet Union',
    orderIndex: 1,
  },
  {
    id: 'tl-3',
    year: '1919',
    title: 'Treaty of Versailles Signed',
    summary:
      'Germany’s Weimar Republic is forced to accept War Guilt, military limits, lost territory, and $33B in reparations.',
    regime: 'Germany',
    orderIndex: 2,
  },
  {
    id: 'tl-4',
    year: '1921',
    title: 'Lenin Launches the New Economic Policy (NEP)',
    summary:
      'After War Communism fails and causes famine, Lenin allows small private businesses and restarts money.',
    regime: 'Soviet Union',
    orderIndex: 3,
  },
  {
    id: 'tl-5',
    year: '1923',
    title: 'German Hyperinflation Crisis',
    summary:
      'Germany stops reparations and prints excessive currency, wiping out citizens’ life savings.',
    regime: 'Germany',
    orderIndex: 4,
  },
  {
    id: 'tl-6',
    year: '1929–1933',
    title: 'Stalin’s Collectivization & The Holodomor',
    summary:
      'Private farms are forced into kolkhozy, kulaks are crushed, and 7–10 million starve in Ukraine.',
    regime: 'Soviet Union',
    orderIndex: 5,
  },
  {
    id: 'tl-7',
    year: 'Feb–Mar 1933',
    title: 'Reichstag Fire & Enabling Act',
    summary:
      'Hitler blames Communists for the parliament fire and passes the Enabling Act to make Germany a dictatorship.',
    regime: 'Germany',
    orderIndex: 6,
  },
  {
    id: 'tl-8',
    year: '1935 & 1938',
    title: 'Nuremberg Laws & Kristallnacht',
    summary:
      'Nazi racial laws strip Jewish citizenship (1935), followed by violent attacks across Germany (1938).',
    regime: 'Germany',
    orderIndex: 7,
  },
];

export const PRIMARY_SOURCES: PrimarySourceItem[] = [
  {
    id: 'ps-1',
    title: 'Editorial Cartoon: Controlling the Message',
    category: 'Dictatorship Techniques',
    sourceType: 'Visual Political Cartoon',
    slideRef: 'Slides 108–119',
    imagePath: '/src/assets/images/source_propaganda_control_1795096450719.jpg',
    imageAlt:
      'Political cartoon showing an authoritarian leader pulling strings connected to a printing press, radio microphone, and history textbooks',
    attribution: 'Theme 6 Study Visual · Adapted from Slides 108–119',
    contextNote:
      'Totalitarian leaders in both the USSR and Nazi Germany tightly controlled newspapers, radio broadcasts, and school curricula.',
    clues: [
      'Notice the puppet strings extending from the dictator’s hands to multiple tools of communication.',
      'Identify the three targets being controlled: a printing press (newspapers), a radio microphone (broadcasts), and History/Government books (schools).',
      'Ask which liberal freedoms—such as freedom of the press and freedom of thought—are removed when one leader controls all three.',
    ],
    question:
      'Which combination of dictatorship techniques is most directly illustrated by the strings connected to the press, radio, and history books?',
    options: [
      'Free-market capitalism and multi-party elections',
      'Collectivization of agriculture and subsistence farming',
      'Censorship of the media and indoctrination through education',
      'Peaceful democratic reform and civil liberties',
    ],
    correctIndex: 2,
    modelAnalysis:
      'A 30-2 response connects the visual details directly to the concepts: pulling strings on newspapers and radio shows censorship/propaganda (blocking opposing views), while pulling strings on History and Government books shows indoctrination through curriculum.',
    writtenPrompt:
      'In 2–3 sentences, explain what this cartoon reveals about how totalitarian dictatorships reject the liberal value of individual freedom of expression.',
    sampleWrittenResponse:
      'This cartoon illustrates that totalitarian dictatorships maintain control through censorship and indoctrination. By pulling the strings on the press, radio, and school textbooks, the leader prevents citizens from hearing opposing perspectives and shapes young minds to obey state ideology, directly rejecting liberal freedoms of speech and press.',
    keyTerms: ['censorship', 'indoctrination', 'propaganda', 'freedom of expression'],
  },
  {
    id: 'ps-2',
    title: 'Nazi School Math Textbook: Institutional Costs (1930s)',
    category: 'Fascism & Nazism',
    sourceType: 'Historical Textbook Excerpt',
    slideRef: 'Slides 112–115',
    excerpt:
      '"Various calculations place the cost to the state of a mentally ill patient at 1,500 Reich Marks per year... Careful estimates place the number of mentally ill patients in German institutions at 300,000 persons. What is the total yearly cost of this? How many new Marriage Grant loans at 1,000 marks each could this sum provide?"',
    attribution: 'Actual Nazi School Math Problem · Theme 6 Slides 112–115',
    contextNote:
      'Under Nazi rule, even math textbooks were rewritten to promote eugenics and militarism to elementary and high school students.',
    clues: [
      'Look at who is being compared in the math problem: "mentally ill patients" versus "new Marriage Grant loans" for healthy German families.',
      'Notice how human beings with illnesses or disabilities are framed purely as a financial "cost to the state."',
      'Connect this framing to Social Darwinism and eugenics—promoting reproduction of "desirable" traits while targeting vulnerable groups.',
    ],
    question:
      'Why did the Nazi government put problems like this inside ordinary high school math textbooks?',
    options: [
      'To indoctrinate young people into viewing people with disabilities as a burden, normalizing eugenics.',
      'To teach students fair tax policy in a liberal democracy.',
      'To encourage students to donate money to hospital charities.',
      'To prepare students for careers in international banking.',
    ],
    correctIndex: 0,
    modelAnalysis:
      'By disguising ideology inside routine math calculations, the regime normalized Social Darwinism and eugenics—training youth to value "useful" citizens and accept state persecution of vulnerable groups.',
    writtenPrompt:
      'Explain how this textbook problem demonstrates BOTH indoctrination through curriculum and the fascist rejection of human equality.',
    sampleWrittenResponse:
      'This problem uses everyday school math to indoctrinate students into Nazi eugenics. By contrasting the cost of caring for institutionalized patients with marriage loans for favored families, it teaches youth that some people are less worthy than others, rejecting the liberal principle of equal individual rights.',
    keyTerms: ['indoctrination', 'eugenics', 'Social Darwinism', 'human inequality'],
  },
  {
    id: 'ps-3',
    title: 'Animal Farm Critique of Soviet Equality',
    category: 'Soviet Communism',
    sourceType: 'Literary Satire',
    slideRef: 'Slides 3–4',
    excerpt:
      '"Animal Farm criticizes Soviet communism and the idea of a utopian society in which it is claimed that all people are equal—yet power struggles, rigid class systems, and dictatorship quickly take over."',
    attribution: 'Theme 6 Lesson Summary · Slides 3–4',
    contextNote:
      'George Orwell wrote Animal Farm as an allegory of the 1917 Russian Revolution and Stalin’s rise to absolute power.',
    clues: [
      'Compare what communist theory promises ("utopian society" where "all people are equal") with what actually happens ("rigid class systems, and dictatorship").',
      'Recall the real-world Soviet power struggle between Leon Trotsky and Joseph Stalin after Lenin died in 1924.',
      'Remember Marx predicted government would eventually disappear, whereas Soviet leaders built an all-powerful state.',
    ],
    question:
      'Which major theme of Theme 6 does this source highlight about 20th-century communism?',
    options: [
      'Soviet leaders immediately abolished all government as Karl Marx predicted.',
      'The Russian Revolution restored private ownership to wealthy landowners.',
      'Animal Farm supported Stalin’s Five-Year Plans and collectivization.',
      'Although communism promised a classless utopia, Soviet practice created a new ruling elite and dictatorship.',
    ],
    correctIndex: 3,
    modelAnalysis:
      'This highlights the key 30-2 contrast between theory and practice: Communist theory promised equality and no hierarchy, while Stalinism produced a rigid party pyramid and totalitarian control.',
    writtenPrompt:
      'Describe the gap between communist theory and Soviet practice using Orwell’s critique in Animal Farm.',
    sampleWrittenResponse:
      'In theory, communism promised a classless society with equality and cooperation for workers. However, as Orwell’s Animal Farm illustrates, Soviet practice under Stalin replaced the czar’s rule with a rigid party hierarchy, violent purges, and a totalitarian dictatorship where an elite few held all power.',
    keyTerms: ['utopian', 'classless society', 'Stalinism', 'dictatorship'],
  },
  {
    id: 'ps-4',
    title: '1917 Revolutionary Appeal: "Peace! Land! Bread!"',
    category: 'Soviet Communism',
    sourceType: 'Political Slogan',
    slideRef: 'Slides 19–20',
    excerpt: '"Peace! Land! Bread!"',
    attribution: 'Vladimir Lenin & the Bolshevik Party, 1917 · Slide 20',
    contextNote:
      'Spoken during World War I while millions of Russian soldiers were dying at the front and peasants faced food shortages.',
    clues: [
      'Break down each word for a different struggling group in 1917 Russia: Peace (exhausted WWI soldiers), Land (poor rural peasants), Bread (hungry urban workers).',
      'Recall why Alexander Kerensky’s temporary liberal democratic government lost public trust in 1917.',
      'Notice how extreme crises make radical slogans more appealing than slow democratic compromise.',
    ],
    question:
      'What does the popularity of this three-word slogan tell us about why liberal democracy failed in Russia in 1917?',
    options: [
      'Russians wanted Kerensky’s democratic government to continue fighting WWI indefinitely.',
      'Ordinary people valued immediate survival needs—ending war, gaining farmland, and eating—more than a weak democratic government that ignored them.',
      'Russian peasants preferred laissez-faire capitalism over land redistribution.',
      'Czar Nicholas II used this slogan to win re-election.',
    ],
    correctIndex: 1,
    modelAnalysis:
      'When a democratic government (Kerensky’s Provisional Government) fails to meet citizens’ urgent basic needs, people become willing to support radical, anti-liberal movements that promise quick relief.',
    writtenPrompt:
      'How does Lenin’s slogan help explain why many Russians rejected Kerensky’s liberal democratic government in 1917?',
    sampleWrittenResponse:
      'Kerensky’s Provisional Government refused to exit World War I or redistribute farmland to peasants, losing popular support. Lenin’s slogan "Peace! Land! Bread!" spoke directly to soldiers, peasants, and starving workers, showing how citizens in severe crisis often turn to radical ideologies that promise immediate survival relief.',
    keyTerms: ['Bolsheviks', 'Provisional Government', 'Kerensky', 'radical'],
  },
  {
    id: 'ps-5',
    title: 'Treaty of Versailles Punishment Terms (1919)',
    category: 'Fascism & Nazism',
    sourceType: 'Historical Document Chart',
    slideRef: 'Slides 63–64',
    visualChart: 'versailles-table',
    excerpt:
      '"The Treaty of Versailles was very harsh on Germany—414 of its 440 clauses were aimed at punishing Germany for \'all the loss and damage\' of the war."',
    attribution: 'Treaty Summary Chart · Theme 6 Slide 64',
    contextNote:
      'Germany’s new liberal democratic Weimar Republic was forced to sign the treaty in 1919, triggering hyperinflation, national humiliation, and political instability.',
    clues: [
      'Look at all three columns of the treaty: Territorial Losses, Military Restrictions, and War Guilt ($33 billion in reparations).',
      'Check the clause ratio: 414 out of 440 clauses existed specifically to punish Germany.',
      'Remember WHICH government signed it—the new liberal democratic Weimar Republic—and who Hitler later blamed for Germany’s humiliation.',
    ],
    question:
      'How did the terms shown in this Treaty of Versailles chart help undermine liberal democracy in Germany during the 1920s and early 1930s?',
    options: [
      'The treaty strengthened German military pride and made the Weimar Republic widely popular.',
      'The Allies immediately forgave the $33 billion debt so Germany avoided hyperinflation.',
      'Extreme reparations, lost land, and forced War Guilt caused economic crisis and humiliation that Germans blamed on the democratic Weimar government.',
      'The treaty required Germany to adopt Soviet-style collectivization.',
    ],
    correctIndex: 2,
    modelAnalysis:
      'Because the Weimar Republic accepted these punishing terms, many Germans associated liberal democracy with defeat, lost territory, and economic collapse (such as the 1923 hyperinflation), making them open to Hitler’s reactionary nationalism.',
    writtenPrompt:
      'Using details from the three Versailles categories, explain how the treaty created conditions for fascism to rise in Germany.',
    sampleWrittenResponse:
      'With 414 of 440 clauses punishing Germany—stripping colonies and Alsace-Lorraine, disarming its military, and imposing sole War Guilt plus $33 billion in reparations—the Treaty of Versailles triggered severe economic crisis and resentment. Because the democratic Weimar Republic signed it, many Germans lost faith in liberalism and turned to Hitler’s promise to restore national strength.',
    keyTerms: ['Weimar Republic', 'War Guilt', 'reparations', 'reactionary'],
  },
  {
    id: 'ps-6',
    title: 'Nazi Physics Textbook: Bomb Trajectory Problem',
    category: 'Fascism & Nazism',
    sourceType: 'Historical Textbook Excerpt',
    slideRef: 'Slide 113',
    visualChart: 'bomb-trajectory',
    excerpt:
      '"The descent of a bomb dropped from a plane flying level at the speed of 100 m per second can be approximated using an X = equation that takes wind resistance into consideration... Draw the trajectory from a plane flying at an altitude of 1,000 m. How long will it take for the bomb to reach the ground? ... At what angle is the bomb traveling when it strikes the ground? What is its force if it has a weight of 1 kg?"',
    attribution: 'Actual Nazi School Physics Problem · Theme 6 Slide 113',
    contextNote:
      'Core fascist values emphasize war, military force, discipline, and national expansion; Nazi schools wove military scenarios directly into science and math lessons.',
    clues: [
      'Ask why a standard gravity/projectile physics question uses a military bomber dropping a 1 kg bomb instead of a ball or stone.',
      'Notice that the Treaty of Versailles had forbidden Germany from having an air force—yet Nazi classrooms trained youth to calculate air-bombing physics.',
      'Connect the military scenario to two Theme 6 concepts: indoctrination through curriculum and the fascist glorification of war and military force.',
    ],
    question:
      'What does this physics problem reveal about the relationship between Nazi education and core fascist values?',
    options: [
      'Curriculum was used to normalize warfare and military force among youth so students saw war as an everyday duty.',
      'Nazi schools banned applied science and focused only on pacifist philosophy.',
      'The Weimar Republic required all students to train as commercial airline pilots.',
      'Fascists valued individual critical thinking over obedience to the state.',
    ],
    correctIndex: 0,
    modelAnalysis:
      'Embedding bombing trajectories into routine physics calculations served both indoctrination (shaping youth around state goals) and fascist militarism (treating war, discipline, and military strength as the highest national ideals).',
    writtenPrompt:
      'Explain how turning projectile motion into a bombing problem reflects both dictatorship techniques and core fascist beliefs.',
    sampleWrittenResponse:
      'By replacing ordinary examples with a military bomber dropping a 1 kg bomb from 1,000 metres, the Nazi regime used curriculum indoctrination to normalize warfare in students’ daily learning. This directly reinforced core fascist values of militarism, discipline, and preparing the nation for territorial expansion.',
    keyTerms: ['indoctrination', 'militarism', 'curriculum', 'fascism'],
  },
  {
    id: 'ps-7',
    title: 'Nazi Math Textbook: European Population & Racial Growth',
    category: 'Fascism & Nazism',
    sourceType: 'Historical Textbook Excerpt',
    slideRef: 'Slide 114',
    visualChart: 'population-growth',
    excerpt:
      '"Among the three most important of racial groups in Europe, the following population growth was detected in the time between 1900 and 1930. Teutonic people: 124 million to 149 million; Latin people: 103 million to 121 million; Slavic people: 166 million to 226 million... What great danger do you perceive for the future of the German people if no basic change in this reality occurs? Fortunately there is justifiable hope that a reversal of these population growth rates is at hand."',
    attribution: 'Actual Nazi School Math Problem · Theme 6 Slide 114',
    contextNote:
      'Fascist ideology viewed human groups through Social Darwinism—a "survival of the fittest" struggle between nations and races for dominance.',
    clues: [
      'Compare the growth percentages in the chart: Slavic population grew +36.1% while Teutonic grew +20.2%.',
      'Read the loaded question at the end: "What great danger do you perceive for the future of the German people?"—math normally asks for a number, not fear of a "danger."',
      'Think about how "a reversal of these population growth rates" hints at Nazi policies of racial superiority, expansion, and persecution of Slavic and other non-Aryan peoples.',
    ],
    question:
      'How does the final question of this math problem reflect Social Darwinism and Nazi racial ideology?',
    options: [
      'It encourages peaceful multicultural cooperation among European nations.',
      'It argues that all European groups deserve equal constitutional rights.',
      'It teaches economic central planning based on Karl Marx’s Communist Manifesto.',
      'It frames population differences as a racial threat, teaching students that Germany is in a "survival of the fittest" struggle requiring reversal.',
    ],
    correctIndex: 3,
    modelAnalysis:
      'Instead of neutral statistics, the problem prompts students to see Slavic population growth as a "great danger" to Germany—turning Social Darwinism ("struggle for survival" between races) into a classroom conclusion.',
    writtenPrompt:
      'Identify the ideological message hidden inside this percentage-growth math problem and connect it to Nazi racial policies.',
    sampleWrittenResponse:
      'Although the problem begins with population numbers from 1900 to 1930, its final question pushes students to view higher Slavic growth as a "danger" to Germans. This reflects Social Darwinism and Nazi racial superiority, conditioning youth to accept aggressive expansion and persecution of groups labeled "inferior."',
    keyTerms: ['Social Darwinism', 'racial superiority', 'indoctrination', 'survival of the fittest'],
  },
  {
    id: 'ps-8',
    title: 'Totalitarian Hierarchy & Cult of the Leader',
    category: 'Dictatorship Techniques',
    sourceType: 'Power Structure Diagram',
    slideRef: 'Slides 100–101',
    visualChart: 'hierarchy-pyramid',
    excerpt:
      '"Obedience to and support for the party was non-negotiable. Many of these leaders gave themselves special names—Stalin (\'man of steel\'), Mussolini (\'Il Duce\' / the leader), and Hitler (\'Führer\' / leader or guide)."',
    attribution: 'Theme 6 Power Pyramid & Leader Titles · Slides 100–101',
    contextNote:
      'Even though communism (far left) and fascism (far right) held opposite economic goals, both relied on single-party totalitarian pyramids topped by an unquestioned leader.',
    clues: [
      'Trace where power flows in the pyramid: from one charismatic leader at the peak down through national and local party loyalists to the masses at the bottom.',
      'Examine the adopted titles: "Man of Steel," "Il Duce," and "Führer"—none sound like an ordinary elected public servant.',
      'Note Slide 101’s rule: "Obedience to and support for the party was non-negotiable." That eliminates democratic opposition and rule of law.',
    ],
    question:
      'What key similarity between Soviet communism and Nazi fascism does this diagram demonstrate?',
    options: [
      'Both systems rotated leadership every four years through free multi-party elections.',
      'Both eliminated all government institutions so workers could govern without hierarchy.',
      'Both concentrated absolute authority in a single glorified leader atop a strict one-party hierarchy demanding total obedience.',
      'Both placed constitutional limits on the dictator using an independent court system.',
    ],
    correctIndex: 2,
    modelAnalysis:
      'Despite opposing positions on the economic spectrum (collectivism vs. private enterprise serving the state), both regimes sit at the bottom of the political axis—using charismatic leader worship (cult of the leader) and a rigid party pyramid to enforce obedience.',
    writtenPrompt:
      'Compare how this hierarchical pyramid functions under totalitarianism versus how power is supposed to work in a liberal democracy.',
    sampleWrittenResponse:
      'In a liberal democracy, leaders are accountable to voters, limited by laws, and challenged by rival parties. By contrast, this totalitarian pyramid shows power flowing strictly from the top down—under a glorified leader like Stalin, Mussolini, or Hitler—where one party dominates and obedience from the masses is non-negotiable.',
    keyTerms: ['totalitarianism', 'charismatic leadership', 'hierarchy', 'accountability'],
  },
  {
    id: 'ps-9',
    title: 'Stalin’s Collectivization & The Holodomor (1932–1933)',
    category: 'Soviet Communism',
    sourceType: 'Policy Case Study',
    slideRef: 'Slides 38–42',
    visualChart: 'holodomor-cycle',
    excerpt:
      '"Stalin suppressed opposition to his leadership, required large grain quotas to be filled, and then withheld stockpiled grain from many, effectively starving between 7 and 10 million people in order to remove resistance to his plans for collectivization."',
    attribution: 'Theme 6 Holodomor Evidence · Slides 41–42',
    contextNote:
      'Prosperous peasant farmers (kulaks) resisted losing their private land to state-controlled collective farms (kolkhozy); Stalin used forced grain seizures to crush resistance and Ukrainian nationalism.',
    clues: [
      'Follow the three-step policy chain: forced collectivization of farms → impossible state grain quotas → stockpiled grain withheld during severe hunger.',
      'Notice the human toll (7–10 million deaths) and the political motive: crushing kulak resistance and suppressing Ukrainian nationalism.',
      'Compare this with the core communist promise of "egalitarianism" and treating all nationalities equally.',
    ],
    question:
      'Which combination of totalitarian methods and economic policies is shown in Stalin’s actions during the Holodomor?',
    options: [
      'Forced economic collectivization paired with state terror and elimination of dissent to crush opposition',
      'Laissez-faire free markets and voluntary agricultural trade',
      'Lenin’s New Economic Policy allowing private farm sales for profit',
      'Democratic self-determination for Ukrainian farmers',
    ],
    correctIndex: 0,
    modelAnalysis:
      'Stalin abolished private farms through forced collectivization and used starvation, imprisonment in Gulags, and NKVD force to destroy opposition from kulaks and Ukrainian nationalists—proving absolute state control took priority over human rights or equality.',
    writtenPrompt:
      'Explain how the Holodomor illustrates Stalin’s rejection of both individual rights and Marxist promises of national equality.',
    sampleWrittenResponse:
      'During the Holodomor, Stalin prioritized forced collectivization and rapid industrialization over human life. By seizing crops for unrealistic grain quotas and withholding stockpiled food—starving 7 to 10 million people—he used terror to crush kulak dissent and Ukrainian nationalism, rejecting basic rights to life and property.',
    keyTerms: ['collectivization', 'kulaks', 'Holodomor', 'kolkhozy', 'dissent'],
  },
  {
    id: 'ps-10',
    title: 'One-Sided Elections & Controlled Participation',
    category: 'Dictatorship Techniques',
    sourceType: 'Election Data Visual',
    slideRef: 'Slides 123–124',
    visualChart: 'election-bars',
    excerpt:
      '"Dictatorships often hold fraudulent elections to try to legitimize themselves. These elections are presented as 90%+ landslides by the Dictator. In the most recent North Korean election Kim Jong Un received 100% of the vote."',
    attribution: 'Theme 6 Dictatorship Techniques · Slides 123–124',
    contextNote:
      'Alberta 30-2 Outcome S.O. 3.3 asks how well governments reflect the will of the people. Authoritarian regimes stage rallies and single-choice ballots to create an illusion of public consent.',
    clues: [
      'Compare the two bars in the visual: in a real multi-party democracy, winning parties rarely exceed ~40–55% because voters have genuine rival choices.',
      'When an election reports 90%–100% support for one leader, ask what happened to opposition parties and secret-ballot freedom.',
      'Remember the two Theme 6 terms from Slides 123–124: "controlled participation" (illusion of free involvement) and "one-sided elections."',
    ],
    question:
      'Why do dictatorships hold one-sided elections reporting 90% to 100% support even when voters have no real choice?',
    options: [
      'To ensure opposition parties can peacefully take power next term.',
      'To follow liberal rules about separation of powers and independent courts.',
      'To allow citizens to vote freely against the ruling party without fear.',
      'To manufacture an illusion of legitimacy and popular consent while denying genuine democratic choice.',
    ],
    correctIndex: 3,
    modelAnalysis:
      'Holding a ballot where opposition is banned or intimidated is "controlled participation"—it lets a dictator claim to represent the will of the people (S.O. 3.3) without ever risking defeat or respecting individual political freedoms.',
    writtenPrompt:
      'Connected to S.O. 3.3 ("will of the people"), explain why a 100% election victory is evidence of dictatorship rather than democracy.',
    sampleWrittenResponse:
      'True democracy requires competing political parties, free media, and the safe right to disagree, so genuine election results are divided among candidates. A 90%–100% landslide in an authoritarian state is a one-sided election used for controlled participation—creating fake legitimacy while silencing the real will of the people.',
    keyTerms: ['controlled participation', 'one-sided elections', 'will of the people', 'legitimacy'],
  },
];

