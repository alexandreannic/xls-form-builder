import {KoboForm} from '../KoboForm'

export class FormBIA {

  constructor(private k = new KoboForm()) {
    const x = k.generateForm([
      k.section('General', () => {
        return [
          k.questionRadio('Priority case', ['High', 'Medium', 'Low']),
          k.question('TEXT', 'Child protection case #'),
        ]
      }),
      k.section('Bio data', () => {
        const firstName = k.question('TEXT', 'First name')
        const familyName = k.question('TEXT', 'Family name')
        const dateOfBirth = k.question('DATE', 'Date of birth')
        const gender = k.questionRadio('Gender', ['Female', 'Male', 'Other'])
        const countryOfOrigin = k.questionRadioWithSpecify('Country of origin', [
          {label: 'Ukraine'},
          {label: 'Other (specify)', specify: true}
        ])
        return [
          firstName,
          familyName,
          dateOfBirth,
          gender,
          ...countryOfOrigin,
        ]
      })
    ])
    console.log('print xls')
    KoboForm.printForm(x, k.collectedOptions)
  }

}
