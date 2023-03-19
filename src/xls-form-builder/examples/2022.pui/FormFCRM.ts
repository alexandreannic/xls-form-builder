import {Form} from '../core/Form'
import {EN_UK_Label, pleaseSpecify_EN_UK} from '../core/Utils'
import {XLSFormBuilder} from '../core/XLSFormBuilder'
import {Common} from './Common'

export const formFCRM = () => {
  const k = new Form<EN_UK_Label>(pleaseSpecify_EN_UK)
  // new XLSFormBuilder<EN_UK_Label>().buildAndCreateXLSWithoutSection({title: 'FCRM Form'}, () => {
  new XLSFormBuilder<EN_UK_Label>().buildAndCreateXLS({title: 'FCRM Form'}, [
    k.section({en: 'The problem', uk: ''}, () => {
      return [
        k.note({
          en:
            'PUI, Premiere Urgence Internationale is an international non-governmental, '
            + 'non-profit, non-political and non-religious organization who is provided support in '
            + 'your area (explain activities implemented by PUI in the area). The MEAL Department '
            + '(Monitoring, Evaluation, and Accountability) is in charge of tracking progress, make '
            + 'adjustments and raise the unintended effects of programs, independently from the programs. '
            + 'That is the reason why MEAL team collects feedback from beneficiaries of our activities.',
          uk: '',
        }),
        k.note({
          en:
            'If you want to share feedback with us, you can fill this form. **The information below is '
            + 'confidential and will not be disclosed to anyone other than authorized persons**. Your first and '
            + 'last name and telephone number will allow us to give you information on the follow-up to your message, '
            + 'but you can remain anonymous if you wish.',
          uk: '',
        }),
        k.questionWithChoices('RADIO', {en: 'What do you want to report ?', uk: ''}, [
          {en: 'Suggestion to help PUI to improve', uk: ''},
          {en: 'Complaint about inappropriate PUI staff behavior', uk: ''},
          {en: 'Others', uk: ''},
        ], {required: true}),
        k.question('TEXTAREA', {en: 'Details of feedback or complaint', uk: ''}, {
          hint: {
            en: 'Be as specific as possible if you report an event by indicating the date, time, '
              + 'place, people involved, facts, etc. This will facilitate the processing of your feedback '
              + 'by our team to provide a quick response)',
            uk: '',
          }
        }),
        ...Common.polishBase(k, {en: 'Where did it happen ?', uk: ''}),
        Common.today(k, {en: 'When did it happen ?', uk: ''}),
        k.questionWithChoices('RADIO', {en: 'Would you like an answer to your question ?', uk: ''}, [
          {en: 'Yes', uk: ''},
          {en: 'No', uk: ''},
        ])
      ]
    }),
    k.section({en: 'Information about you', uk: ''}, () => {
      return [
        Common.gender(k),
        Common.ageRange(k),
        k.question('TEXT', {en: 'Full name', uk: ''}),
        ...Common.contactDetails(k)
      ]
    })
  ])
}
