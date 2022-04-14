import {Form, ShowIf} from '../core/Form'
import {KoboFormBuilder} from '../core/KoboFormBuilder'

export class FormBIA {

  constructor(private k = new Form()) {
    new KoboFormBuilder().buildAndCreateXLS([
      k.section('General', () => {
        return [
          k.questionRadio('Priority case', ['High', 'Medium', 'Low']),
          k.question('TEXT', 'Child protection case #'),
        ]
      }),
      k.section('Bio data', () => {
        const title = k.title(`Personnal info`)
        const firstName = k.question('TEXT', 'First name')
        const familyName = k.question('TEXT', 'Family name')
        const dateOfBirth = k.question('DATE', 'Date of birth')
        const gender = k.questionRadio('Gender', ['Female', 'Male', 'Other'])
        const title2 = k.title(`Personnal info 2`)
        const countryOfOriginAndSpecify = k.questionWithChoicesAndSpecify('RADIO', 'Country of origin', [
          {label: 'Ukraine'},
          {label: 'Other (specify)', specify: true}
        ])
        const legalStatus = k.questionRadio('Legal status', ['Refugee', 'Asylum seeker', 'Polish citizeen'])
        const educationLevel = k.question('TEXT', 'Education level')
        const languagesSpokenAndSpecify = k.questionWithChoicesAndSpecify('CHECKBOX', 'Languages spoken', [
          {label: 'English'},
          {label: 'Polish'},
          {label: 'Other (specify)', specify: true}
        ])
        const nationalitiesAndSpecify = k.questionWithChoicesAndSpecify('RADIO', 'Nationalities', [
          {label: 'Ukrainian',},
          {label: 'Not willing to disclose',},
          {label: 'Other (specify)', specify: true},
        ])
        const whatsapp = k.question('TEXT', 'WhatsApp')
        const polishPhoneNumber = k.question('TEXT', 'Polish phone number')
        const email = k.question('TEXT', 'email')
        const currentAddress = k.question('TEXT', 'Current address')
        return [
          title,
          firstName,
          familyName,
          dateOfBirth,
          gender,
          title2,
          ...countryOfOriginAndSpecify,
          legalStatus,
          educationLevel,
          ...languagesSpokenAndSpecify,
          ...nationalitiesAndSpecify,
          whatsapp,
          polishPhoneNumber,
          email,
          currentAddress,
        ]
      }),
      k.section('Care arrangements and Living conditions', () => {
        const careArrangements = k.title('Care arrangements')
        const liveWithWithSpecify = k.questionWithChoicesAndSpecify('CHECKBOX', 'Who do you currently live with?', [
          {label: 'Parent(s)'},
          {label: 'Sibling(s)'},
          {label: 'Female-headed household'},
          {label: 'Elderly Caregiver'},
          {label: 'Alone'},
          {label: 'Other children'},
          {label: 'Host family'},
          {label: 'Other (specify)', specify: true},
        ])
        const howIsYourRelationship = k.question('TEXTAREA', 'How is your relationship with your family/the people you live with? Do you like to stay here?', {
          hint: `Describe the present care arrangement from the child’s point of views. `
            + `Be detailed: what is the precise family link between child and caregiver?`
            + `Since how long do they know each other? How often were they in contact before `
            + `the child came and live with him/her? how was the relationship before? How is `
            + `the relationship now? How does the caregiver support the child? Does s/he cook for the child? `
            + `Do they eat together? Do they play together? Is the caregiver supportive when the child is facing problems?`
            + `Does the child trust the caregiver? Does the child want to live with caregiver on the long term?`
        })
        const noteAboutHome = k.note(`Ask the child how s/he would describe the place where s/he is staying?`)
        const typeOfHome = k.questionWithChoices('RADIO', `Which type of accomodation`, [
          'Owned house/apartment',
          'Host Family',
          'Renting house/apartment',
          'Collective Shelter/Centre',
          'Tent',
          'Garage or unfinished building',
          'Other (specify)',
        ])
        const housingConditionsAndSpecify = k.questionWithChoicesAndSpecify('CHECKBOX', 'Housing conditions', [
          {label: 'Overcrowding'},
          {label: 'Dangerous items in household'},
          {label: 'Unhygienic'},
          {label: 'Not suitably equipped for climate'},
          {label: 'Other (specify)', specify: true},
        ])
        const conditionIsAlone: ShowIf = {
          questionName: liveWithWithSpecify[0].name,
          value: 'Other (specify)',
        }
        // {showIf: [conditionIsAlone]}
        const titleConsultingWithParents = k.title(`Consultation with parents/ adult caregivers.`, {showIf: [conditionIsAlone]})
        const name = k.question('TEXT', `Name`, {showIf: [conditionIsAlone]})
        return [
          careArrangements,
          ...liveWithWithSpecify,
          howIsYourRelationship,
          noteAboutHome,
          typeOfHome,
          ...housingConditionsAndSpecify,
        ]
      })
    ])
  }

}
