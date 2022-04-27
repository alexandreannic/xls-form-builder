import {XLSFormBuilder} from '../core/XLSFormBuilder'
import {Form, ShowIfCondition} from '../core/Form'
import {Common} from './Common'
import {EN_UK_Label, pleaseSpecify_EN_UK} from '../core/Utils'

export const formReferral = () => {
  const k = new Form<EN_UK_Label>(pleaseSpecify_EN_UK)
  const consentToRefer = k.questionWithChoices('RADIO', {en: 'Consent to refer?', uk: 'згода на направлення'}, [{en: 'Yes', uk: 'Так'}, {en: 'No', uk: 'Ні'}], {required: true})
  const showIfConsentToRefer: [ShowIfCondition<EN_UK_Label>] = [{
    question: consentToRefer,
    value: 'Yes',
  }]
  new XLSFormBuilder<EN_UK_Label>().buildAndCreateXLS({title: 'Referral form'}, [
    k.section({en: 'General information', uk: 'Загальна інформація'}, () => {
      return [
        k.question('TEXT', {en: 'Case code', uk: 'код кейсу'}),
        k.questionWithChoices('RADIO', {en: 'Already referred?', uk: 'уже зверталися'}, [{en: 'Yes', uk: 'Так'}, {en: 'No', uk: 'Ні'}], {required: true}),
        ...Common.polishBase(k, undefined, {required: true}),
        Common.staffCode(k, undefined, {required: true}),
        Common.today(k, {en: 'Referral date', uk: 'Дата звернення'}, {required: true}),
        Common.levelOfRisk(k),
        consentToRefer,
      ]
    }),

    k.section({en: 'Bio data', uk: 'Біодані'}, () => {
      return [
        k.question('TEXT', {en: 'Full Name', uk: 'Повне ім\'я'}, {required: true}),
        ...Common.nationalitiesAndSpecify(k, undefined, {required: true}),
        Common.status(k, 'RADIO', undefined, {required: true}),
        Common.gender(k, undefined, {required: true}),
        k.question('INTEGER', {en: 'Age', uk: 'Вік'}, {required: true}),
        ...Common.contactDetails(k),
        ...Common.specificNeedsHCR(k),
      ]
    }, {showIf: showIfConsentToRefer}),

    k.section({en: 'Referral', uk: ''}, () => {
      return [
        k.questionWithChoices('RADIO', {en: 'Type of referral', uk: 'Тип направлення'}, [{en: 'Internal', uk: 'Внутрішній'}, {en: 'External', uk: 'Зовнішній'}], {required: true}),
        ...Common.serviceRequested(k, undefined, {required: true}),
        ...Common.agencyReferredTo(k),
        k.question('TEXTAREA', {en: 'Details of the referral', uk: 'Деталі направлення'}),
      ]
    }, {showIf: showIfConsentToRefer}),
  ])
}
