import {Form} from '../../core/v1/Form'
import {XLSFormBuilder} from '../../core/v1/XLSFormBuilder'
import {Common} from './Common'
import {EN_UK_Label, pleaseSpecify_EN_UK} from '../../core/Utils'

export const formGroupSession = () => {
  const k = new Form<EN_UK_Label>(pleaseSpecify_EN_UK)
  return new XLSFormBuilder<EN_UK_Label>().buildAndCreateXLSWithoutSection({title: 'Group session form'}, () => {
    const typeOfSession = k.questionWithChoices('RADIO', {en: 'Type of session', uk: 'вид сесії'}, [
      {en: 'Information dissemination session', uk: 'сесія з поширення інформації'},
      {en: 'Awareness-session', uk: 'сесія з попередження та обізнаності'},
      {en: 'PSS group session (adults)', uk: 'Сеанс групи психосоціальної підтримки (дорослі)'},
      {en: 'PSS group session (children)', uk: 'Сеанс групи психосоціальної підтримки (діти)'},
    ], {required: true})
    const typeOfPSSAdults = k.questionWithChoices('RADIO', {en: 'Type of PSS group session (adults)', uk: 'Тип сесії групи психосоціальної підтримки (дорослі)'}, [
      {en: 'Group counselling', uk: 'Групове консультування'},
      {en: 'Provision of PFA', uk: 'Надання ПФА'},
      {en: 'Recreational activity', uk: 'Рекреаційна діяльність'},
      {en: 'Life-skills activity', uk: 'Діяльність з життєвими навичками'},
    ], {required: true, showIf: [{question: typeOfSession, value: 'PSS group session (adults)'}]})
    const typeOfPSSChildren = k.questionWithChoices('RADIO', {en: 'Type of PSS group session (children)', uk: 'Тип сесії групи психосоціальної підтримки (діти{en: )'}, [
      {en: 'Recreational activity', uk: 'Рекреаційна діяльність'},
      {en: 'Life-skills activity', uk: 'Діяльність з життєвими навичками'},
      {en: 'Structured curriculum', uk: 'Структурована навчальна програма'},
    ], {required: true, showIf: [{question: typeOfSession, value: 'PSS group session (children)'}]})
    const topic = k.question('TEXT', {en: 'Topic', uk: 'Тема'})
    const numberOfParticipants = k.label({en: 'Number of participants:', uk: 'Кількість учасників:'})
    const male0_4 = k.question('INTEGER', {en: '<sup>Males 0-4 years</sup>', uk: '<sup>хлопці 0-4 роки</sup>'}, {default: '0', required: true})
    const male5_11 = k.question('INTEGER', {en: '<sup>Males 5-11 years</sup>', uk: '<sup>хлопці 5-11 роки</sup>'}, {default: '0', required: true})
    const male12_17 = k.question('INTEGER', {en: '<sup>Males 12-17 years</sup>', uk: '<sup>хлопці 12-17 роки</sup>'}, {default: '0', required: true})
    const male18_59 = k.question('INTEGER', {en: '<sup>Males 18-59 years</sup>', uk: '<sup>чоловіки 18-59 роки</sup>'}, {default: '0', required: true})
    const male60 = k.question('INTEGER', {en: '<sup>Males 60+ years</sup>', uk: '<sup>чоловіки 60+ роки</sup>'}, {default: '0', required: true})
    const females0_4 = k.question('INTEGER', {en: '<sup>Females 0-4 years</sup>', uk: '<sup>дівчата 0-4 роки</sup>'}, {default: '0', required: true})
    const females5_11 = k.question('INTEGER', {en: '<sup>Females 5-11 years</sup>', uk: '<sup>дівчата 5-11 роки</sup>'}, {default: '0', required: true})
    const females12_17 = k.question('INTEGER', {en: '<sup>Females 12-17 years</sup>', uk: '<sup>дівчата 12-17 роки</sup>'}, {default: '0', required: true})
    const females18_59 = k.question('INTEGER', {en: '<sup>Females 18-59 years</sup>', uk: '<sup>жінки 18-59 роки</sup>'}, {default: '0', required: true})
    const females60 = k.question('INTEGER', {en: '<sup>Females 60+ years</sup>', uk: '<sup>жінки 60+ роки</sup>'}, {default: '0', required: true})
    const totalNumber = k.question('INTEGER', {en: '<sup>Total number</sup>', uk: '<sup>Загальна кількість</sup>'}, {
      required: true,
      default: '0',
      constraintMessage: `Must be equal to the sum of all previous counts`,
      constraint: `. = ${[
        male0_4,
        male5_11,
        male12_17,
        male18_59,
        male60,
        females0_4,
        females5_11,
        females12_17,
        females18_59,
        females60,
      ].map(_ => `\${${_.name}}`).join(' + ')}`
    })
    return [
      Common.today(k, undefined, {required: true}),
      ...Common.polishBase(k, undefined, {required: true}),
      Common.staffCode(k, {en: 'Staff code (1)', uk: 'код працівника (1)'}, {required: true}),
      Common.staffCode(k, {en: 'Staff code (2)', uk: 'код працівника (2)'},),
      typeOfSession,
      typeOfPSSAdults,
      typeOfPSSChildren,
      topic,
      numberOfParticipants,
      male0_4,
      male5_11,
      male12_17,
      male18_59,
      male60,
      females0_4,
      females5_11,
      females12_17,
      females18_59,
      females60,
      totalNumber,
      Common.status(k, 'CHECKBOX', undefined, {required: true}),
      k.question('TEXTAREA', {en: 'Notes', uk: 'примітки'}, {
        hint: {
          en: 'Including details on the session and group, challenges faced and recommendations if any',
          uk: 'деталі щодо групової зустрічі або групи, викликів та рекомендацій, якщо є щось'
        }
      })
    ]
  })
}
