import writeXlsxFile from 'write-excel-file/node'

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

export class KoboForm {
  private titlesIndex = 0
  private subTitlesIndex = 'a'
  private questionIndex = 0
  collectedOptions: string[][] = []

  constructor() {
  }

  static readonly printForm = (k: KoboQuestion[], options: string[][]) => {
    console.log(k)
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

  readonly generateForm = (sections: Section[]): KoboQuestion[] => {
    return sections.flatMap(s => [
      {
        type: 'begin_group',
        name: this.generateName(`group_${s.label}`),
        label: s.label
      },
      ...s.questions().map(KoboForm.mapQuestionToKobo),
      {
        type: 'end_group',
        name: '',
        label: '',
      },
    ])
  }

  readonly section = (label: string, questions: () => Question[]): Section => {
    this.subTitlesIndex = 'a'
    return {label: `${this.titlesIndex++}. label`, questions: questions}
  }

  readonly title = (label: string, conf?: QuestionConf) => {
    return this.question('TITLE', label)
  }

  readonly question = (type: QuestionTypeWithoutOptions, label: string, conf?: QuestionConf): Question => {
    return {
      type,
      name: this.generateName(label),
      label,
      hint: conf?.hint,
      required: conf?.required,
      showIf: conf?.showIf,
    }
  }

  readonly questionRadio = (label: string, options: string[], conf?: QuestionConf): Question => {
    return {
      type: 'RADIO',
      name: this.generateName(label),
      label,
      options,
      hint: conf?.hint,
      required: conf?.required,
      showIf: conf?.showIf,
    }
  }

  readonly questionCb = (label: string, options: string[], conf?: QuestionConf): Question => {
    return {
      type: 'CHECKBOX',
      name: this.generateName(label),
      label,
      options,
      hint: conf?.hint,
      required: conf?.required,
      showIf: conf?.showIf,
    }
  }

  readonly questionRadioWithSpecify = (label: string, options: {label: string, specify?: boolean}[]): Question[] => {
    const radio = this.questionRadio(label, options.map(_ => _.label))
    const optionsToSpecify = options.filter(_ => _.specify === true).map(_ => _.label)
    const specifyInputs = optionsToSpecify.map(label => {
      return this.question('TEXT', label, {required: true, showIf: [{questionName: radio.name, value: label}]})
    })
    return [radio, ...specifyInputs]
  }

  private readonly generateName = (label: string): string => {
    return label
      .replaceAll(/\s/g, '_')
      .replaceAll('\'', '_')
      .replaceAll('éè', 'e')
      .replaceAll('à', 'a')
      .replaceAll('ù', 'u')
      .replaceAll(/[^a-z_]/g, '')
      .toLocaleLowerCase() + ('_' + this.questionIndex++)
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
