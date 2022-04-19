import {Utils} from './Utils'

export type QuestionTypeWithChoices = 'CHECKBOX' | 'RADIO'
export type QuestionTypeWithoutOptions = 'TEXT' |
  'TEXTAREA' |
  'DATE' |
  'INTEGER' |
  'TITLE' |
  'NOTE' |
  'DECIMAL'

export type QuestionType = QuestionTypeWithChoices | QuestionTypeWithoutOptions

export interface ShowIfCondition {
  question: Question
  value: string
  eq?: 'eq' | 'neq'
}

type ShowIfType = 'and' | 'or'

export interface ShowIf {
  showIf?: ShowIfCondition[]
  showIfType?: ShowIfType
}

export interface Question extends ShowIf {
  name: string
  default?: string
  type: QuestionType
  optionsId?: string
  label: string
  hint?: string
  required?: boolean
  constraint?: string
  constraintMessage?: string
  options?: Choice[]
}

interface QuestionWithSpecify {
  label: string
  specify?: boolean
  specifyLabel?: string
}

const isInstanceSpecify = (_: any): _ is QuestionWithSpecify => {
  return !!_.label
}
// export interface QuestionDraft {
//   type: QuestionType
//   optionsId?: string
//   label: string
//   hint?: string
//   required?: boolean
//   showIf?: ShowIf[]
//   showIfType?: ShowIfType
//   options?: string[]
// }

export interface Choice {
  label: string
  name: string
}

export type QuestionConf = Omit<Question, 'label' | 'name' | 'type' | 'optionsId' | 'options'>
// required?: boolean
// showIf?: ShowIf[]
// hint?: string
// showIfType?: ShowIfType
// }

export interface SectionConf extends ShowIf {
}

export interface Section extends SectionConf {
  label: string
  questions: () => Question[]
}

export const isSection = (s: Section | Question): s is Section => {
  return !!(s as Section).questions
}

export const isQuestions = (s: Section | Question): s is Section => {
  return !!(s as Question).type
}

export class Form {

  private questionIndex = 1

  readonly section = (label: string, questions: () => Question[], conf?: SectionConf): Section => {
    return {label, questions, ...conf}
  }

  readonly note = (label: string, conf?: QuestionConf) => {
    return this.question('NOTE', label, conf)
  }

  readonly title = (label: string, conf?: QuestionConf) => {
    return this.question('TITLE', label, conf)
  }

  // readonly add = (q: QuestionDraft): Question => {
  //   return {
  //     ...q,
  //     name: Utils.sanitizeString(q.label) + '_' + this.questionIndex++,
  //     options: q.options?.map(_ => ({label: _, name: Utils.sanitizeString(_)})),
  //   }
  // }

  private readonly registerQuestion = (q: Omit<Question, 'name'>): Question => {
    return {
      ...q,
      name: Utils.sanitizeString(q.label) + '_' + this.questionIndex++,
    }
  }

  readonly email = (label = 'Email', conf?: QuestionConf) => {
    return this.question('TEXT', label, {
      constraint: `regex(., '${Utils.regexp.email}')`,
      constraintMessage: `Invalid email`,
      ...conf,
    })
  }

  readonly phone = (label = 'Phone', conf?: QuestionConf) => {
    return this.question('TEXT', label, {
      constraint: `regex(., '${Utils.regexp.phone}')`,
      constraintMessage: `Invalid phone number (must only include numbers, spaces and may start with at +). Eg. +48886926712)`,
      ...conf,
    })
  }

  readonly question = (type: QuestionTypeWithoutOptions, label: string, conf?: QuestionConf): Question => {
    return this.registerQuestion({
      type,
      label,
      ...conf,
    })
  }

  readonly questionWithChoices = (type: QuestionTypeWithChoices, label: string, options: string[], conf?: QuestionConf): Question => {
    return this.registerQuestion({
      type: type,
      label,
      options: options.map(_ => ({label: _, name: Utils.sanitizeString(_)})),
      ...conf,
    })
  }

  readonly questionWithChoicesAndSpecify = (
    type: QuestionTypeWithChoices,
    label: string,
    options: (QuestionWithSpecify | string)[],
    conf?: QuestionConf,
  ): Question[] => {
    const mappedOptions: QuestionWithSpecify[] = options.map(_ => isInstanceSpecify(_) ? _ : {label: _, specify: false})
    const radio = this.questionWithChoices(type, label, mappedOptions.map(_ => _.label), conf)
    const specifyInputs = mappedOptions
      .filter(_ => _.specify === true)
      .map(_ => {
        return this.question('TEXT', _.specifyLabel ?? 'Please specify', {
          required: conf?.required,
          showIf: [{question: radio, value: _.label}]
        })
      })
    return [radio, ...specifyInputs]
  }
}



