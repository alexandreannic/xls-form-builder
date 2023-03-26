import {FormCreator, Question2, QuestionProps, ShowIf, ShowIfCondition} from '../../core/v2/FormCreator'
import {I18n} from './i18n/en'
import {Utils} from '../../core/Utils'
import {Enum, mapFor} from '@alexandreannic/ts-utils'
import {oblast} from '../../location/oblast'
import {raions} from '../../location/raion'
import {hromada} from '../../location/hromada'

export class Common {
  constructor(private k: FormCreator<I18n>) {
  }

  static readonly maxHHComposition = 9

  readonly showIfHaveAdultInHHBySex = (sex: 'male' | 'female'): ShowIf<I18n> => {
    const showIf: ShowIf<I18n>[] = mapFor(Common.maxHHComposition, i => ({
      showIfType: 'and',
      showIf: [
        {questionName: 'hh_sex_' + (i + 1), op: '=', value: sex},
        {questionName: 'hh_age_' + (i + 1), op: '>=', value: 18}
      ]
    }))
    return {showIfType: 'or', showIf}
  }

  readonly showIfHaveChildInHHBySex = (sex: 'male' | 'female'): ShowIf<I18n> => {
    const showIf: ShowIf<I18n>[] = mapFor(Common.maxHHComposition, i => ({
      showIfType: 'and',
      showIf: [
        {questionName: 'hh_sex_' + (i + 1), op: '=', value: sex},
        {questionName: 'hh_age_' + (i + 1), op: '<', value: 18}
      ]
    }))
    return {showIfType: 'or', showIf}
  }

  readonly showIfHaveChildInHH = (): ShowIf<I18n> => {
    return {
      showIfType: 'or',
      showIf: mapFor(Common.maxHHComposition, i => {
        return {
          questionName: 'hh_age_' + (i + 1),
          op: '<',
          value: 18
        }
      }) as ShowIfCondition<I18n>[]
    }
  }
  
  readonly showIfHaveAdultInHH = (): ShowIf<I18n> => {
    return {
      showIfType: 'or',
      showIf: mapFor(Common.maxHHComposition, i => {
        return {
          questionName: 'hh_age_' + (i + 1),
          op: '>=',
          value: 18
        }
      }) as ShowIfCondition<I18n>[]
    }
  }

  readonly sex: (keyof I18n)[] = [
    'male',
    'female',
    'other',
    'unable_unwilling_to_answer',
  ]

  readonly haveNoMinorInHH = (): ShowIf<I18n> => {
    return {
      showIfType: 'and',
      showIf: mapFor(Common.maxHHComposition, i => {
        const t: ShowIf<I18n> = {
          showIfType: 'or',
          showIf: [
            {
              questionName: 'hh_age_' + (i + 1),
              op: '>=',
              value: 18
            },
            {
              questionName: `hh_age_${i + 1}`,
              op: '=',
              value: '""'
            },
          ]
        }
        return t
      })
    }
  }

  readonly hhComposition = (): Question2<I18n>[] => {
    return mapFor(Common.maxHHComposition, i => {
      return [
        this.k.questionWithChoices({
          name: 'hh_sex_' + (i + 1),
          size: 'small',
          bold: false,
          showIf: {questionName: 'how_many_individuals_including_the_respondent_are_in_the_household', op: '>=', value: i + 1 as any},
          appearance: 'horizontal-compact',
          borderTop: true,
          options: this.sex
        }),
        this.k.question({
          type: 'INTEGER',
          name: 'hh_age_' + (i + 1),
          constraint: '. >= 0 and . < 150',
          showIf: {questionName: 'how_many_individuals_including_the_respondent_are_in_the_household', op: '>=', value: i + 1 as any},
          size: 'small',
          bold: false,
        })
      ]
    }).flat()
  }

  readonly location = ({
    name = 'location',
    ...props
  }: Partial<QuestionProps<I18n>> = {}) => {
    const id = Utils.makeid()
    const label: any = props.label ?? name
    const getName = (q: string) => name + '_' + q + '_' + id
    return [
      this.k.label({
        name: getName('label'),
        hint: 'its_an_autocomplete',
        label,
        ...props
      }),
      this.k.questionWithChoices({
        size: 'small',
        bold: false,
        label: 'oblast',
        appearance: 'minimal autocomplete',
        name: getName('oblast'),
        options: Enum.keys(oblast).map(k => ({name: k})),
        ...props
      }),
      this.k.questionWithChoices({
        label: 'raion',
        size: 'small',
        appearance: 'minimal autocomplete',
        bold: false,
        name: getName('raion'),
        choiceFilter: `tag=\${${getName('oblast')}}`,
        options: Enum.entries(raions).map(([k, v]) => ({name: k, tag: v.parent})),
        ...props
      }),
      this.k.questionWithChoices({
        size: 'small',
        label: 'hromada',
        appearance: 'minimal autocomplete',
        bold: false,
        moveOptionsToExternalFile: 'hromada',
        name: getName('hromada'),
        choiceFilter: `tag=\${${getName('raion')}} or tag1=\${${getName('oblast')}}`,
        options: Enum.entries(hromada).map(([k, v]) => {
          return ({name: k, tag: v.parent, tag1: raions[v.parent as keyof typeof raions].parent})
        }),
        ...props
      })
    ]
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
    return this.k.questionWithChoicesAndOtherSpecify({
      name: 'type_of_site',
      options: [
        'private_housing',
        'collective_centre',
        'village_settlement',
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

  readonly rating = (props: Omit<QuestionProps<I18n>, 'type' | 'hint' | 'optional' | 'appearance' | 'options'>) => {
    return this.k.questionWithChoices({
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

  readonly incidents = (props: Pick<QuestionProps<I18n>, 'showIfType' | 'showIf' | 'name' | 'label' | 'bold'>): Question2<I18n>[] => {
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
        'unable_unwilling_to_answer',
      ],
      ...props
    })
  }

  readonly when = (props: Pick<QuestionProps<I18n>, 'showIfType' | 'showIf' | 'name' | 'label' | 'bold'>): Question2<I18n> => {
    return this.k.questionWithChoices({
      ...props,
      choiceFilter: `tag=\${get_tag_if_is_displaced} or tag1=\${get_tag_if_is_displaced}`,
      options: [
        {tag: 'all', tag1: 'nondisplaced', name: 'predisplacement_or_in_the_area_of_origin'},
        {tag: 'all', name: 'during_the_displacement_journey'},
        {tag: 'all', name: 'in_displacement_location'},
      ]
    })
  }

  readonly whoWerePerpetrators = (props: Pick<QuestionProps<I18n>, 'showIfType' | 'showIf' | 'name' | 'label' | 'bold'>): Question2<I18n>[] => {
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

  readonly incidentsForm = (props: Pick<QuestionProps<I18n>, 'name' | 'showIf' | 'showIfType'>): Question2<I18n>[] => {
    const id = Utils.makeid()
    const showIf: ShowIfCondition<I18n> = {questionName: props.name, value: 'yes'}
    return [
      this.k.questionWithChoices({
        ...props,
        appearance: 'horizontal-compact',
        options: ['yes', 'no', 'unable_unwilling_to_answer'],
      }),
      ...this.incidents({
        showIf,
        name: 'what_type_of_incidents_took_place' + id,
        label: 'what_type_of_incidents_took_place',
        bold: false,
      }),
      this.when({
        showIf,
        name: 'when_did_the_incidents_occur' + id,
        label: 'when_did_the_incidents_occur',
        bold: false,
      }),
      ...this.whoWerePerpetrators({
        label: 'who_were_the_perpetrators_of_the_incident',
        name: 'who_were_the_perpetrators_of_the_incident' + id,
        bold: false,
        showIf,
      }),
      this.k.divider({showIf}),
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
        'unable_unwilling_to_answer',
      ],
      ...props,
    })
  }
}
