import {Form, ShowIf} from '../core/Form'

export class Common {

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
        questionName: sn.name,
        valueName: sn.options!.find(_ => _.label === opts)!.name
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
