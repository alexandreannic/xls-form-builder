import {formBIA} from './examples/FormBIA'
import {formReferral} from './examples/FormReferral'
import {formGroupSession} from './examples/FormGroupSession'
import {formTest} from './examples/FormTest'

(async () => {
  console.log('Start...')
  formBIA()
  formReferral()
  formGroupSession()
  formTest()
})()
