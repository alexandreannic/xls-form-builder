import {Utils} from '../Utils'

export type I18NLabel = {en: string} & {[key: string]: string}

export type Label = I18NLabel | string
export type QuestionTypeWithChoices = 'CHECKBOX' | 'RADIO'

export type QuestionTypeWithoutOptions = 'TEXT' |
  'TEXTAREA' |
  'DATE' |
  'INTEGER' |
  'TITLE' |
  'NOTE' |
  'DECIMAL'

export type QuestionType = QuestionTypeWithChoices | QuestionTypeWithoutOptions

export interface ShowIfCondition<L extends Label> {
  question: Question<L>
  value: string
  eq?: 'eq' | 'neq'
}

type ShowIfType = 'and' | 'or'

export interface ShowIf<L extends Label> {
  showIf?: ShowIfCondition<L>[]
  showIfType?: ShowIfType
}

export interface Question<L extends Label> extends ShowIf<L> {
  name: string
  default?: string
  type: QuestionType
  optionsId?: string
  label: L
  hint?: L
  required?: boolean
  constraint?: string
  constraintMessage?: string
  options?: Choice<L>[]
  bold?: boolean
  italic?: boolean
  size?: 'small' | 'normal' | 'big'
}

interface QuestionWithSpecify<L extends Label> {
  label: L
  specify?: boolean
  specifyLabel?: L
}

const isInstanceSpecify = <L extends Label>(_: any): _ is QuestionWithSpecify<L> => {
  return !!_.label
}

export interface Choice<L extends Label> {
  label: L
  name: string
}

export type QuestionConf<L extends Label> = Omit<Question<L>, 'label' | 'name' | 'type' | 'optionsId' | 'options'>

export interface SectionConf<L extends Label> extends ShowIf<L> {
}

export interface Section<L extends Label> extends SectionConf<L> {
  label: L
  questions: () => Question<L>[]
}

export const isSection = <L extends Label>(s: Section<L> | Question<L>): s is Section<L> => {
  return !!(s as Section<L>).questions
}

export const isQuestions = <L extends Label>(s: Section<L> | Question<L>): s is Section<L> => {
  return !!(s as Question<L>).type
}

export class Form<L extends Label = string> {

  constructor(private specifyLabel: L) {
  }

  readonly section = (label: L, questions: () => Question<L>[], conf?: SectionConf<L>): Section<L> => {
    return {label, questions, ...conf}
  }

  readonly note = (label: L, conf?: QuestionConf<L>) => {
    return this.question('NOTE', label, conf)
  }

  readonly title = (label: L, conf?: QuestionConf<L>) => {
    return this.question('TITLE', label, conf)
  }

  readonly label = (label: L, conf?: QuestionConf<L>) => {
    return this.note(label, {...conf, bold: true})
  }

  private readonly registerQuestion = (q: Omit<Question<L>, 'name'>): Question<L> => {
    return {
      ...q,
      name: Utils.sanitizeString(typeof q.label === 'object' ? q.label.en : q.label) + '_' + Utils.makeid(),
    }
  }

  readonly email = (label: L, conf?: QuestionConf<L>) => {
    return this.question('TEXT', label, {
      constraint: `regex(., '${Utils.regexp.email}')`,
      constraintMessage: `Invalid email`,
      ...conf,
    })
  }

  readonly phone = (label: L, conf?: QuestionConf<L>) => {
    return this.question('TEXT', label, {
      constraint: `regex(., '${Utils.regexp.phone}')`,
      constraintMessage: `Invalid phone number (must only include numbers, spaces and may start with +). Example +48886123123)`,
      ...conf,
    })
  }

  readonly question = (type: QuestionTypeWithoutOptions, label: L, conf?: QuestionConf<L>): Question<L> => {
    return this.registerQuestion({
      type,
      label,
      ...conf,
    })
  }

  readonly questionWithChoices = (type: QuestionTypeWithChoices, label: L, options: L[], conf?: QuestionConf<L>): Question<L> => {
    return this.registerQuestion({
      type: type,
      label,
      options: options.map(_ => ({label: _, name: Utils.sanitizeString(typeof _ === 'object' ? _.en : _)})),
      ...conf,
    })
  }

  readonly questionWithChoicesAndSpecify = (
    type: QuestionTypeWithChoices,
    label: L,
    options: (QuestionWithSpecify<L> | L)[],
    conf?: QuestionConf<L>,
  ): Question<L>[] => {
    const harmonizedOptions: QuestionWithSpecify<L>[] = options.map(_ => isInstanceSpecify(_) ? _ : {label: _ as L, specify: false})
    const radio = this.questionWithChoices(type, label, harmonizedOptions.map(_ => _.label), conf)
    const specifyInputs = harmonizedOptions
      .filter(_ => _.specify === true)
      .map(_ => {
        return this.question('TEXT', _.specifyLabel ?? this.specifyLabel, {
          required: conf?.required,
          showIf: [{question: radio, value: typeof _.label === 'object' ? _.label.en : _.label}]
        })
      })
    return [radio, ...specifyInputs]
  }
}



