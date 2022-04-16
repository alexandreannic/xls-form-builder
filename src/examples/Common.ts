import {Form, Question, QuestionConf, ShowIf} from '../core/Form'

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
      'UNHCR/UNICEF',
      'UNICEF'
    ])
  }

  static readonly levelOfRisk = (k: Form, label = 'Level of risk') => {
    return k.questionWithChoices('RADIO', label, [
      'emergency',
      'urgent',
      'normal',
    ])
  }

  static readonly serviceRequested = (k: Form, label = 'Service requested') => {
    return k.questionWithChoices('RADIO', label, [
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
      'Other (specify)',
    ])
  }

  static readonly staffCode = (k: Form, label = 'Staff code') => {
    return k.questionWithChoices('RADIO', label, [
      'OLHUSUPR22',
      'NASZPSPR22',
      'IRRAPSPR22',
      'JUPISOPR22',
      'ANZUPSPR22',
      'MABISOPR22',
      'DAIVSOPR22',
      'ANINPSPR22',
    ])
  }

  static readonly today = (k: Form, label = 'Date') => {
    return k.question('DATE', label, {
      required: true,
      default: 'today()'
    })
  }
  static readonly contactDetails = (k: Form) => {
    return [
      k.question('TEXT', '📞 WhatsApp'),
      k.question('TEXT', '📞 Polish phone number'),
      k.question('TEXT', '✉️ Email'),
      k.question('TEXT', '🏠 Current address'),
    ]
  }

  static readonly status = (k: Form) => k.questionWithChoices('RADIO', 'Legal status', ['Refugee', 'Asylum seeker', 'Polish citizeen'])

  // static readonly lstatus = (k: Form) => k.questionWithChoices('RADIO', 'Legal status', ['Refugee', 'Asylum seeker', 'Polish citizeen'])

  static readonly gender = (k: Form, label = 'Gender', conf?: QuestionConf) => k.questionWithChoices('RADIO', label, ['Female', 'Male', 'Other'], conf)

  static readonly nationalitiesAndSpecify = (k: Form, label = 'Nationalities', conf?: QuestionConf) => k.questionWithChoicesAndSpecify('CHECKBOX', label, [
    {label: 'Ukrainian',},
    {label: 'Not willing to disclose',},
    {label: 'Other (specify)', specify: true},
  ], conf)

  static readonly polishBase = (k: Form): Question[] => {
    const location = k.questionWithChoices('RADIO', 'Location', [
      'Warsaw',
      'Krakow',
      'Rzeszow',
      'Lublin',
      'Chelm'
    ])

    const buildQuestion = (ifLabel: string, options: string[]): Question => {
      return k.questionWithChoices('RADIO', 'Name of center', options, {
        showIf: [{
          question: location.name,
          value: location.options!.find(_ => _.label === ifLabel)!.name
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

  static readonly specificNeeds = (k: Form) => {
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

    const showIf = (opts: string): ShowIf[] => {
      return [{
        question: sn.name,
        value: sn.options!.find(_ => _.label === opts)!.name
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
