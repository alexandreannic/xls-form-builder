import {Form, ShowIf, ShowIfCondition} from '../../core/v1/Form'
import {XLSFormBuilder} from '../../core/v1/XLSFormBuilder'
import {Common} from './Common'
import {EN_UK_Label, pleaseSpecify_EN_UK} from '../../core/Utils'

export const formIntake = () => {
  const k = new Form<EN_UK_Label>(pleaseSpecify_EN_UK)
  return new XLSFormBuilder<EN_UK_Label>().buildAndCreateXLS({title: 'Intake individual form'}, [
    k.section({en: 'General information', uk: 'Загальна інформація'}, () => {
      return [
        Common.today(k, undefined, {required: true}),
        ...Common.polishBase(k, undefined, {required: true}),
        Common.staffCode(k, undefined, {required: true}),
      ]
    }),
    k.section({en: 'Bio data', uk: 'Біодані'}, () => {
      const isFollowUp = k.questionWithChoices('RADIO', {
        en: 'Have you been provided with an individual session by PUI before?',
        uk: 'чи раніше ви мали індивідуальну зустріч з працівниками PUI?'
      }, [
        {en: 'Yes, follow-up', uk: 'Так, повторна зустріч'},
        {en: 'No, new person of concern', uk: 'Ні, нове звернення від людини'},
      ])
      return [
        k.question('TEXT', {en: 'Full name', uk: 'Повне ім\'я'}),
        ...Common.nationalitiesAndSpecify(k),
        Common.status(k),
        Common.gender(k),
        Common.age(k),
        k.questionWithChoices('RADIO', {en: 'Household size', uk: 'розмір родини'}, [
          {en: '1', uk: '1'},
          {en: '2', uk: '2'},
          {en: '3', uk: '3'},
          {en: '4', uk: '4'},
          {en: '5+', uk: '5+'},
        ]),
        ...Common.contactDetails(k),
        isFollowUp,
        ...Common.polishBase(k, {en: 'Location of previous session', uk: 'Місце попередньої сесії'}, {showIf: [{question: isFollowUp, value: 'Yes, follow-up'}]}),
        ...Common.specificNeedsHCR(k),
      ]
    }),
    k.section({en: 'Assessment & service provided', uk: 'Оцінка та надання послуг'}, () => {
      const serviceProvided = k.questionWithChoicesAndSpecify('CHECKBOX', {en: 'Service(s) provided', uk: 'Надані послуги'}, [
        {label: {en: 'Information on assistance and services', uk: 'Інформація про допомогу та послуги'}},
        {label: {en: 'Legal counselling', uk: 'Юридична консультація'}},
        {label: {en: 'Mental health and psychosocial support', uk: 'Психічне здоров\'я та психосоціальна підтримка'}},
        {label: {en: 'Other (specify)', uk: 'інша (уточніть)'}, specify: true},
      ])
      const _showIfMHPSS: ShowIfCondition<EN_UK_Label>[] = [
        {question: serviceProvided[0], value: 'Mental health and psychosocial support'}
      ]
      return [
        ...serviceProvided,
        k.question('TEXTAREA', {en: 'Assessment', uk: 'Оцінка'}, {
          showIfType: 'or',
          showIf: [
            {question: serviceProvided[0], value: 'Information on assistance and services'},
            {question: serviceProvided[0], value: 'Legal counselling'},
            {question: serviceProvided[0], value: 'Other (specify)'},
          ]
        }),
        k.label({en: 'Mental health & psychosocial assessment & intervention', uk: 'Психічне здоров’я та психосоціальна оцінка та втручання'}, {showIf: _showIfMHPSS}),
        k.question('TEXTAREA',
          {
            en: 'Assessment (look and listen, observe appearance and behavior, assess any changes in feelings or behavior, identify protective factors and strengths)',
            uk: 'Оцінка (дивіться і слухайте, спостерігайте за зовнішнім виглядом і поведінкою, оцінюйте будь-які зміни в почуттях або поведінці, виявляйте захисні фактори та сильні сторони)',
          },
          {showIf: _showIfMHPSS, size: 'small'}),
        k.question('TEXTAREA', {
          en: 'Describe what was achieved with/provided to the client during the session',
          uk: 'Опишіть, що було досягнуто/надано клієнту під час сеансу',
        }, {showIf: _showIfMHPSS, size: 'small'}),
      ]
    }),
    k.section({en: 'Actions information', uk: 'Необхідні дії'}, () => {
      return [
        ...k.questionWithChoicesAndSpecify('CHECKBOX', {en: 'Actions needed', uk: 'Необхідні дії'}, [
          {label: {en: 'Mental health and psychosocial support follow-up consultation', uk: 'Подальша консультація з питань психічного здоров\'я та психосоціальної підтримки'}},
          {label: {en: 'Referral to PUI psychologist', uk: 'перенаправлення до психолога PUI'}},
          {label: {en: 'Referral to PUI social worker', uk: 'перенаправлення до соціального працівника PUI'}},
          {label: {en: 'Referral needed for external services (specify)', uk: 'необхідне перенаправлення до зовнішніх послуг (уточніть)'}, specify: true, specifyLabel: {en: 'Specify service(s)', uk: 'Вкажіть послуги'}},
          {label: {en: 'Other (specify)', uk: 'інша (уточніть)'}, specify: true, specifyLabel: {en: 'Specify other', uk: 'Вкажіть інше'}},
          {label: {en: 'None', uk: 'жодні'}},
        ]),
        Common.levelOfRisk(k),
        k.question('TEXTAREA', {en: 'Additional information', uk: 'Додаткова інформація'})
      ]
    })
  ])

}
