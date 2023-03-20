import {JSONChoices, JSONForm, JSONQuestion} from './JSONFormCompiler'
import {I18n} from './FormCreator'
import writeXlsxFile from 'write-excel-file/node'
import {Utils} from '../Utils'
import {lazy} from '@alexandreannic/ts-utils'

export class XlsFileGenerator<T extends I18n, Locale extends string> {
  constructor(private params: {
    form: JSONForm<T, Locale>,
    path: string
  }) {
  }

  private readonly getLocales = lazy((): Locale[] => this.params.form.questions[0].label.map(_ => _.locale))

  private readonly addColumnWithLocales = (columnName: 'constraint_message' | 'label' | 'hint' | 'guidance_hint'): any => {
    return this.getLocales().map(locale => ({
      column: `${columnName}::${locale} (${locale})`,
      type: String,
      value: (_: JSONQuestion<T, Locale>) => _[columnName]?.find(_ => _.locale === locale)?.text ?? '',
    }))
  }

  readonly createXLS = async () => {
    console.log(`Build ${this.params.form.meta.title} form to ` + this.params.path + '/' + Utils.sanitizeString(this.params.form.meta.title) + '.xls')
    return writeXlsxFile([
      this.params.form.questions,
      this.params.form.options,
      [{
        form_title: this.params.form.meta.title,
        style: 'theme-grid no-text-transform',
        version: `${this.params.form.meta.version ?? 1} (${new Date().toUTCString()})`
      }]
    ], {
      sheets: ['survey', 'choices', 'settings'],
      schema: [
        [
          {column: 'type', type: String, value: (_: JSONQuestion<T, Locale>) => _.type},
          {column: 'name', type: String, value: (_: JSONQuestion<T, Locale>) => _.name},
          ...this.addColumnWithLocales('label'),
          {column: 'required', type: String, value: (_: JSONQuestion<T, Locale>) => _.required ? 'true' : 'false'},
          {column: 'relevant', type: String, value: (_: JSONQuestion<T, Locale>) => _.relevant ?? ''},
          {column: 'calculation', type: String, value: (_: JSONQuestion<T, Locale>) => _.calculation ?? ''},
          {column: 'choice_filter', type: String, value: (_: JSONQuestion<T, Locale>) => _.choice_filter ?? ''},
          {column: 'appearance', type: String, value: (_: JSONQuestion<T, Locale>) => _.appearance ?? ''},
          {column: 'default', type: String, value: (_: JSONQuestion<T, Locale>) => _.default ?? ''},
          {column: 'constraint', type: String, value: (_: JSONQuestion<T, Locale>) => _.constraint ?? ''},
          {column: 'constraint_message', type: String, value: (_: JSONQuestion<T, Locale>) => _.constraint_message ?? ''},
          ...this.addColumnWithLocales('hint'),
          ...this.addColumnWithLocales('constraint_message'),
        ],
        [
          {column: 'list_name', type: String, value: (_: JSONChoices<T, Locale>) => _.list_name},
          {column: 'name', type: String, value: (_: JSONChoices<T, Locale>) => _.name},
          {column: 'tag', type: String, value: (_: JSONChoices<T, Locale>) => _.tag ?? ''},
          ...this.getLocales().map(locale => ({
            column: `label::${locale} (${locale})`,
            type: String,
            value: (_: JSONChoices<T, Locale>) => _.label.find(_ => _.locale === locale)?.text ?? '',
          })),
        ],
        [
          {column: 'form_title', type: String, value: (_: any) => _.form_title},
          {column: 'version', type: String, value: (_: any) => _.version},
        ]],
      filePath: this.params.path + '/' + Utils.sanitizeString(this.params.form.meta.title) + '.xls'
    })
  }


}
