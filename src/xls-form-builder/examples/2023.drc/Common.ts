import {FormCreator, Question2, QuestionProps, ShowIfCondition} from '../../core/v2/FormCreator'
import {I18n} from './i18n/en'
import {Utils} from '../../core/Utils'

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
        'private_housing',
        'collective_centre',
        'village_settlement',
      ]
    })
  }

  readonly location = (props?: Pick<QuestionProps<I18n>, 'label' | 'showIf' | 'showIfType' | 'name' | 'optional'>) => {
    return this.k.questionWithChoices({
      name: 'what_oblast_current_living',
      ...props,
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

  readonly whyRemainBehind = (props: Pick<QuestionProps<I18n>, 'name'> & {
    ref: keyof I18n
  }) => {
    return this.k.questionWithChoicesAndOtherSpecify({
      showIf: {questionName: props.ref, value: 'remained_behind_in_the_area_of_origin'},
      options: [
        'stayed_to_defend_the_community',
        'were_unable_to_flee_as_a_result_of_age_or_physical_impairment',
        'did_not_want_to_leave_the_area',
        'lacked_resources_to_travel',
        'unable_to_travel_due_to_safety_and_security_concerns',
        'fear_of_conscription',
        'stayed_to_take_care_of_properties',
        'unable_unwilling_to_answer',
      ],
      ...props
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

  readonly incidents = (props: Pick<QuestionProps<I18n>, 'name' | 'label' | 'showIf' | 'showIfType'>): Question2<I18n>[] => {
    return this.k.questionWithChoicesAndOtherSpecify({
      appearance: 'minimal',
      multiple: true,
      hint: 'do_not_read_out_options',
      options: [
        'killing_incl_extrajudicial_execution',
        'killing_injury_due_to_indiscriminate_attacks',
        'abduction_kidnapping_or_enforced_disappearance',
        'arbitrary_arrest_detention',
        'forced_recruitment_by_armed_actors',
        'physical_assault',
        'sexual_exploitation_and_abuse',
        'rape',
        'torture_or_inhumane_cruel_and_degrading_treatment',
        'forced_or_exploitative_labour',
        'trafficking_incl_forced_prostitution_organ_harvesting',
        'denial_of_right_to_return',
        'forced_internal_displacement',
        'forced_return_idp_only',
        'denial_of_access_to_basic_services_humanitarian_assistance',
        'forced_eviction',
        'destruction_of_property',
        'occupation_of_property',
        'extortion_of_property',
        'theft_and_robbery',
        'lack_of_confiscation_or_denial_of_civil_documentation',
        'denial_of_travel_documents',
        'denial_of_idp_registration',
      ],
      ...props
    })
  }

  readonly when = (props: Pick<QuestionProps<I18n>, 'label' | 'name' | 'showIf' | 'showIfType'>): Question2<I18n> => {
    return this.k.questionWithChoices({
      ...props,
      choiceFilter: `tag=\${get_tag_if_is_displaced} or tag1=\${get_tag_if_is_displaced}`,
      options: [
        {tag: 'all', tag1: 'displaced', name: 'predisplacement_or_in_the_area_of_origin'},
        {tag: 'all', name: 'during_the_displacement_journey'},
        {tag: 'all', name: 'in_displacement_location'},
      ]
    })
  }

  readonly whoWherePerpetrators = (props: Pick<QuestionProps<I18n>, 'label' | 'name' | 'showIf' | 'showIfType'>): Question2<I18n>[] => {
    return this.k.questionWithChoicesAndOtherSpecify({
      ...props,
      defineExclusiveOption: 'unable_unwilling_to_answer',
      multiple: true,
      appearance: 'minimal',
      options: [
        'the_russian_armed_forces',
        'armed_forces_of_ukraine',
        'armed_groups_militias',
        'criminal_groups',
        'traffickers_smugglers',
        'community_members_within_the_host_community',
        'community_members_within_the_displaced_community',
        'humanitarian_assistance_providers',
        'unable_unwilling_to_answer',
      ]
    })
  }

  readonly incidentsForm = (name: keyof I18n): Question2<I18n>[] => {
    const id = Utils.makeid()
    const showIf: ShowIfCondition<I18n> = {questionName: name, value: 'yes'}
    return [
      this.k.questionWithChoices({
        name: name,
        appearance: 'horizontal-compact',
        options: ['yes', 'no', 'unable_unwilling_to_answer'],
      }),
      ...this.incidents({
        showIf,
        name: 'what_type_of_incidents_took_place' + id,
        label: 'what_type_of_incidents_took_place',
      }),
      this.when({
        showIf,
        name: 'when_did_the_incidents_occur' + id,
        label: 'when_did_the_incidents_occur',
      }),
      ...this.whoWherePerpetrators({
        label: 'who_were_the_perpetrators_of_the_incident',
        name: 'who_were_the_perpetrators_of_the_incident' + id,
        showIf,
      }),
    ]
  }

  readonly priorityNeeds = (props: Pick<QuestionProps<I18n>, 'name'>) => {
    return this.k.questionWithChoices({
      appearance: 'minimal',
      defineExclusiveOption: 'none',
      options: [
        'education',
        'education_ter',
        'food',
        'shelter',
        'wash',
        'cash',
        'health_1_2',
        'health_m',
        'health_srh',
        'psychosocial_support',
        'legal_assistance_civil_documentation',
        'livelihood_support_vocational_training',
        'nfis',
        'none',
      ],
      ...props,
    })
  }
}
