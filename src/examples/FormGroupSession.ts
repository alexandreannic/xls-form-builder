import {Form} from '../core/Form'
import {XLSFormBuilder} from '../core/XLSFormBuilder'
import {Common} from './Common'

export const formGroupSession = () => {
  const k = new Form()
  return new XLSFormBuilder().buildAndCreateXLSWithoutSection({title: 'Group session form'}, () => {
    const typeOfSession = k.questionWithChoices('RADIO', 'Type of session', [
      'Information dissemination session',
      'Awareness-session',
      'PSS group session (adults)',
      'PSS group session (children)',
    ], {required: true})
    const typeOfPSSAdults = k.questionWithChoices('RADIO', 'Type of PSS group session (adults)', [
      'Group counselling',
      'Provision of PFA',
      'Recreational activity',
      'Life-skills activity',
    ], {required: true, showIf: [{question: typeOfSession, value: 'PSS group session (adults)'}]})
    const typeOfPSSChildren = k.questionWithChoices('RADIO', 'Type of PSS group session (children)', [
      'Recreational activity',
      'Life-skills activity',
      'Structured curriculum',
    ], {required: true, showIf: [{question: typeOfSession, value: 'PSS group session (children)'}]})
    const topic = k.question('TEXT', 'Topic')
    const numberOfParticipants = k.note('Number of participants:')
    const male0_4 = k.question('INTEGER', 'Males 0-4 years', {default: '0'})
    const male5_17 = k.question('INTEGER', 'Males 5-17 years', {default: '0'})
    const male18_59 = k.question('INTEGER', 'Males 18-59 years', {default: '0'})
    const male60 = k.question('INTEGER', 'Males 60+ years', {default: '0'})
    const females0_4 = k.question('INTEGER', 'Females 0-4 years', {default: '0'})
    const females5_17 = k.question('INTEGER', 'Females 5-17 years', {default: '0'})
    const females18_59 = k.question('INTEGER', 'Females 18-59 years', {default: '0'})
    const females60 = k.question('INTEGER', 'Females 60+ years', {default: '0'})
    const totalNumber = k.question('INTEGER', 'Total number', {
      required: true,
      default: '0',
      constraint: `. = ${[
        male0_4,
        male5_17,
        male18_59,
        male60,
        females0_4,
        females5_17,
        females18_59,
        females60,
      ].map(_ => `\${${_.name}}`).join(' + ')}`
    })
    return [
      Common.today(k, undefined, {required: true}),
      ...Common.polishBase(k, {required: true}),
      Common.staffCode(k, 'Staff code (1)', {required: true}),
      Common.staffCode(k, 'Staff code (2)'),
      typeOfSession,
      typeOfPSSAdults,
      typeOfPSSChildren,
      topic,
      numberOfParticipants,
      male0_4,
      male5_17,
      male18_59,
      male60,
      females0_4,
      females5_17,
      females18_59,
      females60,
      totalNumber,
      Common.status(k, {required: true}),
      k.question('TEXTAREA', 'Notes', {hint: 'Including details on the session and group, challenges faced and recommendations if any'})
    ]
  })
}
