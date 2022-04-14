export class Utils {
  static readonly nextChar = (c: string) => {
    return String.fromCharCode(c.charCodeAt(0) + 1)
  }
}
