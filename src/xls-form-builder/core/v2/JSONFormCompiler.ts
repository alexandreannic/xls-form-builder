import {Utils} from '../Utils'
import {Choice, Form2, I18n, isShowIf, isShowIfCondition, KoboTheme, Question2, QuestionType, ShowIf, ShowIfCondition} from './FormCreator'
import {Enum, fnSwitch} from '@alexandreannic/ts-utils'

export interface JSONForm<T extends I18n, Locale extends string> {
  meta: {
    title: string,
    version?: string
    style?: KoboTheme
  }
  questions: JSONQuestion<T, Locale>[]
  options: JSONChoices<T, Locale>[]
  externalOptions?: Record<string, JSONChoices<T, Locale>[]>
}

export interface JSONChoices<L extends I18n, Locale extends string> {
  list_name: string
  name: keyof L
  label: Translations<Locale>
  tag?: string
  tag1?: string
}

type JSONQuestionType = 'end_group'
  | 'begin_group'
  | 'text'
  | 'select_multiple'
  | 'calculate'
  | 'select_one'
  | 'decimal'
  | 'integer'
  | 'date'
  | 'note'

type Translations<L extends string> = {locale: L, text: string}[]

export interface JSONQuestion<T extends I18n, Locale extends string> {
  type: string
  name: string
  calculation?: string
  label: Translations<Locale>
  default?: string
  required?: boolean
  choice_filter?: string
  relevant?: string
  appearance?: string
  hint?: Translations<Locale>
  guidance_hint?: Translations<Locale>
  constraint?: string
  constraint_message?: Translations<Locale>
}

interface QuestionWithI18n<T extends I18n, Locale extends string> extends Omit<Question2<T>, 'label' | 'hint' | 'guidanceHint' | 'constraintMessage'> {
  label: Translations<Locale>
  hint?: Translations<Locale>
  guidanceHint?: Translations<Locale>
  constraintMessage?: Translations<Locale>
}

export class JSONFormCompiler<T extends I18n, Locale extends string = string> {
  static readonly formWidth = 630
  private collectedExternalOptions: Record<string, Record<string, Choice<T>[]>> = {}
  private collectedOptions: Record<string, Choice<T>[]> = {}
  private titlesIndex = 0
  private subTitlesIndex = 1
  private enumerationNamesIndex = new Map<string, string>()
  private childEnumerationNamesIndex = new Map<string, number>()

  constructor(private props: {
    form: Form2<T>,
    numberOnTitles?: boolean
    translations: Record<Locale, T>
  }) {
  }

  private readonly checkDuplicateQuestionName = (qs: Question2<T>[]): void => {
    const names = new Set<string>()
    qs.forEach(_ => {
      const qName = _.name as string
      if (names.has(qName)) {
        throw new Error(`All question names must be uniq. Question name '${qName}' is not uniq.`)
      }
      names.add(qName)
    })
  }

  readonly buildForm = (): JSONForm<T, Locale> => {
    this.checkDuplicateQuestionName(this.props.form.sections.flatMap(_ => _.questions.flat()))
    const form = {
      version: this.props.form.version,
      title: this.props.form.title,
      style: this.props.form.style,
    }
    const questions = this.props.form.sections.flatMap(s => {
      this.subTitlesIndex = 1
      this.titlesIndex++
      return [
        {
          type: 'begin_group',
          name: `group_${s.name as string}`,
          label: this.translate(s.name).map(_ => ({..._, text: this.props.numberOnTitles ? `${this.titlesIndex}. ${_.text}` : _.text})),
          appearance: 'w12',
          relevant: this.mapRelevant(s),
        },
        ...this.buildQuestions(s.questions),
        {
          type: 'end_group',
          name: '',
          label: this.translate(),
        },
      ]
    })
    const options = this.mapXLSFormChoices(this.collectedOptions)
    const externalOptions = Object.entries(this.collectedExternalOptions).reduce((acc, [k, v]) => {
      return {
        ...acc,
        [k]: this.mapXLSFormChoices(this.collectedExternalOptions[k])
      }
    }, {})
    return {meta: form, questions, options, externalOptions}
  }

  private readonly buildQuestions = (questions: (Question2<T> | Question2<T>[])[]): JSONQuestion<T, Locale>[] => {
    return questions.flat()
      .map(q => {
        if (q.options) {
          if (q.moveOptionsToExternalFile) {
            if (!this.collectedExternalOptions[q.moveOptionsToExternalFile]) {
              this.collectedExternalOptions[q.moveOptionsToExternalFile] = {}
            }
            this.collectedExternalOptions[q.moveOptionsToExternalFile][q.moveOptionsToExternalFile] = q.options
            q.optionsId = q.moveOptionsToExternalFile
          } else {
            const id = Utils.makeid()
            this.collectedOptions[id] = q.options
            q.optionsId = id
          }
        }
        return q
      })
      .map(this.addTranslations)
      // .map(this.generateUniqQuestionName)
      .map(this.props.numberOnTitles ? this.applyQuestionNumeration : _ => _)
      .map(this.applyLabelFontStyle)
      // .map(this.applyHintStyle)
      .map(this.mapQuestionToXLSForm)
  }

  private readonly getFirstShowIfParent = (q: QuestionWithI18n<T, Locale>): keyof T | undefined => {
    let showIf: ShowIfCondition<T>[] | ShowIfCondition<T> | ShowIf<T>[] | undefined = q.showIf
    if (!showIf) return undefined
    for (; ;) {
      const r: ShowIfCondition<T> | ShowIf<T> = [showIf].flat()[0]!
      if (isShowIfCondition(r)) {
        return r.questionName
      }
      showIf = (r as ShowIf<T>).showIf
    }
  }

  private readonly applyQuestionNumeration = (q: QuestionWithI18n<T, Locale>): QuestionWithI18n<T, Locale> => {
    const ignoredType: QuestionType[] = [
      'alert_warn',
      'alert_info',
      'CALCULATE',
      'DIVIDER',
    ]
    if (ignoredType.includes(q.type)) {
      return q
    }
    const qName = q.name as string
    const subTitles = this.subTitlesIndex
    const numeration = (() => {
      if (q.showIf) {
        const parentName = this.getFirstShowIfParent(q) as string
        const parentNum = this.enumerationNamesIndex.get(parentName)
        if (!parentNum) {
          throw new Error(`Cannot find parent '${parentName}' for question '${q.name}'`)
        }
        const isParentInAnotherSection = +parentNum.split('.')[0] !== this.titlesIndex
        if (isParentInAnotherSection) {
          this.subTitlesIndex = this.subTitlesIndex + 1
          return `${this.titlesIndex}.${subTitles}.`
        }
        const childNum = (this.childEnumerationNamesIndex.get(parentName) ?? 0) + 1
        this.childEnumerationNamesIndex.set(parentName, childNum)
        return `${parentNum}${childNum}.`
      }
      this.subTitlesIndex = this.subTitlesIndex + 1
      return `${this.titlesIndex}.${subTitles}.`
    })()
    this.enumerationNamesIndex.set(qName, numeration)
    q.label = q.label.map(_ => ({..._, text: `${numeration} ${_.text}`}))
    return q
  }

  private readonly addTranslations = (q: Question2<T>): QuestionWithI18n<T, Locale> => {
    return {
      ...q,
      label: this.translate(q.label),
      // guidanceHint: q.guidanceHint ? this.translate(q.guidanceHint) : undefined,
      hint: q.hint ? this.translate(q.hint) : undefined,
      constraintMessage: q.constraintMessage ? this.translate(q.constraintMessage) : undefined,
    }
  }

  private readonly translate = (key?: keyof T): Translations<Locale> => {
    return Enum.entries(this.props.translations).map(([locale, translations]) => {
      return {locale, text: key ? translations[key] ?? key : ''}
    })
  }

  // private generateUniqQuestionName = (q: QuestionWithI18n<T, Locale>): QuestionWithI18n<T, Locale> => {
  //   const name = q.name as string
  //   const index = this.namesIndex.get(name)
  //   this.namesIndex.set(name, (index ?? 0) + 1)
  //   return {...q, name: name + (index ?? '')}
  // }

  private readonly mapQuestionToXLSForm = (q: QuestionWithI18n<T, Locale>): JSONQuestion<T, Locale> => {
    return {
      ...q,
      choice_filter: q.choiceFilter,
      name: q.name as string,
      required: !q.optional,
      type: (() => {
        let res = this.mapQuestionTypeToXLSForm(q.type)
        if (q.moveOptionsToExternalFile) res += '_from_file'
        if (q.optionsId) res += ' ' + q.optionsId
        if (q.moveOptionsToExternalFile) res += '.csv'
        return res
      })(),
      relevant: this.mapRelevant(q),
      appearance: (q.type === 'TEXTAREA' ? 'multiline' : q.appearance ?? '') + (q.col ? ` w${q.col}` : ''),
      hint: q.hint,
      guidance_hint: q.guidanceHint,
      constraint_message: q.constraintMessage,
    }
  }

  private readonly applyLabelFontStyle = (q: QuestionWithI18n<T, Locale>): QuestionWithI18n<T, Locale> => {
    if (q.type === 'DIVIDER') {
      q.label = q.label.map(_ => ({
        ..._,
        text: `<span style="display: block; width: ${JSONFormCompiler.formWidth}px; margin-top: 12px; color: transparent; border-top: 1px solid rgba(0, 0, 0, 0.12)">Test</span>`
      }))
      return q
    }
    const css = {
      ...q.borderTop && {'display': 'block', width: JSONFormCompiler.formWidth + 'px', 'padding-top': '12px', 'border-top': '1px solid rgba(0,0,0,0.12)'},
      ...q.type === 'TITLE' && {'font-size': '1.2em'},
      ...q.size === 'small' && {'font-size': '.875em'},
      ...q.size === 'big' && {'font-size': '.1.125em'},
      ...q.italic && {'font-style': 'italic'},
      ...q.bold && {'font-weight': 'bold'},
      ...q.bold === false && {'font-weight': 'normal'},
      ...q.color && {'color': q.color},
      ...q.type.includes('alert_') && {
        'border-radius': '8px',
        'padding': '8px 12px',
        display: 'block',
      },
      ...q.type === 'alert_info' && {
        background: 'rgb(229, 246, 253)',
        color: 'rgb(1, 67, 97)',
      },
      ...q.type === 'alert_warn' && {
        background: 'rgb(255, 244, 229)',
        color: 'rgb(102, 60, 0)',
      }
    }
    const getAlertIcon = () => {
      const icon = fnSwitch(q.type, {
        'alert_info': 'ℹ️',
        'alert_warn': '⚠️',
      }, () => '')
      return icon + '   '
    }
    const stringCss = Object.entries(css).map(([k, v]) => `${k}:${v}`).join(';')
    q.label = q.label.map(_ => ({..._, text: `<span style="${stringCss}">${getAlertIcon() + _.text}</span>`}))
    return q
  }

  private readonly mapXLSFormChoices = (options: {[key: string]: Choice<T>[]}): JSONChoices<T, Locale>[] => {
    return Object.entries(options).flatMap(([key, options]) => {
      return options.map(option => ({
        ...option,
        list_name: key,
        name: option.name,
        label: this.translate(option.name),
      }))
    })
  }

  private readonly mapQuestionTypeToXLSForm = (t: QuestionType): JSONQuestionType => {
    switch (t) {
      case 'DATE':
        return 'date'
      case 'CALCULATE':
        return 'calculate'
      case 'CHECKBOX':
        return 'select_multiple'
      case 'RADIO':
        return 'select_one'
      case 'INTEGER':
        return 'integer'
      case 'DECIMAL':
        return 'decimal'
      case 'alert_info':
      case 'alert_warn':
      case 'TITLE':
      case 'DIVIDER':
      case 'NOTE':
        return 'note'
      default:
        return 'text'
    }
  }

  private readonly findQuestionByName = (name: keyof T): Question2<T> => {
    const res = this.props.form.sections.flatMap(_ => _.questions.flat()).find(_ => _.name === name)
    if (!res) {
      throw Error(`Cannot find question with name ${String(name)}`)
    }
    return res
  }

  private readonly mapRelevant = (t: Pick<Question2<T>, 'showIf' | 'showIfType'> & Partial<Pick<Question2<T>, 'type'>>): string | undefined => {
    if (t.showIf) {
      return [t.showIf].flat()
        .map(condition => {
          if (isShowIf(condition)) return '(' + (this.mapRelevant(condition) ?? '') + ')'
          if (isShowIfCondition(condition)) {
            const valueName = this.findQuestionByName(condition.questionName).options?.find(_ => _.name === condition.value)?.name as string | undefined
            if (!valueName && valueName !== '""' && (condition.op === '=' || condition.op === '!=')) {
              console.warn(`[WARNING] Options '${condition.value}' does not exist for question ${JSON.stringify(condition.questionName)}`)
            }
            if (condition.op) {
              return `\${${condition.questionName}}${condition.op ?? '='}'${condition.value}'`
            }
            return `selected(\${${condition.questionName as string}}, '${valueName}')`
          }
        })
        .join(` ${t.showIfType ?? 'and'} `)
    }
  }
}
