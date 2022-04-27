import {XLSFormBuilder} from '../core/XLSFormBuilder'
import {Form} from '../core/Form'
import {EN_UK_Label} from '../core/Utils'

export const formTest = () => {
  const k = new Form<EN_UK_Label>({en: 'specify', uk: 'Specify'})
  new XLSFormBuilder<EN_UK_Label>().buildAndCreateXLS({title: 'Test'}, [
    k.section({en: 'Section 1', uk: 'UKKK 1'}, () => {
      const z = k.questionWithChoices('RADIO', {en: 'EN choice', uk: 'UK Choice'}, [
        {en: 'EN choice 1', uk: 'UK choice 1'},
        {en: 'EN choice 2', uk: 'UK choice 2'},
      ])
      return [
        z,
        k.question('TEXT', {en: 'EN', uk: 'UK'}, {showIf: [{question: z, value: 'EN choice 1'}]}),
      ]
    })
  ])
}
 
