import {formTest} from './examples/FormTest'
import {formGroupSession} from './examples/FormGroupSession'
import {formReferral} from './examples/FormReferral'
import {formIntake} from './examples/FormIntake'
import {formBIA} from './examples/FormBIA'

(async () => {
  console.log('Start...')
  formBIA()
  formReferral()
  formGroupSession()
  formTest()
  formIntake()
})()
