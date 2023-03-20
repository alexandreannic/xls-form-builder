import {Utils} from '../Utils'

export type I18n = Record<string, string>

export interface Form2<L extends I18n> {
  title: string
  version?: string
  sections: () => Section<L>[]
}

export interface Section<L extends I18n> extends ShowIf<L> {
  name: keyof L
  questions: () => (Question2<L> | Question2<L>[])[]
}

export type QuestionTypeWithChoices = 'CHECKBOX' | 'RADIO'

export type QuestionTypeWithoutOptions = 'TEXT' |
  'TEXTAREA' |
  'DATE' |
  'INTEGER' |
  'TITLE' |
  'NOTE' |
  'DECIMAL'

export type QuestionType = QuestionTypeWithChoices | QuestionTypeWithoutOptions

export interface ShowIfCondition<L extends I18n> {
  questionName: keyof L
  value: keyof L
  eq?: 'eq' | 'neq'
}

type ShowIfType = 'and' | 'or'

export interface ShowIf<L extends I18n> {
  showIf?: ShowIfCondition<L>[] | ShowIfCondition<L>
  showIfType?: ShowIfType
}

export interface Question2<L extends I18n> extends ShowIf<L> {
  name: keyof L
  default?: string
  type: QuestionType
  optionsId?: string
  // label: keyof L
  hint?: keyof L
  // guidanceHint?: keyof L
  optional?: boolean
  constraint?: string
  constraintMessage?: keyof L
  options?: Choice<L>[]
  bold?: boolean
  italic?: boolean
  color?: string
  size?: 'small' | 'normal' | 'big'
}

interface QuestionWithSpecify<L extends I18n> {
  name: keyof L
  specify?: boolean
  specifyLabel?: keyof L
}

export interface Choice<L extends I18n> {
  // label: keyof L
  name: keyof L
}

export type QuestionProps<L extends I18n> = Omit<Question2<L>, 'optionsId' | 'options'>

export const isSection = <L extends I18n>(s: Section<L> | Question2<L>): s is Section<L> => {
  return !!(s as Section<L>).questions
}

export const isQuestions = <L extends I18n>(s: Section<L> | Question2<L>): s is Section<L> => {
  return !!(s as Question2<L>).type
}

export class FormCreator<L extends I18n> {

  constructor(private i18n: {
    specifyLabel: keyof L,
    specifyOptionLabel: keyof L,
    invalidEmail: keyof L,
    invalidPhone: keyof L,
  }) {
  }

  readonly section = (props: Section<L>): Section<L> => {
    return {...props}
  }

  readonly note = (props: Omit<QuestionProps<L>, 'type'>) => {
    return this.question({...props, type: 'NOTE'})
  }

  readonly title = (props: Omit<QuestionProps<L>, 'type'>) => {
    return this.question({...props, type: 'TITLE'})
  }

  readonly label = (props: Omit<QuestionProps<L>, 'optional' | 'type'>) => {
    return this.note({...props, bold: true})
  }

  private readonly registerQuestion = (q: Question2<L>): Question2<L> => {
    return {
      ...q,
    }
  }

  readonly email = (props: Omit<QuestionProps<L>, 'type'>) => {
    return this.question({
      ...props,
      type: 'TEXT',
      constraint: `regex(., '${Utils.regexp.email}')`,
      constraintMessage: this.i18n.invalidEmail,
    })
  }

  readonly phone = (props: Omit<QuestionProps<L>, 'type'>) => {
    return this.question({
      ...props,
      constraint: `regex(., '${Utils.regexp.phone}')`,
      constraintMessage: this.i18n.invalidPhone,
      type: 'TEXT'
    })
  }

  readonly question = (props: Omit<QuestionProps<L>, 'type'> & {type?: QuestionTypeWithoutOptions}): Question2<L> => {
    return this.registerQuestion({
      type: 'TEXT',
      ...props,
    })
  }

  readonly questionWithChoices = (props: Omit<QuestionProps<L>, 'type'> & {
    multiple?: boolean,
    options: (keyof L)[],
    defineExclusiveOption?: keyof L | (keyof L)[],
  }): Question2<L> => {
    return this.registerQuestion({
      ...props,
      ...props.defineExclusiveOption && {
        constraint: [props.defineExclusiveOption ?? []].flat().map(_ => 
          `not(selected(., '${_ as string}') and (${props.options.map(o => `selected(., '${o as string}')`).join(' or ')}))`,
        ).join(' and ')
      },
      type: props.multiple ? 'CHECKBOX' : 'RADIO',
      options: props.options.map(_ => ({name: _})),
    })
  }

  readonly questionWithChoicesAndOtherSpecify = (props: Omit<QuestionProps<L>, 'type'> & {
    multiple?: boolean
    options: (QuestionWithSpecify<L> | keyof L)[],
    defineExclusiveOption?: keyof L,
  }) => {
    return this.questionWithChoicesAndSpecify({
      ...props,
      options: [
        ...props.options,
        {name: this.i18n.specifyOptionLabel, specify: true},
      ]
    })

  }

  readonly questionWithChoicesAndSpecify = (props: Omit<QuestionProps<L>, 'type'> & {
    multiple?: boolean
    defineExclusiveOption?: keyof L,
    options: (QuestionWithSpecify<L> | keyof L)[]
  },): Question2<L>[] => {
    const harmonizedOptions: QuestionWithSpecify<L>[] = props.options.map(_ => typeof _ === 'string' ? {name: _, specify: false} : _) as any
    const radio = this.questionWithChoices({
      ...props,
      options: harmonizedOptions.map(_ => _.name)
    })
    const specifyInputs = harmonizedOptions
      .filter(_ => _.specify === true)
      .map(_ => {
        return this.question({
          name: this.i18n.specifyLabel,
          type: 'TEXT',
          optional: props?.optional,
          showIf: [{questionName: radio.name, value: _.name}]
        })
      })
    return [radio, ...specifyInputs]
  }
}



