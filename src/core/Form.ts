import writeXlsxFile from 'write-excel-file/node'
import {Utils} from './Utils'

export type QuestionTypeWithChoices = 'CHECKBOX' | 'RADIO'
export type QuestionTypeWithoutOptions = 'TEXT' | 'TEXTAREA' | 'DATE' | 'NUMBER' | 'TITLE' | 'NOTE'
export type QuestionType = QuestionTypeWithChoices | QuestionTypeWithoutOptions

export interface ShowIf {
  questionName: string
  value: string
}

export interface Question {
  name: string
  type: QuestionType
  optionsId?: string
  label: string
  hint?: string
  required?: boolean
  showIf?: ShowIf[]
  options?: string[]
}

export interface QuestionConf {
  required?: boolean
  showIf?: ShowIf[]
  hint?: string
}

export interface Section {
  label: string
  questions: () => Question[]
}

export class Form {

  readonly section = (label: string, questions: () => Question[]): Section => {
    return {label, questions}
  }

  readonly note = (label: string, conf?: QuestionConf) => {
    return this.question('NOTE', label, conf)
  }

  readonly title = (label: string, conf?: QuestionConf) => {
    return this.question('TITLE', label, conf)
  }

  readonly question = (type: QuestionTypeWithoutOptions, label: string, conf?: QuestionConf): Question => {
    return {
      type,
      name: Utils.sanitizeString(label),
      label,
      hint: conf?.hint,
      required: conf?.required,
      showIf: conf?.showIf,
    }
  }

  readonly questionRadio = (label: string, options: string[], conf?: QuestionConf): Question => {
    return this.questionWithChoices('RADIO', label, options, conf)
  }

  readonly questionWithChoices = (type: QuestionTypeWithChoices, label: string, options: string[], conf?: QuestionConf): Question => {
    return {
      type: 'RADIO',
      name: Utils.sanitizeString(label),
      label,
      options,
      hint: conf?.hint,
      required: conf?.required,
      showIf: conf?.showIf,
    }
  }

  readonly questionCb = (label: string, options: string[], conf?: QuestionConf): Question => {
    return this.questionWithChoices('CHECKBOX', label, options, conf)
  }

  readonly questionWithChoicesAndSpecify = (type: QuestionTypeWithChoices, label: string, options: {label: string, specify?: boolean}[]): Question[] => {
    const radio = this.questionWithChoices(type, label, options.map(_ => _.label))
    const optionsToSpecify = options.filter(_ => _.specify === true).map(_ => _.label)
    const specifyInputs = optionsToSpecify.map(label => {
      return this.question('TEXT', label, {required: true, showIf: [{questionName: radio.name, value: Utils.sanitizeString(label)}]})
    })
    return [radio, ...specifyInputs]
  }
}
