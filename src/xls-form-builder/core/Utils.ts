
type PipeFunction = <T, R>(fn1: (arg: T) => R, ...fns: (((arg: R) => R) | false | undefined)[]) => (arg: T) => R;

export const pipe: PipeFunction = (fn1, ...fns) => {
  return (arg) => fns.reduce((prev, fn) => fn ? fn(prev) : prev, fn1(arg))
}


export type EN_UK_Label = {en: string, uk: string}

export const pleaseSpecify_EN_UK: EN_UK_Label = {
  en: 'Please specify',
  uk: 'Будь ласка уточніть',
}

export class Utils {
  static readonly nextChar = (c: string) => {
    return String.fromCharCode(c.charCodeAt(0) + 1)
  }

  static readonly makeid = (length = 5) => {
    let result = ''
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789_'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }

  static readonly sanitizeString = (label: string): string => {
    return label
      .replaceAll(/\s/g, '_')
      .replaceAll('\'', '_')
      .replaceAll('éè', 'e')
      .replaceAll('à', 'a')
      .replaceAll('ù', 'u')
      .toLocaleLowerCase()
      .replaceAll(/[^a-z0-9_]/g, '')
  }

  static readonly regexp = {
    staffCode: '[A-Za-z0-9]{10}',
    email: '[A-Za-z0-9._%+-]+@gmail+[.][A-Za-z]{2,}$',
    phone: '^\\+?[0-9\\s]{9,}$',
  }
}
