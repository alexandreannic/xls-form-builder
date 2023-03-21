import {FormCreator, ShowIf, ShowIfCondition} from '../../core/v2/FormCreator'
import {Common} from './Common'
import {I18n, i18n_en} from './i18n/en'
import {i18n_ua} from './i18n/ua'
import {JSONFormCompiler} from '../../core/v2/JSONFormCompiler'
import {XlsFileGenerator} from '../../core/v2/XlsFileGenerator'

export const test = async () => {
  const json = new JSONFormCompiler<I18n, 'en' | 'ua'>({
    numberOnTitles: true,
    form: {
      title: 'test',
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
    const hasMinorInHH = common.hasMinorInHH()
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
        name: 'raion',
        questions: [
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
          k.question({
            type: 'INTEGER',
            name: 'how_many_individuals_including_the_respondent_are_in_the_household',
            constraint: '. > 0',
          }),
          common.hhComposition(),
        ]
      }),
      k.section({
        name: 'access_to_education',
        showIfType: 'and',
        showIf: [hasAccepted, hasMinorInHH],
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
              showIf: [
                {questionName: 'are_schoolaged_children_in_your_household_regularly_attending_primary_or_secondary_education', value: 'yes_all_of_them'},
                {questionName: 'are_schoolaged_children_in_your_household_regularly_attending_primary_or_secondary_education', value: 'yes_some_of_them'},
              ],
              options: [
                'online_education',
                'education_in_school',
                'hybrid_mode',
              ]
            }),
            k.questionWithChoicesAndOtherSpecify({
              name: 'what_are_the_reasons_preventing_children_in_your_household_from_regularly_attending_education_services',
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
    ]
  }
}
