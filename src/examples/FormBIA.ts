import {Form, Question, QuestionConf} from '../core/Form'
import {KoboFormBuilder} from '../core/KoboFormBuilder'
import {Common} from './Common'

export const formBIA = () => {
  const k = new Form()
  const gender = (label = 'Gender', conf?: QuestionConf) => k.questionWithChoices('RADIO', label, ['Female', 'Male', 'Other'], conf)
  const nationalitiesAndSpecify = (label = 'Nationalities', conf?: QuestionConf) => k.questionWithChoicesAndSpecify('CHECKBOX', label, [
    {label: 'Ukrainian',},
    {label: 'Not willing to disclose',},
    {label: 'Other (specify)', specify: true},
  ], conf)
  new KoboFormBuilder().buildAndCreateXLS({title: 'BIA Form'}, [
    k.section('General', () => {
      return [
        Common.priorityRate(k),
        k.question('TEXT', 'Child protection case #'),
      ]
    }),
    k.section('Bio data', () => {
      const titlePersonalINfo = k.title(`Personal info`)
      const firstName = k.question('TEXT', 'First name')
      const familyName = k.question('TEXT', 'Family name')
      const dateOfBirth = k.question('DATE', 'Date of birth')
      const placeOfBirth = k.question('TEXT', 'Place of birth')
      const countryOfOriginAndSpecify = k.questionWithChoicesAndSpecify('RADIO', 'Country of origin', [
        {label: 'Ukraine'},
        {label: 'Other (specify)', specify: true}
      ])
      const legalStatus = k.questionWithChoices('RADIO', 'Legal status', ['Refugee', 'Asylum seeker', 'Polish citizeen'])
      const educationLevel = k.question('TEXT', 'Education level')
      const languagesSpokenAndSpecify = k.questionWithChoicesAndSpecify('CHECKBOX', 'Languages spoken', [
        {label: 'English'},
        {label: 'Polish'},
        {label: 'Other (specify)', specify: true}
      ])
      const whatsapp = k.question('TEXT', '📞 WhatsApp')
      const polishPhoneNumber = k.question('TEXT', '📞 Polish phone number')
      const email = k.question('TEXT', '✉️ Email')
      const currentAddress = k.question('TEXT', '🏠 Current address')
      return [
        titlePersonalINfo,
        firstName,
        familyName,
        dateOfBirth,
        placeOfBirth,
        gender(),
        ...countryOfOriginAndSpecify,
        legalStatus,
        educationLevel,
        ...languagesSpokenAndSpecify,
        ...nationalitiesAndSpecify(),
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
          + `Be detailed: what is the precise family link between child and caregiver? `
          + `Since how long do they know each other? How often were they in contact before `
          + `the child came and live with him/her? how was the relationship before? How is `
          + `the relationship now? How does the caregiver support the child? Does s/he cook for the child? `
          + `Do they eat together? Do they play together? Is the caregiver supportive when the child is facing problems? `
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


      const conditionIsNotAlone: Pick<QuestionConf, 'showIf' | 'showIfType'> = {
        showIfType: 'or',
        showIf:
          [
            // {questionName: liveWithWithSpecify[0].name, value: 'Parent(s)'},
            // {questionName: liveWithWithSpecify[0].name, value: 'Sibling(s)'},
            // {questionName: liveWithWithSpecify[0].name, value: 'Female-headed household'},
            // {questionName: liveWithWithSpecify[0].name, value: 'Elderly Caregiver'},
            // {questionName: liveWithWithSpecify[0].name, value: 'Other children'},
            // {questionName: liveWithWithSpecify[0].name, value: 'Host family'},
            // {questionName: liveWithWithSpecify[0].name, value: 'Other (specify)'},
            {questionName: liveWithWithSpecify[0].name, valueName: liveWithWithSpecify[0].options!.find(_ => _.label === 'Alone')!.name, eq: 'neq'},
          ]
      }
      // {showIf: [conditionIsAlone]}
      const titleConsultingWithParents = k.title(`Consultation with parents/adult caregivers`, conditionIsNotAlone)
      const name = k.question('TEXT', `Name`, conditionIsNotAlone)
      const relationShip = k.question('TEXT', 'Relationship to child', conditionIsNotAlone)
      const legalGuardian = k.questionWithChoicesAndSpecify('RADIO', `Are you the legal guardian for this child?`, [
        {label: 'Yes (specify)', specify: true, specifyLabel: 'Are guardianship documents available?'},
        {label: 'Not legally, but with permission of the parents'},
        {label: 'No'},
      ])
      const howIsRelationShip = k.question('TEXTAREA', `How would you describe your relationship with the child?`, conditionIsNotAlone)
      const howIsChildWithOther = k.question(
        'TEXTAREA',
        `How is the child getting along with other children? What daily activities are they engaged in?`,
        conditionIsNotAlone
      )
      const whatInfo = k.question(
        'TEXTAREA',
        'IF SEPARATED OR UNACCOMPANIED ONLY: What information do you have about the child, his/her life and the family separation? Include information about status of father or mother, any contact caregiver has with child’s other family members, etc.',
        conditionIsNotAlone
      )
      return [
        careArrangements,
        ...liveWithWithSpecify,
        howIsYourRelationship,
        noteAboutHome,
        typeOfHome,
        ...housingConditionsAndSpecify,
        titleConsultingWithParents,
        name,
        gender(undefined, conditionIsNotAlone),
        ...nationalitiesAndSpecify(undefined, conditionIsNotAlone),
        relationShip,
        ...legalGuardian,
        howIsRelationShip,
        howIsChildWithOther,
        whatInfo
      ]
    }),
    k.section('Tracing needs', () => {
      return [
        k.question('TEXT', 'When did you arrive in Poland?'),
        k.question('TEXTAREA', 'Do you have any relatives or friends in Poland? If so, provide name, relationship.'),
        k.question('TEXTAREA',
          `Would you like to receive help to find some of your family members?  If so, note whom the child would like to trace and any information the child has about relatives' location.`),
        k.question('TEXTAREA', `Is tracing taking place? If yes, by which agency? Is the child being informed about the tracing results? Are there additional needs?`),
      ]
    }),
    k.section('Health and Safety', () => {
      const safetyTitle = k.title(`Safety/Security`)
      const feelSafe = k.question('TEXTAREA', 'Do you feel safe here (in your accommodation, in your neighbourhood, etc) ? If not what are the reasons, list any concerns.')
      const howDidWay = k.question('TEXTAREA', 'How did you make your way to Poland. Is there anything you would like to tell about your flight?')
      const psychosocialWellbeing = k.title(`Psychosocial wellbeing`)
      const whereDiscussProblems = k.questionWithChoices('CHECKBOX', `Where/to whom do you go to discuss problems or ask for help/assistance?`, [
        'Mother',
        'Father',
        'Friends',
        'Neighbours',
        'Other family member (specify)',
        'Other (specify)',
        'No One',
      ])
      const showIfOtherFamily = [{questionName: whereDiscussProblems.name, valueName: whereDiscussProblems.options!.find(_ => _.label === 'Other family member (specify)')!.name}]
      const showIfOther = [{questionName: whereDiscussProblems.name, valueName: whereDiscussProblems.options!.find(_ => _.label === 'Other (specify)')!.name}]
      const otherFamilySpecify = k.question('TEXT', `Please specify other family member`, {showIf: showIfOtherFamily})
      const otherSpecify = k.question('TEXT', `Please specify other`, {showIf: showIfOther})
      const healAccess = k.title(`Health/medical access`)
      const howAreYou = k.question('TEXTAREA', 'How are you feeling? How is your health?')
      const anyProblems = k.question('TEXTAREA', 'Do you have any problems accessing medical care?', {
        hint: 'Does the child know where and how to access care) If so, explain why.'
      })
      const observations = k.question('TEXTAREA', 'Interviewer observations', {
        hint: 'Does the child look healthy and/or have any disabilities?'
      })
      return [
        safetyTitle,
        feelSafe,
        howDidWay,
        psychosocialWellbeing,
        whereDiscussProblems,
        otherFamilySpecify,
        otherSpecify,
        healAccess,
        howAreYou,
        anyProblems,
        observations,
      ]
    }),
    k.section('Daily life', () => {
      const noteTellMe = k.note(`Can you tell me a bit about what you do each day?`)
      const titleEducation = k.title(`Education`)
      const doYouAttendSchoolRegularly = k.questionWithChoices('RADIO', `Do you attend school regularly?`, [
        'I always attend school',
        'Don’t attend school at all',
        'Once per week',
        'Once per month',
        'Never',
      ])
      const whatGradeAreYouIn = k.question('TEXT', `What grade are you in (in Poland)`)
      const anyDifficulties = k.question('TEXTAREA', 'Do you have any difficulties or problems at school or going to school?', {
        hint: 'If so, what are they?'
      })
      const titleDailyActivities = k.title(`Daily activities`)
      const whatYouDoEachDay = k.question('TEXTAREA', `Can you tell me a little bit about what you do each day? Do you spend time with friends, other children?`)
      const doYouWork = k.questionWithChoices('RADIO', `Do you currently work?`, ['Yes', 'No'])
      const showIf = [{questionName: doYouWork.name, valueName: doYouWork.options!.find(_ => _.label === 'Yes')!.name}]
      const howManyHours = k.question('TEXT', 'How many hours per day', {showIf})
      const howManyDaysPerWeek = k.question('TEXT', 'How many days per week', {showIf})
      const typeOfWork = k.question('TEXT', 'Type of work', {showIf})
      const forHowManyMonths = k.question('TEXT', 'For how many months', {showIf})
      const doYouEarnMoney = k.question('TEXTAREA', 'Do you earn any money for the work?', {
        hint: 'Is so, how much and what do you use it for. '
      })
      const doesFamilyDepend = k.questionWithChoicesAndSpecify('RADIO', `Does your family depend on the money you earn ?`, [
        {label: 'Yes', specify: true},
        {label: 'No'},
      ])
      const noteInterviewerObservations = k.note(`Interviewer observations`)
      const interviewerObservations = k.questionWithChoices(
        'RADIO',
        'Does the work constitute Worst Forms of Child Labour (WFCL)'
        + '(ILO Convention 1999 No. 182 ): slavery or slavery-like practices, '
        + 'recruitment of children into armed forces/groups, prostitution, production of pornography, '
        + 'illicit activities such as drug trafficking, or an immediate risk to the child’s health and safety.',
        [
          'Yes', 'No'
        ])
      const pleaseExplain = k.question('TEXT', 'Please explain')
      const titleOther = k.title(`Other`)
      const infoToShare = k.question('TEXT',
        'Is there any other information you would like to share with me today? Is there anything else you would like to talk to me about today?')
      return [
        noteTellMe,
        titleEducation,
        doYouAttendSchoolRegularly,
        whatGradeAreYouIn,
        anyDifficulties,
        titleDailyActivities,
        whatYouDoEachDay,
        doYouWork,
        howManyHours,
        howManyDaysPerWeek,
        typeOfWork,
        forHowManyMonths,
        doYouEarnMoney,
        ...doesFamilyDepend,
        noteInterviewerObservations,
        interviewerObservations,
        pleaseExplain,
        titleOther,
        infoToShare,
      ]
    }),
    k.section('Conclusions', () => {
      const note = k.note(`Additional observations and comments of the interviewer.  Include any observations on the child and family’s resources and strengths.`)
      const title = k.title(`Specific Needs`)
      const generateRow = (title: string) => [
        k.note('- Type of action: ' + title),
        k.question('TEXT', `Details`),
        k.question('TEXT', `Timeframe`),
        k.questionWithChoices('RADIO', `Type`, ['Intervention', 'Referral']),
      ]
      return [
        note,
        title,
        ...Common.specificNeeds(k),
        k.questionWithChoices('RADIO', 'The child is at imminent risk?', ['Yes', 'No']),
        k.questionWithChoices('RADIO', 'Risk assessment', [
          '24 hours (High risk)',
          '3 days (Medium risk)',
          '1 week (Low risk)',
        ]),
        ...generateRow('Family tracing'),
        ...generateRow('Protection and Safety'),
        ...generateRow('Psychosocial'),
        ...generateRow('Education'),
        ...generateRow('Legal and Documentation'),
        ...generateRow('Health and Nutrition'),
        ...generateRow('Basic Needs'),
        ...generateRow('Other'),
      ]
    })
  ])
}
