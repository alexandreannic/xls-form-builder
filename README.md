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
