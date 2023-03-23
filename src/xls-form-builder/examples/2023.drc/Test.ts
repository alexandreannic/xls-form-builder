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
    return [
      k.section({
        name: 'Option 1' as any,
        questions: (() => {
          return [
            k.calculate({
              name: 'get_tag_if_is_displaced',
              calculation: `'all'`,
            }),
            k.question({
              type: 'INTEGER',
              name: 'how_many_individuals_including_the_respondent_are_in_the_household',
              constraint: '. > 0',
            }),
            common.hhComposition(),
            common.incidentsForm({
              name: 'has_any_adult_female_member_of_your_household_experienced_any_protectionright_violation_incident',
            }),
          ]
        })()
      }),
    ]
  }
}
