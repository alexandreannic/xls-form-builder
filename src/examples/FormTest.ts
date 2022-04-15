import {XLSFormBuilder} from '../core/XLSFormBuilder'
import {Form} from '../core/Form'

export const formTest = () => {
  const k = new Form()
  new XLSFormBuilder().buildAndCreateXLS({title: 'Test'}, [
    k.section('s1', () => {
      const q1 = k.questionWithChoices('CHECKBOX', 'q1', ['o1', 'o2', 'o3'])
      return [
        q1,
        k.question('TEXT', 'q2', {
          showIfType: 'or',
          showIf: [
            {questionName: q1.name, valueName: 'o1'},
            {questionName: q1.name, valueName: 'o2'},
          ]
        })
      ]
    })
  ])
}
