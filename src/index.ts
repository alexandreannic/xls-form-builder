import {formTest} from './xls-form-builder/examples/2022.pui/FormTest'
import {formGroupSession} from './xls-form-builder/examples/2022.pui/FormGroupSession'
import {formReferral} from './xls-form-builder/examples/2022.pui/FormReferral'
import {formIntake} from './xls-form-builder/examples/2022.pui/FormIntake'
import {formBIA} from './xls-form-builder/examples/2022.pui/FormBIA'
import {formFCRM} from './xls-form-builder/examples/2022.pui/FormFCRM'
import {protHH} from './xls-form-builder/examples/2023.drc/ProtHH'
import {test} from './xls-form-builder/examples/2023.drc/Test'
import {hromada} from './xls-form-builder/location/hromada'

(async () => {
  console.log('Start...')
  test()
  protHH()

  // const res: any = {}
  // Object.keys(hromada).map(k => {
  //   const z = hromada as any
  //   res[z[k]['ADM3_PCODE']] = {
  //     parent: z[k]['ADM2_PCODE'],
  //     ua: z[k]['ADM3_UA'],
  //     ru: z[k]['ADM3_RU'],
  //     en: k,
  //     _5w: z[k]['ADM3_5W'],
  //     lat_centroid: z[k]['LAT_centroid'],
  //     lon_centroid: z[k]['LON_centroid'],
  //   }
  // })
  // formBIA()
  // formReferral()
  // formGroupSession()
  // formTest()
  // formFCRM()
  // formIntake()
})()
