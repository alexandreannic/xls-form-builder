import {Utils} from './Utils'
import {Choice, Question, QuestionType, Section} from './Form'
import writeXlsxFile from 'write-excel-file/node'

export interface XLSFormChoices {
  list_name: string
  name: string
  label: string
}

type XLSFormQuestionType = 'end_group' | 'begin_group' | 'text' | 'select_multiple' | 'select_one' | 'decimal' | 'date' | 'note'

interface XLSFormQuestion {
  type: string
  name: string
  label: string
  default?: string
  required?: boolean
  relevant?: string
  appearance?: string
  guidance_hint?: string
}

export interface XLSFormBuilderProps {
  title: string
  path?: string
  version?: string
}

export class XLSFormBuilder {
  private collectedOptions: {[key: string]: Choice[]} = {}
  private titlesIndex = 0
  private subTitlesIndex = 'a'

  readonly buildAndCreateXLS = (params: XLSFormBuilderProps, sections: Section[]) => {
    XLSFormBuilder.createXLS(params, ...this.buildForm(sections))
  }

  private static readonly createXLS = (params: XLSFormBuilderProps, k: XLSFormQuestion[], options: XLSFormChoices[]) => {
    writeXlsxFile([
      k,
      options,
      [{form_title: params.title, version: `${params.version ?? 1} (${new Date().toUTCString()})`}]
    ], {
      sheets: ['survey', 'choices', 'settings'],
      schema: [[
        {column: 'type', type: String, value: _ => (_ as unknown as XLSFormQuestion).type},
        {column: 'name', type: String, value: _ => (_ as unknown as XLSFormQuestion).name},
        {column: 'label', type: String, value: _ => (_ as unknown as XLSFormQuestion).label},
        {column: 'required', type: String, value: _ => (_ as unknown as XLSFormQuestion).required ? 'true' : 'false'},
        {column: 'relevant', type: String, value: _ => (_ as unknown as XLSFormQuestion).relevant ?? ''},
        {column: 'appearance', type: String, value: _ => (_ as unknown as XLSFormQuestion).appearance ?? ''},
        {column: 'guidance_hint', type: String, value: _ => (_ as unknown as XLSFormQuestion).guidance_hint ?? ''},
      ], [
        {column: 'list_name', type: String, value: _ => (_ as unknown as XLSFormChoices).list_name},
        {column: 'name', type: String, value: _ => (_ as unknown as XLSFormChoices).name},
        {column: 'label', type: String, value: _ => (_ as unknown as XLSFormChoices).label},
      ], [
        {column: 'form_title', type: String, value: (_: any) => _.form_title},
        {column: 'version', type: String, value: (_: any) => _.version},
      ]],
      filePath: params.path ?? '/Users/pui/WebstormProjects/xls-form-builder/output/' + Utils.sanitizeString(params.title) + '.xls'
    })
  }

  private readonly buildForm = (sections: Section[]): [XLSFormQuestion[], XLSFormChoices[]] => {
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
            .map(XLSFormBuilder.mapQuestionToXLSForm),
          {
            type: 'end_group',
            name: '',
            label: '',
          },
        ]
      }),
      XLSFormBuilder.mapXLSFormChoices(this.collectedOptions)
    ]
  }

  private static readonly mapXLSFormChoices = (options: {[key: string]: Choice[]}): XLSFormChoices[] => {
    return Object.entries(options).flatMap(([key, options]) => {
      return options.map(option => ({
        list_name: key,
        name: option.name,
        label: option.label,
      }))
    })
  }

  private static readonly mapQuestionTypeToXLSForm = (t: QuestionType): XLSFormQuestionType => {
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

  private static readonly mapQuestionToXLSForm = (t: Question): XLSFormQuestion => {
    return {
      type: XLSFormBuilder.mapQuestionTypeToXLSForm(t.type) + (t.optionsId ? ' ' + t.optionsId : ' '),
      name: t.name,
      label: t.label,
      default: t.default,
      required: t.required,
      relevant: t.showIf ?
        t.showIf
          .map(condition => {
            const valueName = condition.question.options?.find(_ => _.label === condition.value)?.name
            if (!valueName) {
              throw new Error(`Options '${condition.value}' does not exist for question ${JSON.stringify(condition.question)}`)
            }
            return `\${${condition.question.name}}${condition.eq === 'neq' ? '!=' : '='}'${valueName}'`
          })
          .join(` ${t.showIfType ?? 'and'} `)
        : undefined,
      appearance: t.type === 'TEXTAREA' ? 'multiline' : undefined,
      guidance_hint: t.hint,
    }
  }
}
