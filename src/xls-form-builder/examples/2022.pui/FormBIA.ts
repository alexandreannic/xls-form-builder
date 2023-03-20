import {Form, QuestionConf, ShowIfCondition} from '../../core/v1/Form'
import {XLSFormBuilder} from '../../core/v1/XLSFormBuilder'
import {Common} from './Common'
import {EN_UK_Label, pleaseSpecify_EN_UK} from '../../core/Utils'

export const formBIA = () => {
  const k = new Form<EN_UK_Label>(pleaseSpecify_EN_UK)
  new XLSFormBuilder<EN_UK_Label>().buildAndCreateXLS({title: 'BIA Form', numberOnTitles: true}, [
    k.section({en: 'General', uk: ''}, () => {
      return [
        Common.levelOfRisk(k),
        k.question('TEXT', {en: 'Child protection case #', uk: ''}),
      ]
    }),
    k.section({en: 'Bio data', uk: ''}, () => {
      const titlePersonalINfo = k.title({en: `Personal info`, uk: ''})
      const firstName = k.question('TEXT', {en: 'First name', uk: ''})
      const familyName = k.question('TEXT', {en: 'Family name', uk: ''})
      const dateOfBirth = k.question('DATE', {en: 'Date of birth', uk: ''})
      const placeOfBirth = k.question('TEXT', {en: 'Place of birth', uk: ''})
      const countryOfOriginAndSpecify = k.questionWithChoicesAndSpecify('RADIO', {en: 'Country of origin', uk: ''}, [
        {label: {en: 'Ukraine', uk: ''}},
        {label: {en: 'Other (specify)', uk: ''}, specify: true}
      ])
      const educationLevel = k.question('TEXT', {en: 'Education level', uk: ''})
      const languagesSpokenAndSpecify = k.questionWithChoicesAndSpecify('CHECKBOX', {en: 'Languages spoken', uk: ''}, [
        {label: {en: 'English', uk: ''}},
        {label: {en: 'Polish', uk: ''}},
        {label: {en: 'Other (specify)', uk: ''}, specify: true}
      ])
      return [
        titlePersonalINfo,
        firstName,
        familyName,
        dateOfBirth,
        placeOfBirth,
        Common.gender(k),
        ...countryOfOriginAndSpecify,
        Common.status(k, 'RADIO'),
        educationLevel,
        ...languagesSpokenAndSpecify,
        ...Common.nationalitiesAndSpecify(k),
        ...Common.contactDetails(k),
      ]
    }),
    k.section({en: 'Care arrangements and Living conditions', uk: ''}, () => {
      const careArrangements = k.title({en: 'Care arrangements', uk: ''})
      const liveWithWithSpecify = k.questionWithChoicesAndSpecify('CHECKBOX', {en: 'Who do you currently live with?', uk: ''}, [
          {label: {en: 'Parent(s)', uk: ''}},
          {label: {en: 'Sibling(s)', uk: ''}},
          {label: {en: 'Female-headed household', uk: ''}},
          {label: {en: 'Elderly Caregiver', uk: ''}},
          {label: {en: 'Alone', uk: ''}},
          {label: {en: 'Other children', uk: ''}},
          {label: {en: 'Host family', uk: ''}},
          {label: {en: 'Other (specify)', uk: ''}, specify: true},
        ]
      )
      const howIsYourRelationship = k.question('TEXTAREA', {
        en: 'How is your relationship with your family/the people you live with? Do you like to stay here?',
        uk: ''
      }, {
        hint: {
          en: `Describe the present care arrangement from the child’s point of views. `
            + `Be detailed: what is the precise family link between child and caregiver? `
            + `Since how long do they know each other? How often were they in contact before `
            + `the child came and live with him/her? how was the relationship before? How is `
            + `the relationship now? How does the caregiver support the child? Does s/he cook for the child? `
            + `Do they eat together? Do they play together? Is the caregiver supportive when the child is facing problems? `
            + `Does the child trust the caregiver? Does the child want to live with caregiver on the long term?`,
          uk: ''
        }
      })
      const noteAboutHome = k.note({en: `Ask the child how s/he would describe the place where s/he is staying?`, uk: ''})
      const typeOfHome = k.questionWithChoices('RADIO', {en: `Which type of accomodation`, uk: ''}, [
        {en: 'Owned house/apartment', uk: ''},
        {en: 'Host Family', uk: ''},
        {en: 'Renting house/apartment', uk: ''},
        {en: 'Collective Shelter/Centre', uk: ''},
        {en: 'Tent', uk: ''},
        {en: 'Garage or unfinished building', uk: ''},
        {en: 'Other (specify)', uk: ''},
      ])
      const housingConditionsAndSpecify = k.questionWithChoicesAndSpecify('CHECKBOX', {en: 'Housing conditions', uk: ''}, [
        {label: {uk: ``, en: 'Overcrowding'}},
        {label: {uk: ``, en: 'Dangerous items in household'}},
        {label: {uk: ``, en: 'Unhygienic'}},
        {label: {uk: ``, en: 'Not suitably equipped for climate'}},
        {label: {uk: ``, en: 'Other (specify)'}, specify: true},
      ])


      const conditionIsNotAlone: Pick<QuestionConf<EN_UK_Label>, 'showIf' | 'showIfType'> = {
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
            {question: liveWithWithSpecify[0], value: 'Alone', eq: 'neq'},
          ]
      }
      // {showIf: [conditionIsAlone]}
      const titleConsultingWithParents = k.title({en: `Consultation with parents/adult caregivers`, uk: ''}, conditionIsNotAlone)
      const name = k.question('TEXT', {en: `Name`, uk: ''}, conditionIsNotAlone)
      const relationShip = k.question('TEXT', {en: 'Relationship to child', uk: ''}, conditionIsNotAlone)
      const legalGuardian = k.questionWithChoicesAndSpecify('RADIO', {en: `Are you the legal guardian for this child?`, uk: ''}, [
        {label: {en: 'Yes (specify)', uk: ''}, specify: true, specifyLabel: {en: 'Are guardianship documents available?', uk: ''}},
        {label: {en: 'Not legally, but with permission of the parents', uk: ''}},
        {label: {en: 'No', uk: ''}},
      ])
      const howIsRelationShip = k.question('TEXTAREA', {en: `How would you describe your relationship with the child?`, uk: ''}, conditionIsNotAlone)
      const howIsChildWithOther = k.question(
        'TEXTAREA',
        {en: `How is the child getting along with other children? What daily activities are they engaged in?`, uk: ''},
        conditionIsNotAlone
      )
      const whatInfo = k.question('TEXTAREA', {
        en: 'IF SEPARATED OR UNACCOMPANIED ONLY: What information do you have about the child, his/her life and the family separation? Include information about status of father or mother, any contact caregiver has with child’s other family members, etc.',
        uk: ''
      }, conditionIsNotAlone)
      return [
        careArrangements,
        ...liveWithWithSpecify,
        howIsYourRelationship,
        noteAboutHome,
        typeOfHome,
        ...housingConditionsAndSpecify,
        titleConsultingWithParents,
        name,
        Common.gender(k, undefined, conditionIsNotAlone),
        ...Common.nationalitiesAndSpecify(k, undefined, conditionIsNotAlone),
        relationShip,
        ...legalGuardian,
        howIsRelationShip,
        howIsChildWithOther,
        whatInfo
      ]
    }),
    k.section({en: 'Tracing needs', uk: ''}, () => {
      return [
        k.question('TEXT', {
          en: 'When did you arrive in Poland?',
          uk: ''
        }),
        k.question('TEXTAREA', {
          en: 'Do you have any relatives or friends in Poland? If so, provide name, relationship.',
          uk: ''
        }),
        k.question('TEXTAREA', {
          en: `Would you like to receive help to find some of your family members?  If so, note whom the child would like to trace and any information the child has about relatives' location.`,
          uk: ''
        }),
        k.question('TEXTAREA', {
          en: `Is tracing taking place? If yes, by which agency? Is the child being informed about the tracing results? Are there additional needs?`,
          uk: ''
        }),
      ]
    }),
    k.section({en: 'Health and Safety', uk: ''}, () => {
      const safetyTitle = k.title({en: `Safety/Security`, uk: ''})
      const feelSafe = k.question('TEXTAREA',
        {en: 'Do you feel safe here (in your accommodation, in your neighbourhood, etc) ? If not what are the reasons, list any concerns.', uk: ''})
      const howDidWay = k.question('TEXTAREA', {en: 'How did you make your way to Poland. Is there anything you would like to tell about your flight?', uk: ''})
      const psychosocialWellbeing = k.title({en: `Psychosocial wellbeing`, uk: ''})
      const whereDiscussProblems = k.questionWithChoices('CHECKBOX', {en: `Where/to whom do you go to discuss problems or ask for help/assistance?`, uk: ''}, [
        {en: 'Mother', uk: ''},
        {en: 'Father', uk: ''},
        {en: 'Friends', uk: ''},
        {en: 'Neighbours', uk: ''},
        {en: 'Other family member (specify)', uk: ''},
        {en: 'Other (specify)', uk: ''},
        {en: 'No One', uk: ''},
      ])
      const showIfOtherFamily: ShowIfCondition<EN_UK_Label>[] = [{question: whereDiscussProblems, value: 'Other family member (specify)'}]
      const showIfOther: ShowIfCondition<EN_UK_Label>[] = [{question: whereDiscussProblems, value: 'Other (specify)'}]
      const otherFamilySpecify = k.question('TEXT', {en: `Please specify other family member`, uk: ''}, {showIf: showIfOtherFamily})
      const otherSpecify = k.question('TEXT', {en: `Please specify other`, uk: ''}, {showIf: showIfOther})
      const healAccess = k.title({en: `Health/medical access`, uk: ''})
      const howAreYou = k.question('TEXTAREA', {en: 'How are you feeling? How is your health?', uk: ''})
      const anyProblems = k.question('TEXTAREA', {en: 'Do you have any problems accessing medical care?', uk: ''}, {
        hint: {en: 'Does the child know where and how to access care) If so, explain why.', uk: ''}
      })
      const observations = k.question('TEXTAREA', {en: 'Interviewer observations', uk: ''}, {
        hint: {en: 'Does the child look healthy and/or have any disabilities?', uk: ''}
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
    k.section({en: 'Daily life', uk: ''}, () => {
        const noteTellMe = k.note({en: `Can you tell me a bit about what you do each day?`, uk: ''})
        const titleEducation = k.title({en: `Education`, uk: ''})
        const doYouAttendSchoolRegularly = k.questionWithChoices('RADIO', {en: `Do you attend school regularly?`, uk: ''}, [
          {en: 'I always attend school', uk: ''},
          {en: 'Don’t attend school at all', uk: ''},
          {en: 'Once per week', uk: ''},
          {en: 'Once per month', uk: ''},
          {en: 'Never', uk: ''},
        ])
        const whatGradeAreYouIn = k.question('TEXT', {en: `What grade are you in (in Poland)`, uk: ''})
        const anyDifficulties = k.question('TEXTAREA', {en: 'Do you have any difficulties or problems at school or going to school?', uk: ''}, {
          hint: {en: 'If so, what are they?', uk: ''}
        })
        const titleDailyActivities = k.title({en: `Daily activities`, uk: ''})
        const whatYouDoEachDay = k.question('TEXTAREA', {en: `Can you tell me a little bit about what you do each day? Do you spend time with friends, other children?`, uk: ''})
        const doYouWork = k.questionWithChoices('RADIO', {en: `Do you currently work?`, uk: ''}, [{en: 'Yes', uk: ''}, {en: 'No', uk: ''}])

        const showIf = [{question: doYouWork, value: 'Yes'}]
        const howManyHours = k.question('TEXT', {en: 'How many hours per day', uk: ''}, {showIf: showIf})
        const howManyDaysPerWeek = k.question('TEXT', {en: 'How many days per week', uk: ''}, {showIf: showIf})
        const typeOfWork = k.question('TEXT', {en: 'Type of work', uk: ''}, {showIf: showIf})
        const forHowManyMonths = k.question('TEXT', {en: 'For how many months', uk: ''}, {showIf: showIf})
        const doYouEarnMoney = k.question('TEXTAREA', {en: 'Do you earn any money for the work?', uk: ''}, {
          hint: {en: 'Is so, how much and what do you use it for. ', uk: ''}
        })
        const doesFamilyDepend = k.questionWithChoicesAndSpecify('RADIO', {en: `Does your family depend on the money you earn ?`, uk: ''}, [
          {label: {en: 'Yes', uk: ''}, specify: true},
          {label: {en: 'No', uk: ''}},
        ])
        const noteInterviewerObservations = k.note({en: `Interviewer observations`, uk: ''})
        const interviewerObservations = k.questionWithChoices('RADIO', {
          en: 'Does the work constitute Worst Forms of Child Labour (WFCL)'
            + '(ILO Convention 1999 No. 182 ): slavery or slavery-like practices, '
            + 'recruitment of children into armed forces/groups, prostitution, production of pornography, '
            + 'illicit activities such as drug trafficking, or an immediate risk to the child’s health and safety.',
          uk: ''
        }, [
          {en: 'Yes', uk: ''}, {en: 'No', uk: ''}
        ])
        const pleaseExplain = k.question('TEXT', {en: 'Please explain', uk: ''})
        const titleOther = k.title({en: `Other`, uk: ''})
        const infoToShare = k.question('TEXT', {
          en: 'Is there any other information you would like to share with me today? Is there anything else you would like to talk to me about today?',
          uk: ''
        })
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
      }
    ),
    k.section({en: 'Conclusions', uk: ''}
      , () => {
        const note = k.note({
          en: `Additional observations and comments of the interviewer.  Include any observations on the child and family’s resources and strengths.`,
          uk: ''
        })
        const title = k.title({en: `Specific Needs`, uk: ''})
        const generateRow = (title: EN_UK_Label) => [
          k.note({en: '- Type of action: ' + title.en, uk: ''  + title.uk}),
          k.question('TEXT', {en: `Details`, uk: ''}),
          k.question('TEXT', {en: `Timeframe`, uk: ''}),
          k.questionWithChoices('RADIO', {en: `Type`, uk: ''}, [{en: 'Intervention', uk: ''}, {en: 'Referral', uk: ''}]),
        ]
        return [
          note,
          title,
          ...Common.specificNeedsHCR(k),
          k.questionWithChoices('RADIO', {en: 'The child is at imminent risk?', uk: ''}, [{en: 'Yes', uk: ''}, {en: 'No', uk: ''}]
          ),
          k.questionWithChoices('RADIO', {en: 'Risk assessment', uk: ''}, [
            {en: '24 hours (High risk)', uk: ''},
            {en: '3 days (Medium risk)', uk: ''},
            {en: '1 week (Low risk)', uk: ''},
          ]),
          ...generateRow({en: 'Family tracing', uk: ''}),
          ...generateRow({en: 'Protection and Safety', uk: ''}),
          ...generateRow({en: 'Psychosocial', uk: ''}),
          ...generateRow({en: 'Education', uk: ''}),
          ...generateRow({en: 'Legal and Documentation', uk: ''}),
          ...generateRow({en: 'Health and Nutrition', uk: ''}),
          ...generateRow({en: 'Basic Needs', uk: ''}),
          ...generateRow({en: 'Other', uk: ''}),
        ]
      }
    )
  ])
}
