import {Form, Question, QuestionConf, QuestionType, QuestionTypeWithChoices, ShowIfCondition} from '../../core/v1/Form'
import {EN_UK_Label, Utils} from '../../core/Utils'

export class Common {

  static readonly agencyReferredTo = (k: Form<EN_UK_Label>, label = {en: 'Agency referred to', uk: 'Агентство, на яке посилається'}) => {
    return k.questionWithChoicesAndSpecify('RADIO', label, [
      {label: {en: 'Alight', uk: 'Alight'}},
      {label: {en: 'CLEAR Global', uk: 'CLEAR Global'}},
      {label: {en: 'Helsinki Foundation for Human Rights', uk: 'Helsinki Foundation for Human Rights'}},
      {label: {en: 'ICRC', uk: 'ICRC'}},
      {label: {en: 'INTERSOS', uk: 'INTERSOS'}},
      {label: {en: 'IOM', uk: 'IOM'}},
      {label: {en: 'International Rescue Committee', uk: 'International Rescue Committee'}},
      {label: {en: 'Loop', uk: 'Loop'}},
      {label: {en: 'Médecins du Monde', uk: 'Médecins du Monde'}},
      {label: {en: 'MSF', uk: 'MSF'}},
      {label: {en: 'NRC', uk: 'NRC'}},
      {label: {en: 'Oxfam', uk: 'Oxfam'}},
      {label: {en: 'Plan International', uk: 'Plan International'}},
      {label: {en: 'Polish Red Cross', uk: 'Polish Red Cross'}},
      {label: {en: 'Red Pencil', uk: 'Red Pencil'}},
      {label: {en: 'Save the Children', uk: 'Save the Children'}},
      {label: {en: 'Terre Des Hommes', uk: 'Terre Des Hommes'}},
      {label: {en: 'The Polish Center for International Aid (PCPM)', uk: 'The Polish Center for International Aid (PCPM)'}},
      {label: {en: 'UNHCR', uk: 'UNHCR'}},
      {label: {en: 'UNICEF', uk: 'UNICEF'}},
      {label: {en: 'Other (specify)', uk: 'інша (уточніть)'}, specify: true}
    ])
  }

  static readonly levelOfRisk = (k: Form<{en: string, uk: string}>, label = {en: 'Level of risk', uk: 'Рівень ризику'}) => {
    return k.questionWithChoices('RADIO', label, [
      {en: 'Emergency', uk: 'Надзвичайна ситуація'},
      {en: 'Urgent', uk: 'терміновий'},
      {en: 'Normal', uk: 'Нормальний'},
    ])
  }

  static readonly serviceRequested = (k: Form<EN_UK_Label>, label = {en: 'Service requested', uk: 'Запит на послуги'}, conf?: QuestionConf<EN_UK_Label>) => {
    return k.questionWithChoicesAndSpecify('CHECKBOX', label, [
      {en: 'Psychosocial support and Mental Health', uk: 'Психосоціальна підтримка та психічне здоров\'я'},
      {en: 'Child protection services', uk: 'Служби захисту дітей'},
      {en: 'Family tracing / Reunification', uk: 'Розшук сім\'ї / Возз\'єднання'},
      {en: 'Protection - Specialized services', uk: 'Охорона - Спеціалізовані послуги'},
      {en: 'Material assistance / NFIs', uk: 'Матеріальна допомога / НФО'},
      {en: 'Legal aid', uk: 'Юридична допомога'},
      {en: 'Registration', uk: 'Реєстрація'},
      {en: 'Accommodation', uk: 'Проживання'},
      {en: 'Medical / Nutrition', uk: 'Медицина / Харчування'},
      {en: 'Cash assistance', uk: 'Грошова допомога'},
      {en: 'Food assistance', uk: 'Харчова допомога'},
      {en: 'Mobility support', uk: 'Підтримка мобільності'},
      {en: 'Education / Vocational training', uk: 'Освіта / Професійна підготовка'},
      {label: {en: 'Other (specify)', uk: 'інша (уточніть)'}, specify: true},
    ], conf)
  }

  static readonly staffCode = (k: Form<EN_UK_Label>, label = {en: 'Staff code', uk: 'код працівника'}, conf?: QuestionConf<EN_UK_Label>) => {
    return k.question('TEXT', label, {
      constraint: `regex(., '${Utils.regexp.staffCode}')`,
      constraintMessage: 'Invalid staff code'
    })
  }
  // static readonly staffCode = (k: Form<EN_UK_Label, label = 'Staff code', conf?: QuestionConf) => {
  //   return k.questionWithChoices('RADIO', label, [
  //     'OLHUSUPR22',
  //     'NASZPSPR22',
  //     'IRRAPSPR22',
  //     'JUPISOPR22',
  //     'ANZUPSPR22',
  //     'MABISOPR22',
  //     'DAIVSOPR22',
  //     'ANINPSPR22',
  //     'YUNASOPR22',
  //     'YUOHSOPR22',
  //     'OKOHSOPR22',
  //     'JABRHEPR22',
  //     'NAKOPSPR22',
  //     'ALSISOPR22',
  //     'OLLESOPR22',
  //   ], conf)
  // }

  static readonly today = (k: Form<EN_UK_Label>, label = {en: 'Date', uk: 'Дата'}, conf?: QuestionConf<EN_UK_Label>) => {
    return k.question('DATE', label, {
      default: 'today()',
      ...conf,
    })
  }
  static readonly contactDetails = (k: Form<EN_UK_Label>) => {
    return [
      k.phone({en: '📞 WhatsApp', uk: '📞 WhatsApp'}),
      k.phone({en: '📞 Polish phone number', uk: '📞 Польський номер телефону'}),
      k.email({en: '✉️ Email', uk: '✉️ Електронна пошта'}),
      k.question('TEXT', {en: '🏠 Current address', uk: '🏠 Поточна адреса'}),
    ]
  }

  static readonly status = (
    k: Form<EN_UK_Label>,
    type: QuestionTypeWithChoices = 'CHECKBOX',
    label = {en: 'Status', uk: 'Статус'},
    conf?: QuestionConf<EN_UK_Label>
  ) => k.questionWithChoices(type, label, [
    {en: 'Ukrainian refugee', uk: 'біженець з України'},
    {en: 'Third-country national', uk: 'Громадянин третьої країни'},
    {en: 'Ukrainian volunteer', uk: 'волонтер з України'},
    {en: 'International volunteer', uk: 'Міжнародний волонтер'},
    {en: 'Host community', uk: 'Приймаюча спільнота'},
  ], conf)

  // static readonly lstatus = (k: Form) => k.questionWithChoices('RADIO', 'Legal status', ['Refugee', 'Asylum seeker', 'Polish citizeen'])

  static readonly gender = (k: Form<EN_UK_Label>, label = {en: 'Gender', uk: 'Стать'}, conf?: QuestionConf<EN_UK_Label>) => k.questionWithChoices('RADIO', label, [
    {en: 'Female', uk: 'жіноча'},
    {en: 'Male', uk: 'чоловіча'},
    {en: 'Other', uk: 'Інший'},
  ], conf)

  static readonly age = (k: Form<EN_UK_Label>, label = {en: 'Age', uk: 'Вік'}, conf?: QuestionConf<EN_UK_Label>) => k.question('INTEGER', label, conf)

  static readonly ageRange = (k: Form<EN_UK_Label>, label = {en: 'Age', uk: 'Вік'}, conf?: QuestionConf<EN_UK_Label>) => k.questionWithChoices('RADIO', label, [
    {en: '0-4 years old', uk: ''},
    {en: '5-11 years old', uk: ''},
    {en: '12-17 years old', uk: ''},
    {en: '18-59 years old', uk: ''},
    {en: '60+ years old', uk: ''},
  ])

  static readonly nationalitiesAndSpecify = (k: Form<EN_UK_Label>,
    label = {en: 'Nationality', uk: 'Національність'},
    conf?: QuestionConf<EN_UK_Label>) => k.questionWithChoicesAndSpecify('CHECKBOX', label, [
    {label: {en: 'Ukrainian', uk: 'український'}},
    {label: {en: 'Not willing to disclose', uk: 'не бажає розголошувати'}},
    {label: {en: 'Other (specify)', uk: 'інша (уточніть)'}, specify: true},
    // FIXME(Alex) Should use name
  ], {default: 'Ukrainian', ...conf})

  static readonly polishBase = (k: Form<EN_UK_Label>, label = {en: 'Location', uk: 'Розташування'}, conf?: QuestionConf<EN_UK_Label>): Question<EN_UK_Label>[] => {
    const location = k.questionWithChoices('RADIO', label, [
      {en: 'Warsaw', uk: 'Варшава'},
      {en: 'Krakow', uk: 'Краків'},
      {en: 'Rzeszow', uk: 'Жешув'},
      {en: 'Lublin', uk: 'Люблін'},
      {en: 'Chelm', uk: 'Хелм'},
    ], conf)

    const buildQuestion = (ifLabel: string, options: EN_UK_Label[]): Question<EN_UK_Label> => {
      return k.questionWithChoices('RADIO', {en: 'Name of center', uk: 'Назва центру'}, options, {
        ...conf,
        showIf: [{
          question: location,
          value: ifLabel
        }],
      })
    }
    return [
      location,
      buildQuestion('Warsaw', [
        {en: 'Expo', uk: 'Expo',}, // OK
        {en: 'PESEL registration centre', uk: 'PESEL registration centre',},//OK
        {en: 'Warsaw 1', uk: 'Warsaw 1',},
        {en: 'Warsaw 2 – Warta Towers', uk: 'Warsaw 2 – Warta Towers',},
      ]),
      buildQuestion('Krakow', [
        {en: 'Tauron Arena', uk: 'Tauron Arena'},
        {en: 'Train station', uk: 'Train station'},
      ]),
      buildQuestion('Rzeszow', [
        {en: 'Korczowa', uk: 'Korczowa'},
        {en: 'Medyka', uk: 'Medyka'},
        {en: 'Tesco, Prezmysl', uk: 'Tesco, Prezmysl'},
        {en: 'Boratyn', uk: 'Boratyn'},
        {en: 'Radymno', uk: 'Radymno'},
        {en: 'House of Ukraine', uk: 'House of Ukraine'},
      ]),
      buildQuestion('Lublin', [
        {en: 'Dorohusk', uk: 'Dorohusk'},
        {en: 'Hrebenne', uk: 'Hrebenne'},
        {en: 'Lublin', uk: 'Lublin'},
      ]),
      buildQuestion('Chelm', [
        {en: 'Sports Centre/ Tesco Shop', uk: 'Sports Centre/ Tesco Shop'},
      ]),
    ]
  }

  static readonly specificNeedsHCR = (k: Form<EN_UK_Label>) => {
    const snIdentified = k.questionWithChoices('RADIO', {en: 'Specific needs identified within the family', uk: 'Ідентифіковані особливі потреби в родини'}, [
      {en: 'No specific needs (identified)', uk: 'Немає особливих потреб (виявлено)'},
      {en: 'Person with specific needs', uk: 'Людина з особливими потребами'},
    ])
    const snCategory = k.questionWithChoices('CHECKBOX', {en: 'Person with specific needs category', uk: 'Категорія особи з особливими потребами'}, [
      {en: 'Children and adolescent at risk', uk: 'діти та підлітки з групи ризику'},
      {en: 'Unaccompanied children', uk: 'Діти без супроводу'},
      {en: 'Separated children', uk: 'діти розлучені з батьками/опікунами'},
      {en: 'Persons with disabilities', uk: 'особи з інвалідністю'},
      {en: 'Persons with serious medical condition', uk: 'особи з серйозними медичними  потребами'},
      {en: 'Older persons at risk (60+ years old)', uk: 'Літні люди з групи ризику (60+ років)'},
      {en: 'Women and girls at risk', uk: 'жінки та дівчата з групи ризику'},
      {en: 'Survivors of violence or torture', uk: 'Люди, які пережили насильство або тортури'},
      {en: 'People with legal and physical protection needs', uk: 'Люди, які потребують правового та фізичного захисту'},
      {en: 'No legal documentation', uk: 'Жодної юридичної документації'},
      {en: 'Stateless persons', uk: 'Особи без громадянства'},
    ], {showIf: [{question: snIdentified, value: 'Person with specific needs'}]})
    return [
      snIdentified,
      snCategory,
    ]
  }

  static readonly specificNeedsRomane = (k: Form) => {
    const options = [
      'Older person at risk',
      'Disability',
      'Serious medical condition',
      'Child at risk',
      'Woman at risk',
      'Single parent or caregiver',
      'Family unity',
      'Legal and Physical Protection Needs',
      'Torture',
      'GBV',
    ]

    const sn = k.questionWithChoices('CHECKBOX', `Specifics needs`, options)

    const showIf = (opt: string): ShowIfCondition<string>[] => {
      return [{
        question: sn,
        value: opt
      }]
    }

    return [
      sn,
      k.questionWithChoices('CHECKBOX', `Specifics needs`, [
        'Single older person (ER-NF)',
        'Older person unable to care for self (ER-FR)',
        'Older person headed household supporting children (ER-MC/SP-GP)',
      ], {showIf: showIf('Older person at risk')}),
      k.questionWithChoices('CHECKBOX', `Specifics needs`, [
        'Physical disability (DS-PM/DS-PS)',
        'Mental disability (DS-MM/DS-MS)',
        'Visual impairment (DS-BD)',
        'Hearing impairment (DS-DF)',
        'Speech impairment (DS-SD)',
      ], {showIf: showIf('Disability')}),
      k.questionWithChoices('CHECKBOX', `Specifics needs`, [
        'Chronic illness (SM-CI)',
        'Mental illness (SM-MI)',
        'Addiction (SM-AD)',
        'Life-threatening medical condition (SM-CC)',
        'Malnutrition (SM-MN)',
        'Difficult pregnancy (SM-DP)',
      ], {showIf: showIf('Serious medical condition')}),
      k.questionWithChoices('CHECKBOX', `Specifics needs`, [
        'Separated child (SC-SC)',
        'Unaccompanied child (SC-UC)',
        'Child-headed household (SC-CH)',
        'Child in institutional care (SC-IC)',
        'Child in foster care (SC-FC)',
        'Teenage pregnancy (CR-TP)',
        'Child parent (CR-CP)',
        'Child spouse (CR-CS)',
        'Child carer (CR-CC)',
        'Child at risk of not attending school (CR-NE)',
        'Child with special education needs (CR-SE)',
        'Child engaged in labour (CR-LO/CR-LW)',
        'Child associated with armed forces or groups (CR-AF)',
        'Child in conflict with the law (CR-CL)',
      ], {showIf: showIf('Child at risk')}),
      k.questionWithChoices('CHECKBOX', `Specifics needs`, [
        'Single woman at risk (WR-SF)',
        'Lactation (WR-LC)',
      ], {showIf: showIf('Woman at risk')}),
      k.questionWithChoices('CHECKBOX', `Specifics needs`, [
        'Single parent (SP-PT)',
        'Single caregiver (SP-CG)',
      ], {showIf: showIf('Single parent or caregiver')}),
      k.questionWithChoices('CHECKBOX', `Specifics needs`, [
        'Tracing required (FU-TR)',
        'Family reunification required (FU-FR)',
      ], {showIf: showIf('Family unity')}),
      k.questionWithChoices('CHECKBOX', `Specifics needs`, [
        'No legal documentation (LP-ND)',
        'Unmet basic needs (LP-BN)',
        'No access to services (LP-NA)',
        'Mixed marriage (LP-MM)',
        'Multiple displacements (LP-MD)',
        'Violence, abuse or neglect (LP-AN)',
        'Marginalized from society or community (LP-MS)',
        'Criminal record (LP-CR)',
      ], {showIf: showIf('Legal and Physical Protection Needs')}),
      k.questionWithChoices('CHECKBOX', `Specifics needs`, [
        'Psychological and/or physical impairment due to torture (TR-PI)',
        'Witness of violence to other (TR-WV)',
      ], {showIf: showIf('Torture')}),
      k.questionWithChoices('CHECKBOX', `Specifics needs`, [
        'Survivor of GBV (SV)',
      ], {showIf: showIf('GBV')}),
    ]
  }
}
