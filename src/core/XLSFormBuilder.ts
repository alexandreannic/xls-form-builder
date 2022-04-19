import {Utils} from './Utils'
import {Choice, Question, QuestionType, Section} from './Form'
import writeXlsxFile from 'write-excel-file/node'

export interface XLSFormChoices {
  list_name: string
  name: string
  label: string
}

export type KoboTheme = 'theme-grid no-text-transform'

type XLSFormQuestionType = 'end_group' | 'begin_group' | 'text' | 'select_multiple' | 'select_one' | 'decimal' | 'integer' | 'date' | 'note'

interface XLSFormQuestion {
  type: string
  name: string
  label: string
  default?: string
  required?: boolean
  relevant?: string
  appearance?: string
  guidance_hint?: string
  constraint?: string
  constraint_message?: string
}

export interface XLSFormBuilderProps {
  title: string
  path?: string
  version?: string
  numberOnTitles?: boolean
}

export class XLSFormBuilder {
  private collectedOptions: {[key: string]: Choice[]} = {}
  private titlesIndex = 0
  private subTitlesIndex = 'a'

  readonly buildAndCreateXLS = (props: XLSFormBuilderProps, sections: Section[]) => {
    XLSFormBuilder.createXLS(
      props,
      this.buildForm(sections, props),
      XLSFormBuilder.mapXLSFormChoices(this.collectedOptions)
    )
  }
  readonly buildAndCreateXLSWithoutSection = (props: XLSFormBuilderProps, questions: () =>  Question[]) => {
    XLSFormBuilder.createXLS(
      props,
      this.buildQuestions(questions, props),
      XLSFormBuilder.mapXLSFormChoices(this.collectedOptions)
    )
  }

  private static readonly createXLS = async (params: XLSFormBuilderProps, k: XLSFormQuestion[], choices: XLSFormChoices[]) => {
    console.log(`Build ${params.title} form`)
    return writeXlsxFile([
      k,
      choices,
      [{
        form_title: params.title,
        style: 'theme-grid no-text-transform',
        version: `${params.version ?? 1} (${new Date().toUTCString()})`
      }]
    ], {
      sheets: ['survey', 'choices', 'settings'],
      schema: [[
        {column: 'type', type: String, value: _ => (_ as unknown as XLSFormQuestion).type},
        {column: 'name', type: String, value: _ => (_ as unknown as XLSFormQuestion).name},
        {column: 'label', type: String, value: _ => (_ as unknown as XLSFormQuestion).label},
        {column: 'required', type: String, value: _ => (_ as unknown as XLSFormQuestion).required ? 'true' : 'false'},
        {column: 'relevant', type: String, value: _ => (_ as unknown as XLSFormQuestion).relevant ?? ''},
        {column: 'appearance', type: String, value: _ => (_ as unknown as XLSFormQuestion).appearance ?? ''},
        {column: 'default', type: String, value: _ => (_ as unknown as XLSFormQuestion).default ?? ''},
        {column: 'constraint', type: String, value: _ => (_ as unknown as XLSFormQuestion).constraint ?? ''},
        {column: 'constraint_message', type: String, value: _ => (_ as unknown as XLSFormQuestion).constraint_message ?? ''},
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

  private readonly buildQuestions = (questions: () => Question[], props: XLSFormBuilderProps): XLSFormQuestion[] => {
    return questions()
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
            if (props.numberOnTitles) {
              const subTitles = this.subTitlesIndex
              this.subTitlesIndex = Utils.nextChar(this.subTitlesIndex)
              q.label = `####${this.titlesIndex}.${subTitles}. ${q.label}`
            }
            break
          }
          case 'NOTE': {
            q.label = `*${q.label}*`
            break
          }
        }
        return q
      })
      .map(XLSFormBuilder.mapQuestionToXLSForm)
  }

  private readonly buildForm = (sections: Section[], props: XLSFormBuilderProps): XLSFormQuestion[] => {
    return sections.flatMap(s => {
      this.subTitlesIndex = 'a'
      return [
        {
          type: 'begin_group',
          name: Utils.sanitizeString(`group_${s.label}`),
          label: props.numberOnTitles ? `${++this.titlesIndex}. ${s.label}` : s.label,
          relevant: XLSFormBuilder.mapRelevant(s),
        },
        ...this.buildQuestions(s.questions, props),
        {
          type: 'end_group',
          name: '',
          label: '',
        },
      ]
    })
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
      case 'INTEGER':
        return 'integer'
      case 'DECIMAL':
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
      ...t,
      type: XLSFormBuilder.mapQuestionTypeToXLSForm(t.type) + (t.optionsId ? ' ' + t.optionsId : ' '),
      relevant: XLSFormBuilder.mapRelevant(t),
      appearance: t.type === 'TEXTAREA' ? 'multiline' : undefined,
      guidance_hint: t.hint,
      constraint_message: t.constraintMessage,
    }
  }

  private static readonly mapRelevant = (t: Pick<Question, 'showIf' | 'showIfType'>): string | undefined => {
    if (t.showIf) {
      return t.showIf
        .map(condition => {
          const valueName = condition.question.options?.find(_ => _.label === condition.value)?.name
          if (!valueName) {
            throw new Error(`Options '${condition.value}' does not exist for question ${JSON.stringify(condition.question)}`)
          }
          return `\${${condition.question.name}}${condition.eq === 'neq' ? '!=' : '='}'${valueName}'`
        })
        .join(` ${t.showIfType ?? 'and'} `)
    }
  }
}
