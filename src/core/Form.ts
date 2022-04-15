import {Utils} from './Utils'

export type QuestionTypeWithChoices = 'CHECKBOX' | 'RADIO'
export type QuestionTypeWithoutOptions = 'TEXT' | 'TEXTAREA' | 'DATE' | 'NUMBER' | 'TITLE' | 'NOTE'
export type QuestionType = QuestionTypeWithChoices | QuestionTypeWithoutOptions

export interface ShowIf {
  questionName: string
  valueName: string
  eq?: 'eq' | 'neq'
}

type ShowIfType = 'and' | 'or'

export interface Question {
  name: string
  type: QuestionType
  optionsId?: string
  label: string
  hint?: string
  required?: boolean
  showIf?: ShowIf[]
  showIfType?: ShowIfType
  options?: Choice[]
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

export interface QuestionConf {
  required?: boolean
  showIf?: ShowIf[]
  hint?: string
  showIfType?: ShowIfType
}

export interface Section {
  label: string
  questions: () => Question[]
}

export class Form {
  private questionIndex = 0

  readonly section = (label: string, questions: () => Question[]): Section => {
    return {label, questions}
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

  readonly question = (type: QuestionTypeWithoutOptions, label: string, conf?: QuestionConf): Question => {
    return {
      type,
      name: Utils.sanitizeString(label) + '_' + this.questionIndex++,
      label,
      ...conf,
    }
  }

  readonly questionWithChoices = (type: QuestionTypeWithChoices, label: string, options: string[], conf?: QuestionConf): Question => {
    return {
      type: type,
      name: Utils.sanitizeString(label),
      label,
      options: options.map(_ => ({label: _, name: Utils.sanitizeString(_)})),
      ...conf,
    }
  }

  readonly questionWithChoicesAndSpecify = (
    type: QuestionTypeWithChoices,
    label: string,
    options: {label: string, specify?: boolean, specifyLabel?: string}[],
    conf?: QuestionConf,
  ): Question[] => {
    const radio = this.questionWithChoices(type, label, options.map(_ => _.label), conf)
    const optionsToSpecify = options.filter(_ => _.specify === true)
    const specifyInputs = optionsToSpecify.map(_ => {
      return this.question('TEXT', _.specifyLabel ?? 'Please specify', {showIf: [{questionName: radio.name, valueName: Utils.sanitizeString(_.label)}]})
    })
    return [radio, ...specifyInputs]
  }
}
