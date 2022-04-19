import {XLSFormBuilder} from '../core/XLSFormBuilder'
import {Form} from '../core/Form'
import {Common} from './Common'

export const formTest = () => {
  const k = new Form()
  new XLSFormBuilder().buildAndCreateXLS({title: 'Test'}, [
    k.section('Section 1', () => {
      return [
        ...Common.contactDetails(k)
      ]
    })
  ])
}
