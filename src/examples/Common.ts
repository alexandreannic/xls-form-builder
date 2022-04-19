import {Form, Question, QuestionConf, ShowIfCondition} from '../core/Form'

export class Common {

  static readonly agencyReferredTo = (k: Form, label = 'Agency referred to') => {
    return k.questionWithChoices('RADIO', label, [
      'CLEAR Global',
      'Helsinki Foundation for Human Rights',
      'INTERSOS',
      'IOM',
      'International Rescue Committee',
      'Loop',
      'NRC',
      'Oxfam',
      'Red Pencil',
      'Save the Children',
      'Terre Des Hommes',
      'The Polish Center for International Aid (PCPM)',
      'UNHCR',
      'UNICEF'
    ])
  }

  static readonly levelOfRisk = (k: Form, label = 'Level of risk') => {
    return k.questionWithChoices('RADIO', label, [
      'Emergency',
      'Urgent',
      'Normal',
    ])
  }

  static readonly serviceRequested = (k: Form, label = 'Service requested') => {
    return k.questionWithChoicesAndSpecify('CHECKBOX', label, [
      'Psychosocial support and Mental Health',
      'Child protection services',
      'Family tracing / Reunification',
      'Protection - Specialized services',
      'Material assistance / NFIs',
      'Legal aid',
      'Registration',
      'Accommodation',
      'Medical / Nutrition',
      'Cash assistance',
      'Food assistance',
      'Mobility support',
      'Education / Vocational training',
      {label: 'Other (specify)', specify: true},
    ])
  }

  static readonly staffCode = (k: Form, label = 'Staff code', conf?: QuestionConf) => {
    return k.questionWithChoices('RADIO', label, [
      'OLHUSUPR22',
      'NASZPSPR22',
      'IRRAPSPR22',
      'JUPISOPR22',
      'ANZUPSPR22',
      'MABISOPR22',
      'DAIVSOPR22',
      'ANINPSPR22',
    ], conf)
  }

  static readonly today = (k: Form, label = 'Date', conf?: QuestionConf) => {
    return k.question('DATE', label, {
      default: 'today()',
      ...conf,
    })
  }
  static readonly contactDetails = (k: Form) => {
    return [
      k.phone('📞 WhatsApp'),
      k.phone('📞 Polish phone number'),
      k.email('✉️ Email'),
      k.question('TEXT', '🏠 Current address'),
    ]
  }

  static readonly status = (k: Form, conf?: QuestionConf) => k.questionWithChoices('CHECKBOX', 'Status', ['Refugee', 'Volunteer'], conf)

  // static readonly lstatus = (k: Form) => k.questionWithChoices('RADIO', 'Legal status', ['Refugee', 'Asylum seeker', 'Polish citizeen'])

  static readonly gender = (k: Form, label = 'Gender', conf?: QuestionConf) => k.questionWithChoices('RADIO', label, ['Female', 'Male', 'Other'], conf)

  static readonly nationalitiesAndSpecify = (k: Form, label = 'Nationalities', conf?: QuestionConf) => k.questionWithChoicesAndSpecify('CHECKBOX', label, [
    {label: 'Ukrainian',},
    {label: 'Not willing to disclose',},
    {label: 'Other (specify)', specify: true},
  ], conf)

  static readonly polishBase = (k: Form, conf?: QuestionConf): Question[] => {
    const location = k.questionWithChoices('RADIO', 'Location', [
      'Warsaw',
      'Krakow',
      'Rzeszow',
      'Lublin',
      'Chelm'
    ], conf)

    const buildQuestion = (ifLabel: string, options: string[]): Question => {
      return k.questionWithChoices('RADIO', 'Name of center', options, {
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
        'Expo',
        'PESEL registration centre',
        'Warsaw 1',
        'Warsaw 2 – Warta Towers',
      ]),
      buildQuestion('Krakow', [
        'Tauron Arena',
        'Train station',
      ]),
      buildQuestion('Rzeszow', [
        'Korczowa',
        'Medyka',
        'Tesco, Prezmysl',
        'Boratyn',
        'Radymno',
        'House of Ukraine',
      ]),
      buildQuestion('Lublin', [
        'Dorohusk',
        'Hrebenne',
        'Lublin',
      ]),
      buildQuestion('Chelm', [
        'Sports Centre/ Tesco Shop'
      ]),
    ]
  }

  static readonly priorityRate = (k: Form) => {
    return k.questionWithChoices('RADIO', 'Priority case', [
      'Emergency',
      'Urgent',
      'Normal'
    ])
  }

  static readonly specificNeedsHCR = (k: Form) => {
    const snIdentified = k.questionWithChoices('RADIO', 'Specific needs identified within the family', [
      'No specific needs (identified)',
      'Person with specific needs',
    ])
    const snCategory = k.questionWithChoices('CHECKBOX', 'Person with specific needs category', [
      'Children and adolescent at risk',
      'Unaccompanied children',
      'Separated children',
      'Persons with disabilities',
      'Person with serious medical conditions',
      'Older persons at risk (60+ years old)',
      'Women and girls at risk',
      'Survivors of violence or torture',
      'People with legal and physical protection needs',
      'No legal documentation',
      'Stateless person',
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

    const showIf = (opt: string): ShowIfCondition[] => {
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
