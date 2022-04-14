import {Utils} from './Utils'
import {Question, QuestionType, Section} from './Form'
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

export class KoboFormBuilder {
  private collectedOptions: {[key: string]: string[]} = {}
  private titlesIndex = 0
  private subTitlesIndex = 'a'
  private questionIndex = 0

  readonly buildAndCreateXLS = (sections: Section[]) => {
    KoboFormBuilder.createXLS(...this.buildForm(sections))
  }

  private static readonly createXLS = (k: KoboQuestion[], options: KoboChoices[]) => {
    writeXlsxFile([k, options], {
      sheets: ['survey', 'choices'],
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
      ]],
      filePath: '/Users/pui/WebstormProjects/koboform/test.xls'
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
              if (q.type === 'TITLE') {
                const subTitles = this.subTitlesIndex
                this.subTitlesIndex = Utils.nextChar(this.subTitlesIndex)
                q.label = `${this.titlesIndex}.${subTitles} ${q.label}`
              }
              q.label = q.label + '_' + this.questionIndex++
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

  private static readonly mapKoboChoices = (options: {[key: string]: string[]}): KoboChoices[] => {
    return Object.entries(options).flatMap(([key, options]) => {
      return options.map(option => ({
        list_name: key,
        name: Utils.sanitizeString(option),
        label: option,
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
      relevant: t.showIf ? `selected(\${${t.showIf[0].questionName}}, '${t.showIf[0].value}')` : undefined,
      appearance: t.type === 'TEXTAREA' ? 'multiline' : undefined,
      guidance_hint: t.hint,
    }
  }
}
