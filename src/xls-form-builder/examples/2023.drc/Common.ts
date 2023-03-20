import {FormCreator, QuestionProps, ShowIfCondition} from '../../core/v2/FormCreator'
import {I18n} from './i18n/en'

export class Common {
  constructor(private k: FormCreator<I18n>) {
  }

  readonly protStaffCode = () => {
    return this.k.questionWithChoices({
      name: 'staff_code',
      options: [
        'CODE1' as any,
        'CODE2' as any,
      ],
    })
  }

  readonly drcOffice = () => {
    return this.k.questionWithChoices({
      name: 'staff_to_insert_their_DRC_office',
      options: [
        'kharkiv',
        'mykolaiv',
        'sumi',
        'kyiv',
        'dnipro',
        'lviv',
        'chernihiv',
      ]
    })
  }

  readonly typeOfSite = () => {
    return this.k.questionWithChoices({
      name: 'type_of_site',
      options: [
        'type_of_site_city',
        'type_of_site_village',
        'type_of_site_collective_center',
      ]
    })
  }

  readonly location = () => {
    return this.k.questionWithChoices({
      name: 'what_oblast_current_living',
      options: [
        'yes', 'no',
      ]
    })
  }

  readonly whereIsSeparatedMember = (label: keyof I18n, showIf: ShowIfCondition<I18n>) => {
    return this.k.questionWithChoicesAndOtherSpecify({
      name: label,
      showIf: [showIf],
      options: [
        'remained_behind_in_the_area_of_origin',
        'do_not_know_their_whereabouts',
        'serving_in_the_military',
        'displaced_to_another_location_in_ukraine',
        'displaced_to_another_country_outside_ukraine',
        'unable_unwilling_to_answer'
      ]
    })
  }
  
  // readonly multipleChoicesAndUnable = (props: Omit<QuestionProps<I18n>, 'type'> & {
  //   options: (keyof I18n)[],
  // }) => {
  //   console.log(`not(selected(., 'unable_unwilling_to_answer') and (${props.options.map(o => `selected(., '${o}')`).join(' or ')}))`)
  //   return this.k.questionWithChoices({
  //     ...props,
  //     options: [...props.options, 'unable_unwilling_to_answer'],
  //     multiple: true,
  //     constraint: `not(selected(., 'unable_unwilling_to_answer') and (${props.options.map(o => `selected(., '${o}')`).join(' or ')}))`
  //   })
  // }
}
