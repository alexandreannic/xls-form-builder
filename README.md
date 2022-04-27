# xls-form-builder

Programmatically create XLS form with all the advantages provided by typescript and IDE when using one (easy factorizing, refactoring, ...).

### Usage

Set up the form in `index.ts` using `Form` and `FormBuilder`. Generate the xls file typing:

```
npm run build
```

### Example

Simple form with two questions, the second one displayed according to the options checked in the first one.

#### Code
```
const k = new Form()
new XLSFormBuilder().buildAndCreateXLS({title: 'Test'}, [
  k.section('Section 1', () => {
    const q1 = k.questionWithChoices('CHECKBOX', 'Question 1', ['Option 1', 'Option 2', 'Option 3'])
    return [
      q1,
      k.question('TEXT', 'Question 2', {
        showIfType: 'or',
        showIf: [
          {question: q1, value: 'Option 1'},
          {question: q1, value: 'Option 2'},
        ]
      })
    ]
  })
])
```

#### Output

- Sheet `survey`

  |type|name|label|required|relevant|appearance|guidance_hint|
  |---|---|---|---|---|---|---|
  |begin_group|group_section_|1. Section 1|false| | | | 
  |select_multiple|question__1|Question 1|false| | | | 
  |text|question__2|Question 2|false|${question__0}='Option 1' or ${question__0}='Option 2'| | |
  |end_group|| | | | | | 

- Sheet `choices`

  |list_name   | name  |  label |
  |---|---|---|
  |7w0vpwd|option_1|Option 1| 
  |7w0vpwd|option_2|Option 2| 
  |7w0vpwd|option_3|Option 3| 


- Sheet `settings`

  |form_title|version|
  |---|---|
  |Test|1 (Fri, 15 Apr 2022 10:43:08 GMT)|


### I18n

Form accepts generic i18n. Locales are inferred by TS thus you cannot forget or define wrong local.

#### Code
```
type I18n = {en: string, ukr: string}

const k = new Form<I18n>()
new XLSFormBuilder<I18n>().buildAndCreateXLS({title: 'Test'}, [
  k.section({en: 'Section 1', ukr: 'розділ 1'}, () => {
    const q1 = k.questionWithChoices('CHECKBOX', {en: 'Question 1, ukr: 'питання 1'}, [
      {en: 'Option 1', ukr: 'варіант 1'},
      {en: 'Option 2', ukr: 'варіант 2'},
      {en: 'Option 3', ukr: 'варіант 3'},
    ])
    return [
      q1,
      k.question('TEXT', {en: 'Question 2', ukr: 'питання 2'}, {
        showIfType: 'or',
        showIf: [
          {question: q1, value: {en: 'Option 1', ukr: 'варіант 1'}},
          {question: q1, value: {en: 'Option 2', ukr: 'варіант 2'}},
        ]
      })
    ]
  })
])
```

#### Output

- Sheet `survey`

  |type|name|label::en (en)|label::ukr (ukr)|required|relevant|appearance|guidance_hint|
    |---|---|---|---|---|---|---|---|
  |begin_group|group_section_|1. Section 1|1. розділ 1|false| | | | 
  |select_multiple|question__1|Question 1|питання 1|false| | | | 
  |text|question__2|Question 2|питання 2|false|${question__0}='Option 1' or ${question__0}='Option 2'| | |
  |end_group|| | | | | | | 

- Sheet `choices`

  |list_name   | name  |  label::en (en) | label::ukr (ukr)
    |---|---|---|---|
  |7w0vpwd|option_1|Option 1|варіант 1| 
  |7w0vpwd|option_2|Option 2|варіант 2| 
  |7w0vpwd|option_3|Option 3|варіант 3| 


- Sheet `settings`

  |form_title|version|
    |---|---|
  |Test|1 (Fri, 15 Apr 2022 10:43:08 GMT)|
