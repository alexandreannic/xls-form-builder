import {Utils} from '../Utils'

export type I18n = Record<string, string>

export type KoboTheme = 'theme-grid no-text-transform'

export interface Form2<L extends I18n> {
  title: string
  version?: string
  sections: Section<L>[]
  style?: KoboTheme
}

export interface Section<L extends I18n> extends ShowIf<L> {
  name: keyof L
  questions: (Question2<L> | Question2<L>[])[]
}

export type QuestionTypeWithChoices = 'CHECKBOX' | 'RADIO'

export type QuestionTypeWithoutOptions = 'TEXT' |
  'alert_info' |
  'alert_warn' |
  'TEXTAREA' |
  'DATE' |
  'INTEGER' |
  'TITLE' |
  'CALCULATE' |
  'NOTE' |
  'DIVIDER' |
  'DECIMAL'

export type QuestionType = QuestionTypeWithChoices | QuestionTypeWithoutOptions

export interface ShowIfCondition<L extends I18n> {
  questionName: string
  value: keyof L | string | number
  op?: '=' | '!=' | '<' | '>' | '>=' | '<='
}

type ShowIfType = 'and' | 'or'

export interface ShowIf<L extends I18n> {
  showIf?: ShowIfCondition<L>[] | ShowIfCondition<L> | ShowIf<L>[]
  showIfType?: ShowIfType | ShowIfType[]
}

export const isShowIf = <T extends I18n>(_: any): _ is ShowIf<T> => {
  return !!_.showIfType
}
export const isShowIfCondition = <T extends I18n>(_: any): _ is ShowIfCondition<T> => {
  return !!_.questionName
}

export interface Question2<L extends I18n> extends ShowIf<L> {
  id?: string
  col?: number,
  appearance?: 'month-year' | 'minimal autocomplete' | 'autocomplete' | 'horizontal' | 'minimal' | 'horizontal-compact' | 'likert'
  name: string
  default?: string
  calculation?: string
  type: QuestionType
  optionsId?: string
  choiceFilter?: string
  label?: keyof L
  hint?: keyof L
  // guidanceHint?: keyof L
  optional?: boolean
  constraint?: string
  constraintMessage?: keyof L
  options?: Choice<L>[]
  bold?: boolean
  italic?: boolean
  color?: string
  moveOptionsToExternalFile?: string
  size?: 'small' | 'normal' | 'big'
  borderTop?: boolean
}

export interface Choice<L extends I18n> {
  // label: keyof L
  name: keyof L
  tag?: string
  tag1?: string
}

interface ChoiceWithSpecify<L extends I18n> extends Choice<L> {
  specify?: boolean
  specifyLabel?: keyof L
}

export type QuestionProps<L extends I18n> = Omit<Question2<L>, 'optionsId' | 'options'>

export const isSection = <L extends I18n>(s: Section<L> | Question2<L>): s is Section<L> => {
  return !!(s as Section<L>).questions
}

export const isQuestions = <L extends I18n>(s: Section<L> | Question2<L>): s is Section<L> => {
  return !!(s as Question2<L>).type
}

export class FormCreator<L extends I18n> {

  private readonly maxOptionsBeforeDropDown = 10

  constructor(private i18n: {
    specifyLabel: keyof L,
    specifyOptionLabel: keyof L,
    invalidEmail: keyof L,
    invalidPhone: keyof L,
  }) {
  }

  readonly genRelevant = (t: Pick<Question2<L>, 'showIf' | 'showIfType'> & Partial<Pick<Question2<L>, 'type'>>): string | undefined => {
    if (t.showIf) {
      return [t.showIf].flat()
        .map(condition => {
          if (isShowIf(condition)) return '(' + (this.genRelevant(condition) ?? '') + ')'
          if (isShowIfCondition(condition)) {
            if (condition.op) {
              return `\${${condition.questionName}}${condition.op ?? '='}'${condition.value}'`
            }
            return `selected(\${${condition.questionName}}, '${condition.value}')`
          }
        })
        .join(` ${t.showIfType ?? 'and'} `)
    }
  }

  readonly calculate = (props: Pick<QuestionProps<L>, 'calculation'> & {name: string}) => {
    return this.question({
      type: 'CALCULATE',
      calculation: props.calculation,
      name: props.name,
    })
  }

  readonly alertInfo = (props: Omit<QuestionProps<L>, 'moveOptionsToExternalFile' | 'type'>) => {
    return this.question({...props, type: 'alert_info'})
  }

  readonly alertWarn = (props: Omit<QuestionProps<L>, 'moveOptionsToExternalFile' | 'type'>) => {
    return this.question({...props, type: 'alert_warn'})
  }

  readonly divider = (props: Partial<Omit<QuestionProps<L>, 'label' | 'type'>>) => {
    return this.question({
      type: 'DIVIDER',
      name: props.name ?? ('divider' + Utils.makeid()),
      ...props,
    })
  }

  readonly section = (props: Section<L>): Section<L> => {
    return {...props}
  }

  readonly note = (props: Omit<QuestionProps<L>, 'moveOptionsToExternalFile' | 'type'>) => {
    return this.question({...props, type: 'NOTE'})
  }

  readonly title = (props: Omit<QuestionProps<L>, 'moveOptionsToExternalFile' | 'type'>) => {
    return this.question({...props, type: 'TITLE'})
  }

  readonly label = (props: Omit<QuestionProps<L>, 'moveOptionsToExternalFile' | 'optional' | 'type'>) => {
    return this.note({...props, bold: true})
  }

  private readonly registerQuestion = (q: Question2<L>): Question2<L> => {
    return {
      ...q,
      label: q.label ?? q.name,
    }
  }

  readonly email = (props: Omit<QuestionProps<L>, 'moveOptionsToExternalFile' | 'type'>) => {
    return this.question({
      ...props,
      type: 'TEXT',
      constraint: `regex(., '${Utils.regexp.email}')`,
      constraintMessage: this.i18n.invalidEmail,
    })
  }

  readonly phone = (props: Omit<QuestionProps<L>, 'moveOptionsToExternalFile' | 'type'>) => {
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
    options: Choice<L>[] | (keyof L)[],
    defineExclusiveOption?: keyof L | (keyof L)[],
  }): Question2<L> => {
    const options = props.options.map(_ => typeof _ === 'object' ? _ : ({name: _}))
    const exclusions = [props.defineExclusiveOption ?? []].flat()
    return this.registerQuestion({
      appearance: props.options.length > this.maxOptionsBeforeDropDown ? 'minimal' : undefined,
      ...props,
      ...props.defineExclusiveOption && {
        constraintMessage: 'cannot_have_options_checked_together',
        constraint: exclusions.map(_ =>
          `not(selected(., '${_ as string}') and (${options.filter(o => o.name !== _).map(o => `selected(., '${o.name as string}')`).join(' or ')}))`,
        ).join(' and ')
      },
      type: props.multiple ? 'CHECKBOX' : 'RADIO',
      options,
    })
  }

  readonly questionWithChoicesAndOtherSpecify = (props: Omit<QuestionProps<L>, 'type'> & {
    multiple?: boolean
    options: (ChoiceWithSpecify<L> | keyof L)[],
    defineExclusiveOption?: keyof L | (keyof L)[],
  }): Question2<L>[] => {
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
    defineExclusiveOption?: keyof L | (keyof L)[],
    options: (ChoiceWithSpecify<L> | keyof L)[]
  },): Question2<L>[] => {
    const harmonizedOptions: ChoiceWithSpecify<L>[] = props.options.map(_ => typeof _ === 'string' ? {name: _, specify: false} : _) as any
    const radio = this.questionWithChoices({
      ...props,
      options: harmonizedOptions.map(_ => _.name)
    })
    const specifyInputs = harmonizedOptions
      .filter(_ => _.specify === true)
      .map(_ => {
        return this.question({
          name: (this.i18n.specifyLabel as string) + Utils.makeid(),
          label: this.i18n.specifyLabel,
          type: 'TEXT',
          optional: true,
          showIf: [{questionName: radio.name, value: _.name}]
        })
      })
    return [radio, ...specifyInputs]
  }
}



