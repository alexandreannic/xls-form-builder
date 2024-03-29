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
      sections: buildForm(),
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
    const showIfHaveMinorInHH = common.showIfHaveChildInHH()
    // const showIfHaveNoMinorInHH = common.haveNoMinorInHH()
    const hasAccepted: ShowIf<I18n> = {
      showIfType: 'and',
      showIf: [{
        questionName: 'have_you_filled_out_this_form_before',
        value: 'no',
        op: '=',
      }, {
        questionName: 'present_yourself',
        value: 'yes',
        op: '=',
      }]
    }
    return [
      k.section({
        name: 'introduction',
        questions: (() => {
          return [
            common.protStaffCode(),
            common.drcOffice(),
            common.typeOfSite(),
            k.questionWithChoices({
              name: 'present_yourself',
              hint: 'hello_my_name_is',
              appearance: 'horizontal-compact',
              options: ['yes', 'no',]
            }),
            k.alertWarn({
              showIf: {questionName: 'present_yourself', value: 'no'},
              name: 'thanks_the_respondant',
            }),
            k.questionWithChoices({
              showIf: {questionName: 'present_yourself', value: 'yes'},
              appearance: 'horizontal-compact',
              name: 'have_you_filled_out_this_form_before',
              options: ['yes', 'no',]
            }),
            k.alertWarn({
              name: 'have_you_filled_out_this_form_before_yes',
              showIf: {questionName: 'have_you_filled_out_this_form_before', value: 'yes'},
            })
          ]
        })()
      }),
      k.section({
        name: 'basic_bio_data',
        ...hasAccepted,
        questions: (() => {
          return [
            common.location({
              name: 'where_are_you_current_living',
            }),
            k.questionWithChoices({
              name: 'is_your_hh_single_header',
              appearance: 'horizontal-compact',
              options: [
                'yes', 'no', 'unable_unwilling_to_answer',
              ],
            }),
            k.questionWithChoices({
              name: 'what_is_the_sex_of_the_head_of_household',
              showIf: {questionName: 'is_your_hh_single_header', value: 'yes'},
              options: common.sex,
            }),
            k.questionWithChoicesAndOtherSpecify({
              name: 'do_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household',
              multiple: true,
              defineExclusiveOption: ['unable_unwilling_to_answer', 'no_specific_needs'],
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
                'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoicesAndOtherSpecify({
              name: 'if_nonukrainian_what_is_your_citizenship',
              showIf: [{questionName: 'what_is_your_citizenship', value: 'non_ukrainian'}],
              options: [
                'country_of_origin_azerbaijan',
                'country_of_origin_moldovan',
                'country_of_origin_romanian',
                'unable_unwilling_to_answer',
              ],
            }),
            k.questionWithChoicesAndOtherSpecify({
              name: 'if_ukrainian_do_you_or_your_household_members_identify_as_member_of_a_minority_group',
              showIf: [{questionName: 'what_is_your_citizenship', value: 'ukrainian'}],
              options: [
                'no',
                'roma',
                'hungarian',
                'greek',
                'jewish',
                'tatar',
                'belorussian',
                'azerbaijan',
                'russian',
                'unable_unwilling_to_answer',
              ],
            }),
            k.questionWithChoicesAndSpecify({
              name: 'what_is_the_primary_language_spoken_in_your_household',
              options: [
                'ukrainian',
                'russian',
                'mixed_ukrainian_russian',
                'unable_unwilling_to_answer',
              ]
            }),
            k.question({
              type: 'INTEGER',
              name: 'how_many_individuals_including_the_respondent_are_in_the_household',
              constraint: '. > 0',
            }),
            common.hhComposition(),
            k.questionWithChoices({
              multiple: true,
              defineExclusiveOption: ['no', 'unable_unwilling_to_answer'],
              name: 'are_you_separated_from_any_of_your_households_members',
              options: [
                'no',
                'partner',
                'child_lt_18',
                'child_gte_18',
                'mother',
                'father',
                'other_relative',
                'unable_unwilling_to_answer',
              ]
            }),
            common.whereIsSeparatedMember('where_is_your_partner', {questionName: 'are_you_separated_from_any_of_your_households_members', value: 'partner'}),
            common.whyRemainBehind({name: 'where_is_your_partner_remain_behind_in_the_area_of_origin', ref: 'where_is_your_partner'}),
            common.whereIsSeparatedMember('where_is_your_child_lt_18', {questionName: 'are_you_separated_from_any_of_your_households_members', value: 'child_lt_18'}),
            common.whyRemainBehind({name: 'where_is_your_child_lt_18_remain_behind_in_the_area_of_origin', ref: 'where_is_your_child_lt_18'}),
            common.whereIsSeparatedMember('where_is_your_child_gte_18', {questionName: 'are_you_separated_from_any_of_your_households_members', value: 'child_gte_18'}),
            common.whyRemainBehind({name: 'where_is_your_child_gte_18_remain_behind_in_the_area_of_origin', ref: 'where_is_your_child_gte_18'}),
            common.whereIsSeparatedMember('where_is_your_mother', {questionName: 'are_you_separated_from_any_of_your_households_members', value: 'mother'}),
            common.whyRemainBehind({name: 'where_is_your_mother_remain_behind_in_the_area_of_origin', ref: 'where_is_your_mother'}),
            common.whereIsSeparatedMember('where_is_your_father', {questionName: 'are_you_separated_from_any_of_your_households_members', value: 'father'}),
            common.whyRemainBehind({name: 'where_is_your_father_remain_behind_in_the_area_of_origin', ref: 'where_is_your_father'}),
            common.whereIsSeparatedMember('where_is_your_other_relative', {questionName: 'are_you_separated_from_any_of_your_households_members', value: 'other_relative'}),
            common.whyRemainBehind({name: 'where_is_your_other_relative_remain_behind_in_the_area_of_origin', ref: 'where_is_your_other_relative'}),
          ]
        })()
      }),
      k.section({
        name: 'specific_needs',
        ...hasAccepted,
        questions: (() => {
          const hasWgqLimitations: ShowIf<I18n> = {
            showIfType: 'or',
            showIf: [
              {questionName: 'do_you_have_a_household_member_that_has_a_lot_of_difficulty', value: 'wg_seeing_even_if_wearing_glasses'},
              {questionName: 'do_you_have_a_household_member_that_has_a_lot_of_difficulty', value: 'wg_hearing_even_if_using_a_hearing_aid'},
              {questionName: 'do_you_have_a_household_member_that_has_a_lot_of_difficulty', value: 'wg_walking_or_climbing_steps'},
              {questionName: 'do_you_have_a_household_member_that_has_a_lot_of_difficulty', value: 'wg_remembering_or_concentrating'},
              {questionName: 'do_you_have_a_household_member_that_has_a_lot_of_difficulty', value: 'wg_selfcare_such_as_washing_all_over_or_dressing'},
              {questionName: 'do_you_have_a_household_member_that_has_a_lot_of_difficulty', value: 'wg_using_your_usual_language_have_difficulty_communicating_'},
            ]
          }
          return [
            k.questionWithChoices({
              name: 'do_you_have_a_household_member_that_has_a_lot_of_difficulty',
              defineExclusiveOption: ['no', 'unable_unwilling_to_answer'],
              multiple: true,
              options: [
                'no',
                'wg_seeing_even_if_wearing_glasses',
                'wg_hearing_even_if_using_a_hearing_aid',
                'wg_walking_or_climbing_steps',
                'wg_remembering_or_concentrating',
                'wg_selfcare_such_as_washing_all_over_or_dressing',
                'wg_using_your_usual_language_have_difficulty_communicating_',
                'unable_unwilling_to_answer',
              ],
            }),
            k.question({
              type: 'INTEGER',
              name: 'how_many_persons_in_your_family_have_one_or_more_of_the_functional_limitations',
              constraint: '. > 0 and . <= ${how_many_individuals_including_the_respondent_are_in_the_household}',
              constraintMessage: 'should_be_lt_total_individuals',
              ...hasWgqLimitations,
            }),
            k.questionWithChoicesAndOtherSpecify({
              ...hasWgqLimitations,
              name: 'do_you_or_anyone_in_your_household_have_a_disability_status_from_the_gov',
              defineExclusiveOption: ['no', 'unable_unwilling_to_answer'],
              options: [
                'no', 
                'status_registration_rejected_not_meeting_the_criteria_as_per_ukrainian_procedure',
                'status_renewal_rejected',
                'delays_in_registration_process',
                'inability_to_access_registration_costly_andor_lengthy_procedure',
                'inability_to_access_registration_distance_andor_lack_of_transportation',
                'inability_to_access_registration_safety_risks',
                'unwilling_to_register',
                'unaware_ofnot_familiar_with_the_procedure',
                'unable_unwilling_to_answer'
              ]
            }),
            k.questionWithChoices({
              name: 'do_you_or_anyone_in_your_household_receive_state_allowance_for_disability',
              showIf: {
                questionName: 'do_you_or_anyone_in_your_household_have_a_disability_status_from_the_gov',
                value: 'yes',
              },
              options: ['yes', 'no', 'unable_unwilling_to_answer',],
              appearance: 'horizontal-compact',
            }),
            k.questionWithChoices({
              name: 'does_the_household_host_children_who_are_relatives',
              hint: 'does_the_household_host_children_who_are_relatives_hint',
              options: ['yes', 'no', 'unable_unwilling_to_answer'],
              appearance: 'horizontal-compact',
            }),
            k.questionWithChoices({
              name: 'does_the_household_host_children_who_are_not_relatives',
              hint: 'does_the_household_host_children_who_are_not_relatives_hint',
              options: ['yes', 'no', 'unable_unwilling_to_answer'],
              appearance: 'horizontal-compact',
            })
          ]
        })()
      }),
      k.section({
        name: 'displacement_status_and_info',
        ...hasAccepted,
        questions: (() => {
          return [
            k.questionWithChoices({
              name: 'do_you_identify_as_any_of_the_following',
              options: [
                'returnee',
                'host_community_member',
                'conflict_affected_person',
                'idp',
                'unable_unwilling_to_answer',
              ]
            }),
            common.location({
              name: 'what_is_your_area_of_origin',
              showIf: {questionName: 'do_you_identify_as_any_of_the_following', value: 'idp'},
            }),
            k.questionWithChoicesAndOtherSpecify({
              name: 'why_did_you_leave_your_area_of_origin',
              showIf: {questionName: 'do_you_identify_as_any_of_the_following', value: 'idp'},
              options: [
                'shelling_attacks_on_civilians',
                'exposure_to_uxoslandmines',
                'destruction_or_damage_of_housing_land_andor_property_due_to_conflict',
                'occupation_of_property',
                'criminality',
                'lack_of_access_to_safe_and_dignified_shelter',
                'lack_of_access_to_essential_services',
                'lack_of_access_to_livelihoods_employment_and_economic_opportunities',
                'infrastructure_damagedestruction',
                'seeking_family_reunification',
                'fear_of_conscription',
                'unable_unwilling_to_answer',
              ]
            }),
            k.question({
              showIf: {questionName: 'do_you_identify_as_any_of_the_following', value: 'idp'},
              name: 'when_did_you_leave_your_area_of_origin',
              hint: 'insert_approximate',
              type: 'DATE',
              appearance: 'month-year',
              constraint: '. < today()',
              constraintMessage: 'date_should_be_past',
            }),
            k.questionWithChoicesAndOtherSpecify({
              showIf: {questionName: 'do_you_identify_as_any_of_the_following', value: 'idp'},
              multiple: true,
              name: 'how_did_you_travel_to_your_displacement_location',
              options: [
                'volunteer_and_or_Ukrainian_NGO_supported_return',
                'uN_INGO_supported_return',
                'government_supported_return',
                'host_communitys_local_authorities_supported_return',
                'own_means',
                'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoices({
              showIf: {questionName: 'do_you_identify_as_any_of_the_following', value: 'idp'},
              name: 'have_you_received_any_form_of_compensation_for_leaving_your_area_of_origin',
              appearance: 'horizontal-compact',
              options: [
                'yes',
                'no',
              ]
            }),
            k.questionWithChoicesAndOtherSpecify({
              showIf: {questionName: 'do_you_identify_as_any_of_the_following', value: 'idp'},
              name: 'did_you_or_any_member_of_your_household_on_your_displacement_journey_experience_safety_or_security_concerns',
              defineExclusiveOption: ['none', 'unable_unwilling_to_answer'],
              options: [
                'looting_robbery',
                'physical_assault',
                'abduction',
                'arbitrary_detention',
                'shelling_or_missile_attacks',
                'harassment_at_checkpoints',
                'movement_restrictions',
                'gbv_incident',
                'extortion',
                'hate_speech',
                'none',
                'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoices({
              showIf: {questionName: 'do_you_identify_as_any_of_the_following', value: 'idp'},
              name: 'have_you_been_displaced_prior_to_your_current_displacement',
              options: [
                'yes_after_2014',
                'yes_after_february_24_2022',
                'no_first_displacement',
                'unable_unwilling_to_answer',
              ]
            }),
            k.calculate({
              name: 'get_tag_if_is_returnee',
              calculation: `if(\${do_you_identify_as_any_of_the_following}='returnee', 'returnee', 'all') `,
            }),
            k.questionWithChoices({
              name: 'what_are_your_households_intentions_in_terms_of_place_of_residence_in_the_next_3_months',
              choiceFilter: `tag=\${get_tag_if_is_returnee} or tag1=\${get_tag_if_is_returnee}`,
              options: [
                {name: 'return_to_the_area_of_origin', tag: 'all'},
                {name: 'relocate_to_another_area_in_ukraine', tag: 'all', tag1: 'returnee'},
                {name: 'relocate_to_a_country_outside_of_ukraine', tag: 'all', tag1: 'returnee'},
                {name: 'integrate_into_the_local_community_of_current_place_of_residence', tag: 'all', tag1: 'returnee'},
                {name: 'unable_unwilling_to_answer', tag: 'all', tag1: 'returnee'},
              ]
            }),
            k.questionWithChoices({
              showIf: {questionName: 'what_are_your_households_intentions_in_terms_of_place_of_residence_in_the_next_3_months', value: 'return_to_the_area_of_origin'},
              name: 'what_would_be_the_deciding_factor_in_your_return_to_your_area_of_origin',
              multiple: true,
              options: [
                'improvement_in_security_situation',
                'cessation_of_hostilities',
                'government_regains_territory_from_ngca',
                'increased_restored_service_availability_in_the_area_of_origin',
                'repaired_restored_infrastructure_including_heating',
                'repaired_housing',
                'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoicesAndOtherSpecify({
              showIf: [
                {questionName: 'what_are_your_households_intentions_in_terms_of_place_of_residence_in_the_next_3_months', value: 'relocate_to_another_area_in_ukraine'},
                {questionName: 'what_are_your_households_intentions_in_terms_of_place_of_residence_in_the_next_3_months', value: 'relocate_to_a_country_outside_of_ukraine'},
              ],
              name: 'why_are_planning_to_relocate_from_your_current_place_of_residence',
              options: [
                'social_tensions_and_conflict_with_host_community',
                'insecurity_conflict',
                'lack_of_access_to_livelihoods_employment_and_economic_opportunities',
                'lack_of_access_to_essential_services_health',
                'lack_of_access_to_safe_and_dignified_shelter',
                'seek_family_reunification',
                'seek_international_legal_protection',
                'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoices({
              showIf: {questionName: 'do_you_identify_as_any_of_the_following', value: 'returnee'},
              name: 'are_you',
              options: [
                'idp_returnee',
                'refugee_returnee',
                'unable_unwilling_to_answer',
              ],
            }),
            k.question({
              type: 'DATE',
              appearance: 'month-year',
              hint: 'insert_approximate',
              showIf: {questionName: 'do_you_identify_as_any_of_the_following', value: 'returnee'},
              name: 'when_did_you_first_leave_your_area_of_origin',
              constraint: '. < today()',
              constraintMessage: 'date_should_be_past',
            }),
            k.question({
              showIf: {questionName: 'do_you_identify_as_any_of_the_following', value: 'returnee'},
              hint: 'insert_approximate',
              name: 'when_did_you_return_to_your_area_of_origin',
              type: 'DATE',
              appearance: 'month-year',
              constraint: '. < today()',
              constraintMessage: 'date_should_be_past',
            }),
            k.questionWithChoicesAndOtherSpecify({
              multiple: true,
              showIf: {questionName: 'do_you_identify_as_any_of_the_following', value: 'returnee'},
              name: 'was_your_movement_to_return_to_your_area_of_origin_supported_or_facilitated_by_any_of_the_following',
              options: [
                'un',
                'ngo',
                'volunteer_groups',
                'with_support_from_relatives_and_or_friends',
                'ukrainian_government_or_local_authorities',
                'government_or_local_authorities_from_the_host_community',
                'own_means',
                'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoicesAndOtherSpecify({
              multiple: true,
              name: 'why_did_you_decide_to_return_to_your_area_of_origin',
              showIf: {questionName: 'do_you_identify_as_any_of_the_following', value: 'returnee'},
              defineExclusiveOption: 'unable_unwilling_to_answer',
              options: [
                'improved_security_in_area_of_origin',
                'insecurity_conflict_in_area_of_displacement',
                'social_tensions_and_conflict_with_host_community_in_area_of_displacement',
                'eviction_eviction_threats_in_area_of_displacement',
                'lack_of_access_to_essential_services_in_area_of_displacement',
                'lack_of_access_to_livelihooods_employment_and_economic_opportunities_in_area_of_displacement',
                'discrimination_and_or_barriers_in_accessing_services_in_area_of_displacement',
                'seeking_family_reunification_in_area_of_origin',
                'unable_unwilling_to_answer'
              ]
            })
          ]
        })(),
      }),
      k.section({
        ...hasAccepted,
        name: 'registration_documentation',
        questions: (() => {
          return [
            k.questionWithChoices({
              multiple: true,
              showIf: {questionName: 'what_is_your_citizenship', value: 'non_ukrainian'},
              name: 'as_nonUkrainian_do_you_have_documentation',
              defineExclusiveOption: 'no',
              options: [
                'yes_refugee_status',
                'yes_asylum_request_registrated',
                'yes_residence_permit',
                'no',
                'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoices({
              showIf: {questionName: 'what_is_your_citizenship', value: 'stateless'},
              name: 'as_stateless_person_household_do_you_have_a_stateless_registration_certificate',
              options: [
                'yes',
                'no',
                'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoices({
              showIf: {questionName: 'do_you_identify_as_any_of_the_following', value: 'idp'},
              name: 'are_you_and_your_hh_members_registered_as_idps',
              options: [
                'yes_all_of_them',
                'yes_some_of_them',
                'no',
                'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoices({
              name: 'do_you_have_any_of_the_following',
              showIf: [
                {questionName: 'are_you_and_your_hh_members_registered_as_idps', value: 'yes_all_of_them'},
                {questionName: 'are_you_and_your_hh_members_registered_as_idps', value: 'yes_some_of_them'},
              ],
              showIfType: 'or',
              multiple: true,
              options: [
                'idp_certificate',
                'idp_eregistration',
                'no_proof_of_registration',
                'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoices({
              name: 'do_you_and_your_hh_members_receive_the_idp_allowance',
              appearance: 'horizontal-compact',
              showIf: [
                {questionName: 'are_you_and_your_hh_members_registered_as_idps', value: 'yes_all_of_them'},
                {questionName: 'are_you_and_your_hh_members_registered_as_idps', value: 'yes_some_of_them'},
              ],
              showIfType: 'or',
              options: ['yes', 'no', 'unable_unwilling_to_answer']
            }),
            k.questionWithChoicesAndOtherSpecify({
              showIf: {questionName: 'do_you_and_your_hh_members_receive_the_idp_allowance', value: 'no'},
              name: 'why_they_do_not_receive',
              options: [
                'delays_in_allowances_payment',
                'change_of_place_of_residence',
                'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoicesAndOtherSpecify({
              name: 'why_are_you_not_registered',
              showIf: [
                {questionName: 'are_you_and_your_hh_members_registered_as_idps', value: 'no'},
                {questionName: 'are_you_and_your_hh_members_registered_as_idps', value: 'yes_some_of_them'},
              ],
              showIfType: 'or',
              options: [
                'registration_was_rejected',
                'delays_in_registration_process',
                'unaware_of_not_familiar_with_the_registration_process',
                'unable_to_access_registration_center_',
                'costly_process',
                'not_entitled_to_register_as_an_idp',
                'fear_of_conscription',
                'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoicesAndOtherSpecify({
              name: 'why_not_registered',
              showIf: [
                {questionName: 'why_are_you_not_registered', value: 'registration_was_rejected'},
                {questionName: 'why_are_you_not_registered', value: 'not_entitled_to_register_as_an_idp'},
              ],
              options: [
                'multiple_displacements',
                'lack_of_personal_documentation',
                'displacement_area_not_falling_under_governmental_criteria_for_idp_registration',
                'displacement_area_too_close_from_area_of_origin',
                'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoices({
              showIf: {questionName: 'what_is_your_citizenship', op: '=', value: 'ukrainian'},
              name: 'are_all_members_of_your_household_in_possession_of_personal_documentation_including_tin',
              appearance: 'horizontal-compact',
              options: ['yes', 'no', 'unable_unwilling_to_answer']
            }),
            k.question({
              type: 'INTEGER',
              name: 'how_many_household_members_lack_personal_documentation',
              showIf: {questionName: 'are_all_members_of_your_household_in_possession_of_personal_documentation_including_tin', value: 'no',}
            }),
            k.questionWithChoicesAndOtherSpecify({
              name: 'what_housing_land_and_property_documents_do_you_lack',
              defineExclusiveOption: ['none', 'unable_unwilling_to_answer'],
              multiple: true,
              options: [
                'property_ownership_for_apartment_house',
                'property_ownership_certificate_for_land',
                'lease_agreement_for_house_apartment',
                'bti_bureau_of_technical_inventory_certificate',
                'construction_stage_substituted_with_bti_certificate_following_completion_of_construction',
                'death_certificate_of_predecessor',
                'inheritance_will',
                'inheritance_certificate',
                'document_issues_by_police_state_emergency_service_proving_that_the_house_was_damaged_destroyed_for_ukrainian_state_control_areas',
                'document_issues_by_local_self_government_proving_that_the_house_was_damaged_destroyed',
                'cost_estimation_certificate_state_commission_issued_when_personal_request_is_made',
                'death_declaration_certificate_by_ambulance_or_police_of_predecessor',
                'informatsiyna_dovidka_informational_extract_on_damaged_property',
                'none',
                'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoicesAndOtherSpecify({
              multiple: true,
              defineExclusiveOption: ['no', 'unable_unwilling_to_answer',],
              name: 'have_you_experienced_any_barriers_in_obtaining_or_accessing_identity_documentation_and_or_hlp_documentation',
              options: [
                'length_of_administrative_procedures',
                'cost_of_administrative_procedures',
                'lack_of_information',
                'distance_or_cost_of_transportation',
                'lack_of_devices_or_internet_connectivity_to_access_online_procedure',
                'lack_of_legal_support_to_access_the_procedure',
                'inability_of_the_service_to_provide_required_documentation',
                'discrimination',
                'distrust_of_public_institutions_and_authorities',
                'no', 
                'unable_unwilling_to_answer',
              ]
            })
          ]
        })()
      }),
      k.section({
        name: 'safety_n_movement',
        ...hasAccepted,
        questions: (() => {
          return [
            common.rating({name: 'please_rate_your_sense_of_safety_in_this_location'}),
            k.questionWithChoicesAndOtherSpecify({
              multiple: true,
              name: 'what_are_the_main_factors_that_make_this_location_feel_unsafe',
              defineExclusiveOption: 'unable_unwilling_to_answer',
              showIf: [
                {questionName: 'please_rate_your_sense_of_safety_in_this_location', value: '_1_very_unsafe'},
                {questionName: 'please_rate_your_sense_of_safety_in_this_location', value: '_2_unsafe'},
              ],
              options: [
                'unable_unwilling_to_answer',
                'presence_of_armed_or_security_actors',
                'bombardment_shelling_or_threat_of_shelling',
                'fighting_between_armed_or_security_actors',
                'abusive_behavior_of_armed_or_security_actors_against_the_civilian_population',
                'landmines_or_uxos_contamination',
                'criminality',
                'intercommunity_tensions',
                'risks_of_eviction',
                'risks_of_arbitrary_arrest_detention',
                'risks_of_abduction_or_enforced_disappearance',
                'risks_of_sexual_violence_and_exploitation',
                'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoices({
              name: 'is_this_area_contaminated',
              hint: 'is_this_area_contaminated_hint',
              appearance: 'horizontal-compact',
              options: [
                'yes', 'no', 'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoices({
              name: 'do_you_know_what_number_to_call_if_coming_across_an_explosive_ordnance',
              appearance: 'horizontal-compact',
              showIf: {questionName: 'is_this_area_contaminated', value: 'yes'},
              options: [
                'yes', 'no', 'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoices({
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
            }),
            k.questionWithChoicesAndOtherSpecify({
              name: 'what_factors_are_affecting_the_relationship_between_communities_in_this_location',
              showIf: [
                {questionName: 'how_would_you_describe_the_relationship_between_member_of_the_host_community', value: '_1_very_unsafe'},
                {questionName: 'how_would_you_describe_the_relationship_between_member_of_the_host_community', value: '_2_unsafe'},
              ],
              showIfType: 'or',
              options: [
                'language_difference',
                'tension_over_access_to_humanitarian_assistance',
                'tension_over_access_to_services_and_or_employment_opportunities',
                'tension_over_conscription_procedures',
                'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoicesAndOtherSpecify({
              name: 'have_you_or_your_household_members_experienced_incidents_with_host_community_members_idps_returnees',
              showIfType: 'or',
              multiple: true,
              defineExclusiveOption: 'no_incident_experienced',
              showIf: [
                {questionName: 'how_would_you_describe_the_relationship_between_member_of_the_host_community', value: '_1_very_unsafe'},
                {questionName: 'how_would_you_describe_the_relationship_between_member_of_the_host_community', value: '_2_unsafe'},
              ],
              options: [
                'harassment_violence_or_abuse',
                'discrimination_over_access_to_basic_services',
                'restrictions_on_participation_in_public_affairs_and_community_events',
                'dispute_over_access_to_humanitarian_assistance',
                'dispute_or_conflict_over_land_shelter_property',
                'dispute_or_conflict_over_livelihood_or_other_financial_resources',
                'dispute_or_conflict_over_ethic_political_or_social_issues',
                'no_incident_experienced',
                'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoicesAndOtherSpecify({
              name: 'do_you_or_your_household_members_experience_any_barriers_to_movements_in_and_around_the_area',
              defineExclusiveOption: ['no', 'unable_unwilling_to_answer'],
              options: [
                'fear_of_conscription_including_selfrestriction_of_movement',
                'unable_to_leave_the_country_due_to_government_restrictions_related_to_conscription',
                'lack_of_documentation',
                'armed_conflict_including_shelling',
                'presence_of_explosive_ordnance',
                'risks_of_sexual_violence_and_exploitation',
                'discrimination',
                'intercommunity_tensions',
                'lack_of_transportationfinancial_resources_to_pay_transportation',
                'reduced_mobility_linked_with_health_issues_or_disability',
                'no', 
                'unable_unwilling_to_answer'
              ]
            })
          ]
        })()
      }),
      k.section({
        name: 'violence_coercion_n_deprivation',
        ...hasAccepted,
        questions: (() => {
          return [
            k.calculate({
              name: 'get_tag_if_is_displaced',
              calculation: `if(\${do_you_identify_as_any_of_the_following}='idp' or \${do_you_identify_as_any_of_the_following}='returnee', 'all', 'nondisplaced') `,
            }),
            common.incidentsForm({
              name: 'has_any_adult_male_member_of_your_household_experienced_any_form_of_violence_within_the_last_6_months',
              ...common.showIfHaveAdultInHHBySex('male'),
            }),
            common.incidentsForm({
              name: 'has_any_adult_female_member_of_your_household_experienced_any_protectionright_violation_incident',
              ...common.showIfHaveAdultInHHBySex('female'),
            }),
            common.incidentsForm({
              name: 'has_any_boy_member_of_your_household_experienced_any_protectionright_violation_incident',
              ...common.showIfHaveChildInHHBySex('male'),
            }),
            common.incidentsForm({
              name: 'has_any_girl_member_of_your_household_experienced_any_protectionright_violation_incident',
              ...common.showIfHaveChildInHHBySex('female'),
            }),
            common.incidentsForm({
              name: 'has_any_member_of_your_household_experienced_any_protectionright_violation_incident',
            }),
            k.questionWithChoices({
              name: 'do_you_or_members_of_your_household_experience_discrimination_or_stigmatization_in_your_current_area_of_residence',
              appearance: 'horizontal-compact',
              options: [
                'yes', 'no', 'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoicesAndOtherSpecify({
              name: 'on_what_ground',
              multiple: true,
              appearance: 'minimal',
              showIf: {questionName: 'do_you_or_members_of_your_household_experience_discrimination_or_stigmatization_in_your_current_area_of_residence', value: 'yes'},
              defineExclusiveOption: 'unable_unwilling_to_answer',
              options: [
                'age',
                'gender',
                'disability',
                'nationality',
                'area_of_origin',
                'religion',
                'sexual_orientation',
                'political_opinions',
                'medical_condition',
                'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoicesAndOtherSpecify({
              name: 'is_are_any_adult_memberof_your_household_displaying_any_of_the_following_signs',
              appearance: 'minimal',
              ...common.showIfHaveAdultInHH(),
              multiple: true,
              defineExclusiveOption: ['unable_unwilling_to_answer', 'no_sign_of_psychological_distress'],
              options: [
                'feeling_sad_depressed_tired',
                'withdrawal_isolation',
                'anxiety',
                'anger',
                'fear',
                'agitation_moodiness',
                'careless',
                'feeling_hopeless',
                'no_sign_of_psychological_distress',
                'unable_unwilling_to_answer'
              ]
            }),
            k.questionWithChoicesAndOtherSpecify({
              name: 'is_are_any_child_member_of_your_household_displaying_any_of_the_following_signs',
              ...common.showIfHaveChildInHH(),
              appearance: 'minimal',
              multiple: true,
              defineExclusiveOption: ['unable_unwilling_to_answer', 'no_sign_of_psychological_distress'],
              options: [
                'feeling_sad_depressed_tired',
                'withdrawal_isolation',
                'anxiety',
                'anger',
                'fear',
                'agitation_moodiness',
                'careless',
                'feeling_hopeless',
                'no_sign_of_psychological_distress',
                'unable_unwilling_to_answer'
              ]
            }),
            k.questionWithChoices({
              name: 'do_household_members_experiencing_distress_have_access_to_relevant_care_and_services',
              appearance: 'horizontal-compact',
              showIf: [
                {questionName: 'is_are_any_adult_memberof_your_household_displaying_any_of_the_following_signs', op: '=', value: 'feeling_sad_depressed_tired'},
                {questionName: 'is_are_any_adult_memberof_your_household_displaying_any_of_the_following_signs', op: '=', value: 'withdrawal_isolation'},
                {questionName: 'is_are_any_adult_memberof_your_household_displaying_any_of_the_following_signs', op: '=', value: 'anxiety'},
                {questionName: 'is_are_any_adult_memberof_your_household_displaying_any_of_the_following_signs', op: '=', value: 'anger'},
                {questionName: 'is_are_any_adult_memberof_your_household_displaying_any_of_the_following_signs', op: '=', value: 'fear'},
                {questionName: 'is_are_any_adult_memberof_your_household_displaying_any_of_the_following_signs', op: '=', value: 'agitation_moodiness'},
                {questionName: 'is_are_any_adult_memberof_your_household_displaying_any_of_the_following_signs', op: '=', value: 'careless'},
                {questionName: 'is_are_any_adult_memberof_your_household_displaying_any_of_the_following_signs', op: '=', value: 'feeling_hopeless'},
                {questionName: 'is_are_any_child_member_of_your_household_displaying_any_of_the_following_signs', op: '=', value: 'feeling_sad_depressed_tired'},
                {questionName: 'is_are_any_child_member_of_your_household_displaying_any_of_the_following_signs', op: '=', value: 'withdrawal_isolation'},
                {questionName: 'is_are_any_child_member_of_your_household_displaying_any_of_the_following_signs', op: '=', value: 'anxiety'},
                {questionName: 'is_are_any_child_member_of_your_household_displaying_any_of_the_following_signs', op: '=', value: 'anger'},
                {questionName: 'is_are_any_child_member_of_your_household_displaying_any_of_the_following_signs', op: '=', value: 'fear'},
                {questionName: 'is_are_any_child_member_of_your_household_displaying_any_of_the_following_signs', op: '=', value: 'agitation_moodiness'},
                {questionName: 'is_are_any_child_member_of_your_household_displaying_any_of_the_following_signs', op: '=', value: 'careless'},
                {questionName: 'is_are_any_child_member_of_your_household_displaying_any_of_the_following_signs', op: '=', value: 'feeling_hopeless'},
              ],
              options: [
                'yes', 'no', 'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoicesAndOtherSpecify({
              name: 'what_are_the_barriers_to_access_services',
              showIf: {questionName: 'do_household_members_experiencing_distress_have_access_to_relevant_care_and_services', value: 'no'},
              multiple: true,
              options: [
                'lack_of_available_services',
                'lack_of_information_about_available_services',
                'distance_lack_of_transportation_means_to_access_services',
                'cost_associated_with_transportation_to_the_services',
                'cost_of_the_services_provided_medication',
                'language_barriers',
                'requirement_for_civil_documentation',
                'poor_quality_of_the_services_provided',
                'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoicesAndOtherSpecify({
              name: 'what_do_you_think_feel_are_the_major_stress_factors_for_you_and_your_household_members',
              defineExclusiveOption: 'unable_unwilling_to_answer',
              options: [
                'displacement_related_stress',
                'fear_of_being_killed_or_injured_by_armed_violence',
                'fear_of_property_being_damaged_or_destroyed_by_armed_violence',
                'fear_of_being_sexually_assaulted',
                'missing_family_members',
                'lack_of_access_to_basic_services',
                'lack_of_access_to_employment_opportunities',
                'lack_of_access_to_specialized_medical_services',
                'stigmatization_discrimination',
                'worries_about_the_children',
                'worries_about_the_future',
                'unable_unwilling_to_answer',
              ]
            })
          ]
        })(),
      }),
      k.section({
        name: 'coping_strategies',
        ...hasAccepted,
        questions: (() => {
          return [
            k.questionWithChoicesAndOtherSpecify({
              name: 'what_are_the_main_sources_of_income_of_your_household',
              defineExclusiveOption: 'unable_unwilling_to_answer',
              multiple: true,
              options: [
                'employment',
                'allowance',
                'humanitarian_assistance',
                'no_income',
                'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoicesAndOtherSpecify({
              name: 'what_type_of_allowances_do_you_receive',
              multiple: true,
              showIf: {questionName: 'what_are_the_main_sources_of_income_of_your_household', value: 'allowance'},
              defineExclusiveOption: 'none',
              options: [
                'idp_allowance_from_the_government',
                'pension_for_elderly_people',
                'pension_for_disability',
                'pension_for_three_or_more_children_in_the_household',
                'compensation_for_the_lost_damaged_house',
                'cash_from_humanitarians',
                'evacuation_compensation',
                'none',
                'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoices({
              optional: true,
              hint: 'leave_blank_if_none',
              appearance: 'likert',
              name: 'what_is_the_average_month_income_per_household',
              options: [
                'up_to_3000_UAH',
                'between_3001_6000_UAH',
                'between_6001_9000_UAH',
                'between_9001_12000_UAH',
                'between_12001_15000_UAH',
                'more_than_15000_UAH',
                'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoices({
              name: 'are_there_gaps_in_meeting_your_basic_needs',
              hint: 'are_there_gaps_in_meeting_your_basic_needs_hint',
              appearance: 'horizontal-compact',
              options: [
                'yes_a_lot',
                'yes_somewhat',
                'no',
                'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoicesAndOtherSpecify({
              name: 'what_are_the_strategies_that_your_household_uses_to_cope_with_these_challenges',
              showIf: [
                {questionName: 'are_there_gaps_in_meeting_your_basic_needs', value: 'yes_a_lot'},
                {questionName: 'are_there_gaps_in_meeting_your_basic_needs', value: 'yes_somewhat'},
              ],
              defineExclusiveOption: ['no_coping_strategy', 'unable_unwilling_to_answer'],
              options: [
                'spending_savings',
                'selling_off_household_productive_assets',
                'selling_off_received_humanitarian_assistance',
                'selling_off_housing_and_or_land',
                'borrowing_money_',
                'depending_on_support_from_family_external_assistance',
                'reducing_expenses_on_food_health_and_education',
                'begging',
                'engaging_in_dangerous_or_exploitative_work',
                'no_coping_strategy',
                'unable_unwilling_to_answer',
              ]
            })
          ]
        })()
      }),
      // k.section({
      //   name: 'access_to_education',
      //   showIfType: 'and',
      //   showIf: [showIfHaveNoMinorInHH, hasAccepted],
      //   questions: [
      //     k.alertInfo({
      //       name: 'you_indicate_no_children_in_hh',
      //     })
      //   ]
      // }),
      k.section({
        name: 'access_to_education',
        showIfType: 'and',
        showIf: [showIfHaveMinorInHH, hasAccepted],
        questions: (() => {
          return [
            k.questionWithChoices({
              name: 'are_schoolaged_children_in_your_household_regularly_attending_primary_or_secondary_education',
              options: [
                'yes_all_of_them',
                'yes_some_of_them',
                'no_none_of_them',
                'no_school_aged_child_in_the_household',
                'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoices({
              name: 'is_it',
              showIfType: 'or',
              showIf: [
                {questionName: 'are_schoolaged_children_in_your_household_regularly_attending_primary_or_secondary_education', value: 'yes_all_of_them'},
                {questionName: 'are_schoolaged_children_in_your_household_regularly_attending_primary_or_secondary_education', value: 'yes_some_of_them'},
              ],
              options: [
                'online_education',
                'education_in_school',
                'hybrid_mode',
                'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoicesAndOtherSpecify({
              name: 'what_are_the_reasons_preventing_children_in_your_household_from_regularly_attending_education_services',
              showIfType: 'or',
              showIf: [
                {questionName: 'are_schoolaged_children_in_your_household_regularly_attending_primary_or_secondary_education', value: 'yes_some_of_them'},
                {questionName: 'are_schoolaged_children_in_your_household_regularly_attending_primary_or_secondary_education', value: 'no_none_of_them'},
              ],
              multiple: true,
              appearance: 'minimal',
              defineExclusiveOption: 'unable_unwilling_to_answer',
              options: [
                'newly_displaced',
                'no_available_school',
                'lack_of_internet_connectivity_to_attend_online_school',
                'safety_risks_associated_with_access_to_presence_at_school_',
                'distance_lack_of_transportation_means_to_access_the_service',
                'cost_associated_with_transportation_to_school',
                'cost_associated_with_online_education_laptop_internet',
                'lack_of_personal_documentation',
                'lack_of_guardianship',
                'discrimination_restriction_of_access',
                'lack_of_specialized_education_services_including_for_children_with_disabilities',
                'cost_of_specialized_materials_including_for_children_with_disabilities',
                'language_barriers',
                'unable_unwilling_to_answer',
              ]
            })
          ]
        })()
      }),
      k.section({
        name: 'housing',
        ...hasAccepted,
        questions: (() => {
          const hasAccommodation: ShowIfCondition<I18n>[] = [{
            questionName: 'what_is_your_current_housing_structure',
            op: '!=',
            value: 'no_shelter',
          }]
          return [
            k.questionWithChoices({
              name: 'what_is_your_current_housing_structure',
              options: [
                'house_apartment',
                'room_in_private_house',
                'collective_shelter_',
                'privatelyowned_collective_shelter',
                'no_shelter',
                'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoicesAndOtherSpecify({
              name: 'what_is_the_tenure_status_of_your_accommodation',
              ...hasAccommodation,
              options: [
                'accommodation_with_host_family',
                'public_building_property_no_fees',
                'public_building_property',
                'renting_private_accommodation',
                'owning_private_accommodation',
                'squatting_private_property_without_permission',
                'living_on_the_streets',
                'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoices({
              name: 'do_you_have_formal_documents_to_stay_in_your_accommodation',
              showIf: [
                {questionName: 'what_is_the_tenure_status_of_your_accommodation', value: 'public_building_property'},
                {questionName: 'what_is_the_tenure_status_of_your_accommodation', value: 'renting_private_accommodation'},
              ],
              options: [
                'yes_i_have_a_rental_agreement',
                'yes_i_have_state_assigned_shelter_with_proving_documents',
                'verbal_agreement',
                'no_formal_documents',
                'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoices({
              showIf: hasAccommodation,
              name: 'what_is_the_general_condition_of_your_accommodation',
              options: [
                'sound_condition',
                'partially_damaged_destroyed',
                'severely_damaged_destroyed',
                'unfinished',
                'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoices({
              name: 'how_long_can_you_stay_in_your_current_accommodation',
              showIf: hasAccommodation,
              options: [
                'unlimited_time',
                'less_than_one_month',
                '_1_3_months',
                '_3_6_months',
                'all_long_as_rent_is_paid',
                'at_iminent_risk_of_eviction',
                'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoices({
              name: 'what_are_your_main_concerns_regarding_your_accommodation',
              multiple: true,
              defineExclusiveOption: ['none', 'unable_unwilling_to_answer'],
              showIf: hasAccommodation,
              options: [
                'risk_of_eviction',
                'shelter_condition',
                'overcrowded',
                'lack_of_privacy',
                'lack_of_financial_resources_to_afford_rental_or_utility_costs',
                'lack_of_wash_facilities',
                'lack_of_heating_system',
                'lack_gas_and_electricity',
                'lack_of_connectivity',
                'security_and_safety_risks_',
                'lack_of_financial_compensation_or_rehabilitation_for_damage_or_destruction_of_housing',
                'lack_or_loss_of_ownership_documentation',
                'none',
                'unable_unwilling_to_answer',
              ]
            })
          ]
        })(),
      }),
      k.section({
        name: 'access_to_health',
        ...hasAccepted,
        questions: (() => {
          return [
            k.questionWithChoices({
              name: 'do_you_have_access_to_health_care_in_your_current_location',
              options: [
                'yes',
                'partial_access',
                'no_access',
                'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoicesAndOtherSpecify({
              name: 'what_are_the_barriers_to_accessing_health_services',
              showIf: [
                {questionName: 'do_you_have_access_to_health_care_in_your_current_location', value: 'partial_access'},
                {questionName: 'do_you_have_access_to_health_care_in_your_current_location', value: 'no_access'},
              ],
              options: [
                'lack_of_available_health_facility',
                'lack_of_specialized_health_care_services',
                'safety_risks_associated_with_access_to_presence_at_health_facility',
                'distance_lack_of_transportation_means_to_access_facilities',
                'cost_associated_with_transportation_to_facilities',
                'cost_of_the_services_provided_medication',
                'requirement_for_civil_documentation',
                'lack_shortage_of_medication',
                'discrimination_restriction_of_access',
                'not_accessible_for_persons_with_disabilities',
                'long_waiting_time',
                'language_barriers',
                'unable_unwilling_to_answer',
              ]
            })
          ]
        })()
      }),
      k.section({
        name: 'sec_priority_needs',
        ...hasAccepted,
        questions: (() => {
          return [
            common.priorityNeeds({name: 'what_is_your_1_priority'}),
            common.priorityNeeds({name: 'what_is_your_2_priority'}),
            common.priorityNeeds({name: 'what_is_your_3_priority'}),
            k.title({name: 'thanks'}),
          ]
        })()
      }),
      k.section({
        name: 'sec_additional_information',
        ...hasAccepted,
        questions: (() => {
          return [
            k.question({type: 'TEXTAREA', name: 'additional_information_shared_by_respondent', optional: true}),
            k.question({type: 'TEXTAREA', name: 'comments_observations_of_the_protection_monitor', optional: true}),
          ]
        })()
      }),
      k.section({
        name: 'sec_followup',
        ...hasAccepted,
        questions: [
          k.questionWithChoices({
            name: 'need_for_assistance',
            options: ['yes', 'no']
          })
        ]
      })
    ]
  }
}
