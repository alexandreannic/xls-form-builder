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

  readonly location = (props?: Pick<QuestionProps<I18n>, 'showIf' | 'showIfType' | 'name' | 'optional'>) => {
    return this.k.questionWithChoices({
      ...props,
      name: 'what_oblast_current_living',
      options: [
        'Avtonomna Respublika Krym' as any,
        'Dnipropetrovska' as any,
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

  readonly rating = (props: Partial<QuestionProps<I18n>>) => {
    return this.k.questionWithChoices({
      name: 'how_would_you_describe_the_relationship_between_member_of_the_host_community',
      hint: 'leave_blank_if_none',
      optional: true,
      appearance: 'likert',
      options: [
        '_1_very_unsafe',
        '_2_unsafe',
        '_4_safe',
        '_5_very_safe',
      ],
      ...props
    })
  }
}
