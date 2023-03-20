import {FormCreator, ShowIf, ShowIfCondition} from '../../core/v2/FormCreator'
import {Common} from './Common'
import {I18n, i18n_en} from './i18n/en'
import {i18n_ua} from './i18n/ua'
import {JSONFormCompiler} from '../../core/v2/JSONFormCompiler'
import {XlsFileGenerator} from '../../core/v2/XlsFileGenerator'

export const protHH = async () => {
  const json = new JSONFormCompiler<I18n, 'en' | 'ua'>({
    numberOnTitles: true,
    form: {
      title: 'prot.hh.v2',
      sections: () => buildForm(),
    },
    translations: {en: i18n_en, ua: i18n_ua},
  }).buildForm()
  await new XlsFileGenerator({
    form: json,
    path: '/Users/alexandreac/Workspace/_humanitarian/xls-form-builder/output'
  }).createXLS()

  function buildForm() {
    const k = new FormCreator<I18n>({
      specifyLabel: 'please_specify',
      invalidPhone: 'invalid_phone',
      invalidEmail: 'invalid_email',
      specifyOptionLabel: 'other_specify'
    })

    const common = new Common(k)
    const showIfAccept: ShowIfCondition<I18n>[] = [{
      questionName: 'have_you_filled_out_this_form_before',
      value: 'no',
      eq: 'eq',
    }, {
      questionName: 'present_yourself',
      value: 'yes',
      eq: 'eq',
    }]
    return [
      k.section({
        name: 'introduction',
        questions: () => {
          return [
            common.protStaffCode(),
            common.drcOffice(),
            common.typeOfSite(),
            k.questionWithChoices({
              name: 'present_yourself',
              hint: 'hello_my_name_is',
              options: [
                'yes', 'no',
              ]
            }),
            k.label({
              showIf: {questionName: 'present_yourself', value: 'no'},
              name: 'thanks_the_respondant',
              color: 'red',
            }),
            k.questionWithChoices({
              showIf: {questionName: 'present_yourself', value: 'yes'},
              name: 'have_you_filled_out_this_form_before',
              options: [
                'yes', 'no',
              ]
            }),
            k.label({
              name: 'have_you_filled_out_this_form_before_yes',
              color: 'red',
              showIf: {questionName: 'have_you_filled_out_this_form_before', value: 'yes'},
            })
          ]
        }
      }),
      k.section({
        name: 'basic_bio_data',
        showIf: showIfAccept,
        questions: () => {
          return [
            common.location(),
            k.questionWithChoices({
              name: 'is_your_hh_single_header',
              options: [
                'yes', 'no', 'unable_unwilling_to_answer',
              ],
            }),
            k.questionWithChoicesAndOtherSpecify({
              name: 'do_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household',
              multiple: true,
              defineExclusiveOption: 'unable_unwilling_to_answer',
              options: [
                'pregnant_and_Lactating_woman_',
                'child_headed_household',
                'elder__headed_household',
                'person_with_disability_headed_household',
                'chronicallyill_headed_household',
                'no_specific_needs',
                'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoices({
              name: 'what_is_your_citizenship',
              options: [
                'ukrainian',
                'stateless',
                'non_ukrainian',
              ]
            }),
            k.questionWithChoicesAndOtherSpecify({
              name: 'if_nonukrainian_what_is_your_citizenship',
              showIf: [{questionName: 'what_is_your_citizenship', value: 'non_ukrainian'}],
              options: [
                'country_of_origin_azerbaijan',
                'country_of_origin_moldovan',
                'country_of_origin_romanian',
              ],
            }),
            k.questionWithChoicesAndOtherSpecify({
              name: 'if_ukrainian_do_you_or_your_household_members_identify_as_member_of_a_minority_group',
              showIf: [{questionName: 'what_is_your_citizenship', value: 'ukrainian'}],
              options: [
                'roma',
                'hungarian',
                'greek',
                'jewish',
                'tatar',
                'belorussian',
                'azerbaijan',
                'russian',
                'unable_unwilling_to_answer',
                'no',
              ],
            }),
            k.questionWithChoicesAndSpecify({
              name: 'what_is_the_primary_language_spoken_in_your_household',
              options: [
                'ukrainian',
                'russian',
                'mixed_ukrainian_russian',
              ]
            }),
            k.question({
              type: 'INTEGER',
              name: 'how_many_individuals_including_the_respondent_are_in_the_household',
            }),
            k.questionWithChoicesAndSpecify({
              name: 'are_you_separated_from_any_of_your_households_members',
              options: [
                'yes', 'no', 'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoices({
              multiple: true,
              defineExclusiveOption: 'unable_unwilling_to_answer',
              name: 'who_are_you_separated_from',
              options: [
                'partner',
                'child_lt_18',
                'child_gte_18',
                'mother',
                'father',
                'other_relative',
                'unable_unwilling_to_answer'
              ]
            }),
            common.whereIsSeparatedMember('where_is_your_partner', {questionName: 'who_are_you_separated_from', value: 'partner'}),
            common.whereIsSeparatedMember('where_is_your_child_lt_18', {questionName: 'who_are_you_separated_from', value: 'child_lt_18'}),
            common.whereIsSeparatedMember('where_is_your_child_gte_18', {questionName: 'who_are_you_separated_from', value: 'child_gte_18'}),
            common.whereIsSeparatedMember('where_is_your_mother', {questionName: 'who_are_you_separated_from', value: 'mother'}),
            common.whereIsSeparatedMember('where_is_your_father', {questionName: 'who_are_you_separated_from', value: 'father'}),
            common.whereIsSeparatedMember('where_is_your_other_relative', {questionName: 'who_are_you_separated_from', value: 'other_relative'}),
            k.questionWithChoicesAndOtherSpecify({
              name: 'why_did_the_family_memberrelative_remain_behind_in_the_area_of_origin',
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
            })
          ]
        }
      }),
      k.section({
        name: 'specific_needs',
        showIf: showIfAccept,
        questions: () => {
          const hasLimitations: ShowIf<I18n> = {
            showIfType: 'and',
            showIf: [
              {questionName: 'do_you_have_a_household_member_that_has_a_lot_of_difficulty', eq: 'neq', value: 'unable_unwilling_to_answer'},
              {questionName: 'do_you_have_a_household_member_that_has_a_lot_of_difficulty', eq: 'neq', value: 'no'},
            ]
          }
          return [
            k.questionWithChoices({
              name: 'do_you_have_a_household_member_that_has_a_lot_of_difficulty',
              defineExclusiveOption: ['unable_unwilling_to_answer', 'no'],
              multiple: true,
              options: [
                'wg_seeing_even_if_wearing_glasses',
                'wg_hearing_even_if_using_a_hearing_aid',
                'wg_walking_or_climbing_steps',
                'wg_remembering_or_concentrating',
                'wg_selfcare_such_as_washing_all_over_or_dressing',
                'wg_using_your_usual_language_have_difficulty_communicating_',
                'unable_unwilling_to_answer',
                'no'
              ],
            }),
            k.question({
              type: 'INTEGER',
              name: 'how_many_persons_in_your_family_have_one_or_more_of_the_functional_limitations',
              constraint: '. > 0 and . <= ${how_many_individuals_including_the_respondent_are_in_the_household}',
              ...hasLimitations,
            }),
            k.questionWithChoices({
              name: 'do_you_or_anyone_in_your_household_have_a_disability_status_from_the_gov',
              options: ['yes', 'no'],
              ...hasLimitations,
            }),
            k.questionWithChoices({
              name: 'why',
              options: [
                'status_registration_rejected_not_meeting_the_criteria_as_per_ukrainian_procedure',
                'status_renewal_rejected',
                'delays_in_registration_process',
                'inability_to_access_registration_costly_andor_lengthy_procedure',
                'inability_to_access_registration_distance_andor_lack_of_transportation',
                'inability_to_access_registration_safety_risks',
                'unwilling_to_register',
                'unaware_ofnot_familiar_with_the_procedure',
              ]
            })
          ]
        }
      })
    ]
  }
}
