import writeXlsxFile from 'write-excel-file/node'
import {Utils} from './Utils'

export type QuestionTypeWithOptions = 'CHECKBOX' | 'RADIO'
export type QuestionTypeWithoutOptions = 'TEXT' | 'TEXTAREA' | 'DATE' | 'NUMBER' | 'TITLE'
export type QuestionType = QuestionTypeWithOptions | QuestionTypeWithoutOptions

type KoboQuestionType = 'end_group' | 'begin_group' | 'text' | 'select_multiple' | 'select_one' | 'decimal' | 'date' | 'note'

interface ShowIf {
  questionName: string
  value: string
}

interface Question {
  name: string
  type: QuestionType
  label: string
  hint?: string
  required?: boolean
  showIf?: ShowIf[]
  options?: string[]
}

interface KoboQuestion {
  type: KoboQuestionType
  name: string
  label: string
  required?: boolean
  relevant?: string
  appearance?: string
  guidance_hint?: string
}

interface QuestionConf {
  required?: boolean
  showIf: ShowIf[]
  hint?: string
}

interface Section {
  label: string
  questions: () => Question[]
}

export interface KoboChoices {
  list_name: string
  name: string
  label: string
}

export class KoboForm {
  private titlesIndex = 0
  private subTitlesIndex = 'a'
  private questionIndex = 0
  collectedOptions: {[key: string]: string[]} = {}

  constructor() {
  }

  static readonly printForm = (k: KoboQuestion[], options: KoboChoices[]) => {
    writeXlsxFile([k, options.map(_ => ({label: _}))], {
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
        {column: 'list_name', type: String, value: _ => (_ as any).label},
        {column: 'name', type: String, value: _ => (_ as any).label},
        {column: 'label', type: String, value: _ => (_ as any).label},
      ]],
      filePath: '/Users/pui/WebstormProjects/koboform/test.xls'
    })
  }

  readonly generateForm = (sections: Section[]): [KoboQuestion[], KoboChoices[]] => {
    return [
      sections.flatMap(s => [
        {
          type: 'begin_group',
          name: Utils.sanitizeString(`group_${s.label}`),
          label: s.label
        },
        ...s.questions().map(KoboForm.mapQuestionToKobo),
        {
          type: 'end_group',
          name: '',
          label: '',
        },
      ]),
      KoboForm.mapKoboChoices(this.collectedOptions)
    ]
  }

  readonly section = (label: string, questions: () => Question[]): Section => {
    this.subTitlesIndex = 'a'
    return {label: `${++this.titlesIndex}. ${label}`, questions: questions}
  }

  readonly title = (label: string, conf?: QuestionConf) => {
    const subTitles = this.subTitlesIndex
    this.subTitlesIndex = Utils.nextChar(this.subTitlesIndex)
    return this.question('TITLE', `${this.titlesIndex}.${subTitles} ${label}`, conf)
  }

  readonly question = (type: QuestionTypeWithoutOptions, label: string, conf?: QuestionConf): Question => {
    return {
      type,
      name: this.generateQuestionName(label),
      label,
      hint: conf?.hint,
      required: conf?.required,
      showIf: conf?.showIf,
    }
  }

  readonly questionRadio = (label: string, options: string[], conf?: QuestionConf): Question => {
    return this.questionMultiple('RADIO', label, options, conf)
  }

  private readonly questionMultiple = (type: QuestionTypeWithOptions, label: string, options: string[], conf?: QuestionConf): Question => {
    this.collectedOptions[Utils.makeid()] = options
    return {
      type: 'RADIO',
      name: this.generateQuestionName(label),
      label,
      options,
      hint: conf?.hint,
      required: conf?.required,
      showIf: conf?.showIf,
    }
  }

  private readonly generateQuestionName = (label: string): string => {
    return Utils.sanitizeString(label) + '_' + this.questionIndex++
  }

  readonly questionCb = (label: string, options: string[], conf?: QuestionConf): Question => {
    return this.questionMultiple('CHECKBOX', label, options, conf)
  }

  readonly questionRadioWithSpecify = (label: string, options: {label: string, specify?: boolean}[]): Question[] => {
    const radio = this.questionRadio(label, options.map(_ => _.label))
    const optionsToSpecify = options.filter(_ => _.specify === true).map(_ => _.label)
    const specifyInputs = optionsToSpecify.map(label => {
      return this.question('TEXT', label, {required: true, showIf: [{questionName: radio.name, value: label}]})
    })
    return [radio, ...specifyInputs]
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
      type: KoboForm.mapQuestionTypeToKobo(t.type),
      name: t.name,
      label: t.label,
      required: t.required,
      relevant: t.showIf ? `selected(\${${t.showIf[0].questionName}}, '${t.showIf[0].value}')` : undefined,
      appearance: t.type === 'TEXTAREA' ? 'multiline' : undefined,
      guidance_hint: t.hint,
    }
  }
}
