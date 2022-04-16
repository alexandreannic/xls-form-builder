import {Form} from '../core/Form'
import {XLSFormBuilder} from '../core/XLSFormBuilder'
import {Common} from './Common'

const formGroupSession = () => {
  const k = new Form()
  return new XLSFormBuilder().buildAndCreateXLS({title: 'Group session form'}, [
    k.section('General informations', () => {
      return [
        Common.today(k),
        ...Common.polishBase(k),
        Common.staffCode(k, 'Staff code (1)'),
        Common.staffCode(k, 'Staff code (2)'),
      ]
    })
  ])
}
