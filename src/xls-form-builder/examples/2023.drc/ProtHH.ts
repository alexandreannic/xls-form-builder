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
          const hasWgqLimitations: ShowIf<I18n> = {
            showIfType: 'and',
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
              constraintMessage: 'should_be_lt_total_individuals',
              ...hasWgqLimitations,
            }),
            k.questionWithChoices({
              name: 'do_you_or_anyone_in_your_household_have_a_disability_status_from_the_gov',
              options: ['yes', 'no'],
              appearance: 'horizontal-compact',
              ...hasWgqLimitations,
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
            }),
            k.questionWithChoices({
              name: 'do_you_or_anyone_in_your_household_receive_state_allowance_for_disability',
              ...hasWgqLimitations,
              options: [
                'yes',
                'no',
                'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoices({
              name: 'Does_the_household_host_children_who_are_not_relatives',
              options: ['yes', 'no', 'unable_unwilling_to_answer'],
              appearance: 'horizontal-compact',
            })
          ]
        }
      }),
      k.section({
        name: 'displacement_status_and_info',
        showIf: showIfAccept,
        questions: () => {
          return [
            k.questionWithChoices({
              name: 'do_you_identify_as_any_of_the_following',
              options: [
                'returnee',
                'host_community_member',
                'conflict_affected_person',
                'idp',
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
              ]
            }),
            k.question({
              showIf: {questionName: 'do_you_identify_as_any_of_the_following', value: 'idp'},
              name: 'when_did_you_leave_your_area_of_origin',
              type: 'DATE',
            }),
            k.questionWithChoicesAndOtherSpecify({
              showIf: {questionName: 'do_you_identify_as_any_of_the_following', value: 'idp'},
              multiple: true,
              name: 'how_did_you_travel_to_your_displacement_location',
              options: [
                'volunteer_and_or_ukrainian_ngo_supported_evacuation',
                'un_icrc_ingo_supported_evacuation',
                'private_vehicle_train_bus',
                'government_evacuation_train_bus',
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
                'unable_unwilling_to_answer',
                'none',
              ]
            }),
            k.questionWithChoices({
              showIf: {questionName: 'do_you_identify_as_any_of_the_following', value: 'idp'},
              name: 'have_you_received_any_form_of_compensation_for_leaving_your_area_of_origin',
              options: [
                'yes',
                'no',
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
            k.questionWithChoices({
              showIf: {questionName: 'do_you_identify_as_any_of_the_following', value: 'idp'},
              name: 'what_are_your_households_intentions_in_terms_of_place_of_residence_in_the_next_3_months',
              options: [
                'return_to_the_area_of_origin',
                'relocate_to_another_area_in_ukraine',
                'relocate_to_a_country_outside_of_ukraine',
                'integrate_into_the_local_community_of_current_place_of_residence',
                'unable_unwilling_to_answer',
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
              ],
            }),
            k.question({
              type: 'DATE',
              name: 'when_did_you_first_leave_your_area_of_origin',
            }),
            k.question({
              showIf: {questionName: 'do_you_identify_as_any_of_the_following', value: 'returnee'},
              name: 'when_did_you_return_to_your_area_of_origin',
              type: 'DATE',
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
              ]
            }),
            k.questionWithChoicesAndOtherSpecify({
              multiple: true,
              name: 'why_did_you_decide_to_return_to_your_area_of_origin',
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
        },
      }),
      k.section({
        showIf: showIfAccept,
        name: 'registration_documentation',
        questions: () => {
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
              name: 'as_idp_are_you_and_your_hh_members_registered_as_idps',
              options: [
                'yes_all_of_them',
                'yes_some_of_them',
                'no',
              ]
            }),
            k.questionWithChoices({
              name: 'do_you_have_any_of_the_following',
              showIf: [
                {questionName: 'as_idp_are_you_and_your_hh_members_registered_as_idps', value: 'yes_all_of_them'},
                {questionName: 'as_idp_are_you_and_your_hh_members_registered_as_idps', value: 'yes_some_of_them'},
              ],
              showIfType: 'or',
              multiple: true,
              options: [
                'idp_certificate',
                'idp_eregistration',
                'no_proof_of_registration',
              ]
            }),
            k.questionWithChoices({
              name: 'do_you_and_your_hh_members_receive_the_idp_allowance',
              showIf: [
                {questionName: 'as_idp_are_you_and_your_hh_members_registered_as_idps', value: 'yes_all_of_them'},
                {questionName: 'as_idp_are_you_and_your_hh_members_registered_as_idps', value: 'yes_some_of_them'},
              ],
              showIfType: 'or',
              options: [
                'yes', 'no',
              ]
            }),
            k.questionWithChoicesAndOtherSpecify({
              showIf: {questionName: 'do_you_and_your_hh_members_receive_the_idp_allowance', value: 'no'},
              name: 'why',
              options: [
                'delays_in_allowances_payment',
                'change_of_place_of_residence',
              ]
            }),
            k.questionWithChoicesAndOtherSpecify({
              name: 'why_are_you_not_registered',
              showIf: [
                {questionName: 'do_you_identify_as_any_of_the_following', value: 'idp'},
                {questionName: 'what_is_your_citizenship', value: 'stateless'},
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
              ]
            }),
            k.questionWithChoicesAndOtherSpecify({
              name: 'why',
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
              name: 'are_all_members_of_your_household_in_possession_of_personal_documentation_including_tin',
              appearance: 'horizontal-compact',
              options: ['yes', 'no']
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
            k.questionWithChoices({
              name: 'have_you_experienced_any_barriers_in_obtaining_or_accessing_identity_documentation_and_or_hlp_documentation',
              appearance: 'horizontal-compact',
              options: [
                'yes', 'no', 'unable_unwilling_to_answer',
              ]
            }),
            k.questionWithChoicesAndOtherSpecify({
              multiple: true,
              showIf: {questionName: 'have_you_experienced_any_barriers_in_obtaining_or_accessing_identity_documentation_and_or_hlp_documentation', value: 'yes'},
              name: 'what_are_the_barriers_for_obtaining_personal_documents',
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
              ]
            })
          ]
        }
      }),
      k.section({
        name: 'safety_n_movement',
        showIf: showIfAccept,
        questions: () => {
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
              ]
            }),
            k.questionWithChoices({
              name: 'is_this_area_contaminated',
              options: [
                'yes', 'no',
              ]
            }),
            k.questionWithChoices({
              name: 'do_you_know_what_number_to_call_if_coming_across_an_explosive_ordnance',
              showIf: {questionName: 'is_this_area_contaminated', value: 'yes'},
              options: [
                'yes', 'no',
              ]
            }),
            common.rating({name: 'how_would_you_describe_the_relationship_between_member_of_the_host_community'}),
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
              ]
            }),
            k.questionWithChoices({
              appearance: 'horizontal-compact',
              name: 'do_you_or_your_household_members_experience_any_barriers_to_movements_in_and_around_the_area',
              options: ['yes', 'no', 'unable_unwilling_to_answer'],
            }),
            k.questionWithChoicesAndOtherSpecify({
              name: 'what_are_the_barriers_to_movement',
              showIf: {questionName: 'do_you_or_your_household_members_experience_any_barriers_to_movements_in_and_around_the_area', value: 'yes'},
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
              ]
            })
          ]
        }

      }),
      k.section({
        name: 'violence_coercion_n_deprivation',
        showIf: showIfAccept,
        questions: () => {
          return [
            k.questionWithChoices({
              name: 'has_any_adult_male_member_of_your_household_experienced_any_form_of_violence_within_the_last_6_months',
              appearance: 'horizontal-compact',
              options: ['yes', 'no', 'unable_unwilling_to_answer'],
            }),
            k.questionWithChoicesAndOtherSpecify({
              name: 'what_type_of_incidents_took_place',
              showIf: {questionName: 'has_any_adult_male_member_of_your_household_experienced_any_form_of_violence_within_the_last_6_months', value: 'yes'},
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
              ]
            }),
            k.calculate({
              name: 'get_tag_if_is_displaced',
              calculation: `if(\${do_you_identify_as_any_of_the_following}='idp', 'displaced') `,
            }),
            k.questionWithChoices({
              name: 'when_did_the_incidents_occur',
              choiceFilter: `tag=\${get_tag_if_is_displaced}`,
              options: [
                {tag: 'displaced', name: 'predisplacement_or_in_the_area_of_origin'},
                {name: 'during_the_displacement_journey'},
                {name: 'in_displacement_location'},
              ]
            })
          ]
        }
      }),
    ]
  }
}
