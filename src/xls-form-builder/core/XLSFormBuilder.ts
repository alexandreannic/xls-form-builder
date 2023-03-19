import {Utils} from './Utils'
import {Choice, Label, Question, QuestionType, Section} from './Form'
import writeXlsxFile from 'write-excel-file/node'

export interface XLSFormChoices<L extends Label> {
  list_name: string
  name: string
  label: L
}

export type KoboTheme = 'theme-grid no-text-transform'

type XLSFormQuestionType = 'end_group'
  | 'begin_group'
  | 'text'
  | 'select_multiple'
  | 'select_one'
  | 'decimal'
  | 'integer'
  | 'date'
  | 'note'

interface XLSFormQuestion<L extends Label> {
  type: string
  name: string
  label: L
  default?: string
  required?: boolean
  relevant?: string
  appearance?: string
  guidance_hint?: L
  constraint?: string
  constraint_message?: string
}

export interface XLSFormBuilderProps {
  title: string
  path?: string
  version?: string
  numberOnTitles?: boolean
}

export class XLSFormBuilder<L extends Label> {
  private collectedOptions: {[key: string]: Choice<L>[]} = {}
  private titlesIndex = 0
  private subTitlesIndex = 'a'

  readonly buildAndCreateXLS = (props: XLSFormBuilderProps, sections: Section<L>[]) => {
    XLSFormBuilder.createXLS<L>(
      props,
      this.buildForm(sections, props),
      XLSFormBuilder.mapXLSFormChoices<L>(this.collectedOptions)
    )
  }
  readonly buildAndCreateXLSWithoutSection = (props: XLSFormBuilderProps, questions: () => Question<L>[]) => {
    XLSFormBuilder.createXLS<L>(
      props,
      this.buildQuestions(questions, props),
      XLSFormBuilder.mapXLSFormChoices<L>(this.collectedOptions)
    )
  }

  private static readonly createXLS = async <L extends Label>(params: XLSFormBuilderProps, k: XLSFormQuestion<L>[], choices: XLSFormChoices<L>[]) => {
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
        {column: 'type', type: String, value: _ => (_ as unknown as XLSFormQuestion<L>).type},
        {column: 'name', type: String, value: _ => (_ as unknown as XLSFormQuestion<L>).name},
        ...(typeof k[0].label === 'object') ?
          Object.keys(k[0].label).map(langCode => ({
            column: `label::${langCode} (${langCode})`,
            type: String,
            value: (_: any) => ((_ as unknown as XLSFormQuestion<L>).label as any)[langCode]
          }))
          : [
            {column: 'label', type: String, value: (_: any) => (_ as unknown as XLSFormQuestion<L>).label},
          ],
        {column: 'required', type: String, value: _ => (_ as unknown as XLSFormQuestion<L>).required ? 'true' : 'false'},
        {column: 'relevant', type: String, value: _ => (_ as unknown as XLSFormQuestion<L>).relevant ?? ''},
        {column: 'appearance', type: String, value: _ => (_ as unknown as XLSFormQuestion<L>).appearance ?? ''},
        {column: 'default', type: String, value: _ => (_ as unknown as XLSFormQuestion<L>).default ?? ''},
        {column: 'constraint', type: String, value: _ => (_ as unknown as XLSFormQuestion<L>).constraint ?? ''},
        {column: 'constraint_message', type: String, value: _ => (_ as unknown as XLSFormQuestion<L>).constraint_message ?? ''},
        ...(typeof k[0].label === 'object') ?
          Object.keys(k[0].label).map(langCode => ({
            column: `hint::${langCode} (${langCode})`,
            type: String,
            value: (_: any) => ((_ as unknown as XLSFormQuestion<L>).guidance_hint ?? {} as any)[langCode]
          }))
          : [
            {column: 'guidance_hint', type: String, value: (_: any) => (_ as unknown as XLSFormQuestion<L>).guidance_hint ?? ''},
          ],

      ], [
        {column: 'list_name', type: String, value: _ => (_ as unknown as XLSFormChoices<L>).list_name},
        {column: 'name', type: String, value: _ => (_ as unknown as XLSFormChoices<L>).name},
        ...(typeof k[0].label === 'object') ?
          Object.keys(k[0].label).map(langCode => ({
            column: `label::${langCode} (${langCode})`,
            type: String,
            value: (_: any) => ((_ as unknown as XLSFormChoices<L>).label as any)[langCode]
          }))
          : [
            {column: 'label', type: String, value: (_: any) => (_ as unknown as XLSFormChoices<L>).label},
          ],

      ], [
        {column: 'form_title', type: String, value: (_: any) => _.form_title},
        {column: 'version', type: String, value: (_: any) => _.version},
      ]],
      filePath: params.path ?? '/Users/pui/WebstormProjects/xls-form-builder/output/' + Utils.sanitizeString(params.title) + '.xls'
    })
  }

  private static readonly mapLabel = <L extends Label>(l: L, map: (_: string) => string): L => {
    if (typeof l === 'object') {
      Object.keys(l).forEach(k => {
        l[k] = map(l[k])
      })
      return l
    } else {
      return map(l) as L
    }
  }

  private readonly buildQuestions = (questions: () => Question<L>[], props: XLSFormBuilderProps): XLSFormQuestion<L>[] => {
    return questions()
      .map(q => {
        if (q.options) {
          const id = Utils.makeid()
          this.collectedOptions[id] = q.options
          q.optionsId = id
        }
        return q
      })
      .map(props.numberOnTitles ? this.enumerateTitle : _ => _)
      .map(this.mapQuestionType)
      .map(this.mapFontStyle)
      .map(XLSFormBuilder.mapQuestionToXLSForm)
  }

  private readonly enumerateTitle = (q: Question<L>): Question<L> => {
    switch (q.type) {
      case 'TITLE': {
        const subTitles = this.subTitlesIndex
        this.subTitlesIndex = Utils.nextChar(this.subTitlesIndex)
        q.label = XLSFormBuilder.mapLabel(q.label, _ => `${this.titlesIndex}.${subTitles}. ${_}`)
        break
      }
    }
    return q
  }

  private readonly mapQuestionType = (q: Question<L>): Question<L> => {
    switch (q.type) {
      case 'TITLE': {
        q.label = XLSFormBuilder.mapLabel(q.label, _ => `####${_}`)
        break
      }
    }
    return q
  }

  private readonly mapFontStyle = (q: Question<L>): Question<L> => {
    if (q.size === 'small') {
      q.label = XLSFormBuilder.mapLabel(q.label, _ => `<sup>${_}</sup>`)
    }
    if (q.size === 'big') {
      q.label = XLSFormBuilder.mapLabel(q.label, _ => `<span style="font-size: 1.15em">${_}</span>`)
    }
    if (q.italic) {
      q.label = XLSFormBuilder.mapLabel(q.label, _ => `*${_}*`)
    }
    if (q.bold) {
      q.label = XLSFormBuilder.mapLabel(q.label, _ => `**${_}**`)
    }
    return q
  }

  private readonly buildForm = (sections: Section<L>[], props: XLSFormBuilderProps): XLSFormQuestion<L>[] => {
    return sections.flatMap(s => {
      this.subTitlesIndex = 'a'
      return [
        {
          type: 'begin_group',
          name: Utils.sanitizeString(`group_${s.label}`),
          label: XLSFormBuilder.mapLabel(s.label, _ => props.numberOnTitles ? `${++this.titlesIndex}. ${_}` : _),
          relevant: XLSFormBuilder.mapRelevant(s),
        },
        ...this.buildQuestions(s.questions, props),
        {
          type: 'end_group',
          name: '',
          label: '' as any // FIXME(Alex) It should not be a string, but a L,
        },
      ]
    })
  }

  private static readonly mapXLSFormChoices = <L extends Label>(options: {[key: string]: Choice<L>[]}): XLSFormChoices<L>[] => {
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

  private static readonly mapQuestionToXLSForm = <L extends Label>(t: Question<L>): XLSFormQuestion<L> => {
    return {
      ...t,
      type: XLSFormBuilder.mapQuestionTypeToXLSForm(t.type) + (t.optionsId ? ' ' + t.optionsId : ' '),
      relevant: XLSFormBuilder.mapRelevant(t),
      appearance: t.type === 'TEXTAREA' ? 'multiline' : undefined,
      guidance_hint: t.hint,
      constraint_message: t.constraintMessage,
    }
  }

  private static readonly mapRelevant = <L extends Label>(t: Pick<Question<L>, 'showIf' | 'showIfType'> & Partial<Pick<Question<L>, 'type'>>): string | undefined => {
    if (t.showIf) {
      return t.showIf
        .map(condition => {
          const valueName = condition.question.options?.find(_ => (typeof _.label === 'object' ? _.label.en : _.label) === condition.value)?.name
          if (!valueName) {
            throw new Error(`Options '${condition.value}' does not exist for question ${JSON.stringify(condition.question)}`)
          }
          if (condition.eq === 'neq') {
            return `\${${condition.question.name}}${condition.eq === 'neq' ? '!=' : '='}'${valueName}'`
          }
          return `selected(\${${condition.question.name}}, '${valueName}')`
        })
        .join(` ${t.showIfType ?? 'and'} `)
    }
  }
}
