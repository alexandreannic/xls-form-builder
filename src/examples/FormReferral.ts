import {XLSFormBuilder} from '../core/XLSFormBuilder'
import {Form} from '../core/Form'
import {Common} from './Common'

export const formReferral = () => {
  const k = new Form()
  new XLSFormBuilder().buildAndCreateXLS({title: 'Referral form'}, [
    k.section('General information', () => {
      const caseCOde = k.question('TEXT', 'Case code')
      const alreadyReferred = k.questionWithChoices('RADIO', 'Already referred?', ['Yes', 'No'])
      const base = Common.polishBase(k)
      const referringStaffCode = k.questionWithChoices('RADIO', 'Referring staff code', [
        'XXX1',
        'XXX2',
      ], {
        required: true,
      })
      const consentToRefer = k.questionWithChoices('RADIO', 'Consent to refer', ['Yes', 'No'])
      return [
        caseCOde,
        alreadyReferred,
        ...base,
        Common.staffCode(k),
        referringStaffCode,
        Common.today(k, 'Referral date'),
        Common.levelOfRisk(k),
        consentToRefer,
      ]
    }),
    k.section('Bio data', () => {
      return [
        k.question('TEXT', 'Full Name'),
        ...Common.nationalitiesAndSpecify(k),
        Common.gender(k),
        Common.status(k),
        k.question('TEXT', 'Age'),
        ...Common.contactDetails(k),
        k.question('TEXTAREA', 'Details of the referral'),
      ]
    }),
    k.section('Specific needs', () => {
      return [
        ...Common.specificNeeds(k),
      ]
    }),
    k.section('Referral', () => {
      return [
        k.questionWithChoices('RADIO', 'Type of referral', ['Internal', 'External']),
        Common.serviceRequested(k),
        k.questionWithChoices('CHECKBOX', 'Agency referred to', [
          'A21',
          'ICRC',
          'Polish Red Cross',
          'UNHCR',
        ]),
      ]
    }),
  ])
}
