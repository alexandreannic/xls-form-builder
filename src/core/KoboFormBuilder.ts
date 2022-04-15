import {Utils} from './Utils'
import {Choice, Question, QuestionType, Section} from './Form'
import writeXlsxFile from 'write-excel-file/node'

export interface KoboChoices {
  list_name: string
  name: string
  label: string
}

type KoboQuestionType = 'end_group' | 'begin_group' | 'text' | 'select_multiple' | 'select_one' | 'decimal' | 'date' | 'note'

interface KoboQuestion {
  type: string
  name: string
  label: string
  required?: boolean
  relevant?: string
  appearance?: string
  guidance_hint?: string
}

export interface KoboFormBuilderProps {
  title: string
  path?: string
  version?: string
}

export class KoboFormBuilder {
  private collectedOptions: {[key: string]: Choice[]} = {}
  private titlesIndex = 0
  private subTitlesIndex = 'a'

  readonly buildAndCreateXLS = (params: KoboFormBuilderProps, sections: Section[]) => {
    KoboFormBuilder.createXLS(params, ...this.buildForm(sections))
  }

  private static readonly createXLS = (params: KoboFormBuilderProps, k: KoboQuestion[], options: KoboChoices[]) => {
    writeXlsxFile([
      k,
      options,
      [{form_title: params.title, version: `${params.version ?? 1} (${new Date().toUTCString()})`}]
    ], {
      sheets: ['survey', 'choices', 'settings'],
      schema: [[
        {column: 'type', type: String, value: _ => (_ as unknown as KoboQuestion).type},
        {column: 'name', type: String, value: _ => (_ as unknown as KoboQuestion).name},
        {column: 'label', type: String, value: _ => (_ as unknown as KoboQuestion).label},
        {column: 'required', type: String, value: _ => (_ as unknown as KoboQuestion).required ? 'true' : 'false'},
        {column: 'relevant', type: String, value: _ => (_ as unknown as KoboQuestion).relevant ?? ''},
        {column: 'appearance', type: String, value: _ => (_ as unknown as KoboQuestion).appearance ?? ''},
        {column: 'guidance_hint', type: String, value: _ => (_ as unknown as KoboQuestion).guidance_hint ?? ''},
      ], [
        {column: 'list_name', type: String, value: _ => (_ as unknown as KoboChoices).list_name},
        {column: 'name', type: String, value: _ => (_ as unknown as KoboChoices).name},
        {column: 'label', type: String, value: _ => (_ as unknown as KoboChoices).label},
      ], [
        {column: 'form_title', type: String, value: (_: any) => _.form_title},
        {column: 'version', type: String, value: (_: any) => _.version},
      ]],
      filePath: params.path ?? '/Users/pui/WebstormProjects/koboform/' + Utils.sanitizeString(params.title) + '.xls'
    })
  }

  private readonly buildForm = (sections: Section[]): [KoboQuestion[], KoboChoices[]] => {
    return [
      sections.flatMap(s => {
        this.subTitlesIndex = 'a'
        return [
          {
            type: 'begin_group',
            name: Utils.sanitizeString(`group_${s.label}`),
            label: `${++this.titlesIndex}. ${s.label}`
          },
          ...s.questions()
            .map(q => {
              if (q.options) {
                const id = Utils.makeid()
                this.collectedOptions[id] = q.options
                q.optionsId = id
              }
              return q
            })
            .map(q => {
              switch (q.type) {
                case 'TITLE': {
                  const subTitles = this.subTitlesIndex
                  this.subTitlesIndex = Utils.nextChar(this.subTitlesIndex)
                  q.label = `####${this.titlesIndex}.${subTitles}. ${q.label}`
                  break
                }
                case 'NOTE': {
                  q.label = `*${q.label}*`
                  break
                }
              }
              return q
            })
            .map(KoboFormBuilder.mapQuestionToKobo),
          {
            type: 'end_group',
            name: '',
            label: '',
          },
        ]
      }),
      KoboFormBuilder.mapKoboChoices(this.collectedOptions)
    ]
  }

  private static readonly mapKoboChoices = (options: {[key: string]: Choice[]}): KoboChoices[] => {
    return Object.entries(options).flatMap(([key, options]) => {
      return options.map(option => ({
        list_name: key,
        name: option.name,
        label: option.label,
      }))
    })
  }

  private static readonly mapQuestionTypeToKobo = (t: QuestionType): KoboQuestionType => {
    switch (t) {
      case 'DATE':
        return 'date'
      case 'CHECKBOX':
        return 'select_multiple'
      case 'RADIO':
        return 'select_one'
      case 'NUMBER':
        return 'decimal'
      case 'TITLE':
      case 'NOTE':
        return 'note'
      default:
        return 'text'
    }
  }

  private static readonly mapQuestionToKobo = (t: Question): KoboQuestion => {
    return {
      type: KoboFormBuilder.mapQuestionTypeToKobo(t.type) + (t.optionsId ? ' ' + t.optionsId : ' '),
      name: t.name,
      label: t.label,
      required: t.required,
      relevant: t.showIf ? t.showIf.map(_ => `\${${_.questionName}}${_.eq === 'neq' ? '!=' : '='}'${_.valueName}'`).join(` ${t.showIfType ?? 'and'} `) : undefined,
      appearance: t.type === 'TEXTAREA' ? 'multiline' : undefined,
      guidance_hint: t.hint,
    }
  }
}
