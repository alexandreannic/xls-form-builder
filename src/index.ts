import {formTest} from './examples/FormTest'
import {formGroupSession} from './examples/FormGroupSession'
import {formReferral} from './examples/FormReferral'
import {formIntake} from './examples/FormIntake'

(async () => {
  console.log('Start...')
  // formBIA()
  formReferral()
  formGroupSession()
  formTest()
  formIntake()
})()
