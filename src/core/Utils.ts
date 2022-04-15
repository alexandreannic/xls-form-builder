export class Utils {
  static readonly nextChar = (c: string) => {
    return String.fromCharCode(c.charCodeAt(0) + 1)
  }

  static readonly makeid = (length = 7) => {
    let result = ''
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
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
}
