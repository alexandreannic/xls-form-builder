import {JSONChoices, JSONForm, JSONQuestion} from './JSONFormCompiler'
import {Choice, I18n} from './FormCreator'
import writeXlsxFile from 'write-excel-file/node'
import {Utils} from '../Utils'
import {Enum, lazy} from '@alexandreannic/ts-utils'
import * as fs from 'fs'

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
    return Promise.resolve([
      this.createMailFile(),
      ...Enum.keys(this.params.form.externalOptions ?? {}).map(this.createExternalFile),
    ])
  }

  private quote = (str?: string): string => {
    return str ? '"' + str + '"' : ''
  }

  private readonly createExternalFile = async (fileName: string) => {
    const filePath = this.params.path + '/' + fileName + '.csv'
    console.log(`Build ${this.params.form.meta.title} form to ` + filePath)
    const options: JSONChoices<T, Locale>[] = (this.params.form.externalOptions as any)[fileName]
    const format: {name: string, fn: (k: JSONChoices<T, Locale>) => string | number}[] = [
      {name: 'list_name', fn: _ => _.list_name ?? ''},
      {name: 'name', fn: _ => _.name as string ?? ''},
      ...this.getLocales().map(locale => ({
        name: `label::${locale} (${locale})`,
        fn: (_: JSONChoices<T, Locale>) => this.quote(_.label.find(_ => _.locale === locale)?.text),
      })),
      {name: 'tag', fn: _ => _.tag ?? ''},
      {name: 'tag1', fn: _ => _.tag1 ?? ''},
    ]
    const cols = format.map(_ => _.name).join(',')
    const rows = options.map(o => format.map(_ => _.fn(o)).join(',')).join('\n')
    const res = cols + '\n' + rows
    fs.writeFileSync(filePath, res)
  }

  private readonly createMailFile = async () => {
    const filePath = this.params.path + '/' + Utils.sanitizeString(this.params.form.meta.title) + '.xls'
    console.log(`Build ${this.params.form.meta.title} form to ` + filePath)
    return writeXlsxFile(
      [
        this.params.form.questions,
        this.params.form.options,
        [{
          form_title: this.params.form.meta.title,
          version: `${this.params.form.meta.version ?? 1} (${new Date().toUTCString()})`,
          style: this.params.form.meta.style,
        }]
      ],
      {
        filePath,
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
            ...this.addColumnWithLocales('hint'),
            ...this.addColumnWithLocales('constraint_message'),
          ],
          [
            {column: 'list_name', type: String, value: (_: JSONChoices<T, Locale>) => _.list_name},
            {column: 'name', type: String, value: (_: JSONChoices<T, Locale>) => _.name},
            ...this.getLocales().map(locale => ({
              column: `label::${locale} (${locale})`,
              type: String,
              value: (_: JSONChoices<T, Locale>) => _.label.find(_ => _.locale === locale)?.text ?? '',
            })),
            {column: 'tag', type: String, value: (_: JSONChoices<T, Locale>) => _.tag ?? ''},
            {column: 'tag1', type: String, value: (_: JSONChoices<T, Locale>) => _.tag1 ?? ''},
          ],
          [
            {column: 'form_title', type: String, value: (_: any) => _.form_title},
            {column: 'version', type: String, value: (_: any) => _.version},
            {column: 'style', type: String, value: (_: any) => _.style ?? ''},
          ]],
      })
  }


}
