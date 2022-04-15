import {XLSFormBuilder} from '../core/XLSFormBuilder'
import {Form} from '../core/Form'

export const formTest = () => {
const k = new Form()
new XLSFormBuilder().buildAndCreateXLS({title: 'Test'}, [
  k.section('Section 1', () => {
    const q1 = k.questionWithChoices('CHECKBOX', 'Question 1', ['Option 1', 'Option 2', 'Option 3'])
    return [
      q1,
      k.question('TEXT', 'Question 2', {
        showIfType: 'or',
        showIf: [
          {questionName: q1.name, valueName: 'Option 1'},
          {questionName: q1.name, valueName: 'Option 2'},
        ]
      })
    ]
  })
])
}
