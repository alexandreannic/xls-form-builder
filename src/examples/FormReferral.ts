import {XLSFormBuilder} from '../core/XLSFormBuilder'
import {Form, ShowIfCondition} from '../core/Form'
import {Common} from './Common'

export const formReferral = () => {
  const k = new Form()
  const consentToRefer = k.questionWithChoices('RADIO', 'Consent to refer', ['Yes', 'No'], {required: true})
  const showIfConsentToRefer: [ShowIfCondition] = [{
    question: consentToRefer,
    value: 'Yes',
  }]
  new XLSFormBuilder().buildAndCreateXLS({title: 'Referral form'}, [
    k.section('General information', () => {
      return [
        k.question('TEXT', 'Case code'),
        k.questionWithChoices('RADIO', 'Already referred?', ['Yes', 'No'], {required: true}),
        ...Common.polishBase(k, {required: true}),
        Common.staffCode(k, undefined, {required: true}),
        Common.today(k, 'Referral date', {required: true}),
        Common.levelOfRisk(k),
        consentToRefer,
      ]
    }),

    k.section('Bio data', () => {
      return [
        k.question('TEXT', 'Full Name', {required: true}),
        ...Common.nationalitiesAndSpecify(k, undefined, {required: true}),
        Common.status(k, {required: true}),
        Common.gender(k, undefined, {required: true}),
        k.question('INTEGER', 'Age', {required: true}),
        ...Common.contactDetails(k),
        ...Common.specificNeedsHCR(k),
      ]
    }, {showIf: showIfConsentToRefer}),

    k.section('Referral', () => {
      return [
        k.questionWithChoices('RADIO', 'Type of referral', ['Internal', 'External']),
        ...Common.serviceRequested(k),
        Common.agencyReferredTo(k),
        k.question('TEXTAREA', 'Details of the referral'),
      ]
    }, {showIf: showIfConsentToRefer}),
  ])
}
