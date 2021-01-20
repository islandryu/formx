---
id: quickstart
title: Quickstart
sidebar_label: Quickstart
---

1. Install the library:

```bash
npm install @formx/formx
```

2. Create a config outside of React:

```typescript
const config = {
  firstName: {
    component: TextField,
    props: (context) => ({
      label: 'First name',
      schema: yup.string().required(),
    }),
    initState: (context) => ({
      value: context.person?.firstName,
    }),
  },
  lastName: {
    component: TextField,
    props: (context, form) => ({
      label: 'Last name',
      schema: yup.string().required(),
    }),
    initState: (context) => ({
      value: context.person?.lastName,
    }),
  },
  fullName: {
    component: TextField,
    props: (context, form) => ({
      label: 'Full name',
      schema: yup.string().required(),
    }),
    deps: ['firstName', 'lastName'],
    effect: (context, form) => {
      form.setValue(
        'fullName',
        `${form.values.firstName} ${form.values.lastName}`
      );
    },
    initState: (context) => ({
      value: `${context.person?.firstName} ${context.person?.lastName}`,
    }),
  },
```

In this example we have 3 fields: **First name**, **Last name**, and **Full name**.

**Full name** is calculated each time first or last name change.

Each fields has a validation schema. As you can see, the schema is returned from the props function, which means
that this library gives you the ability to hava a completeley dynamic validation logic.

Each of the fields depends on a person object made available through context.

3. Create a component thats going to be rendered for the field. A component is just a plain React component.

```javascript
const TextField = ({ label, field }) => {
  return (
    <div>
      <h4>{label}</h4>
      <input
        type="text"
        {...field}
        value={field.value ?? ''}
        onChange={(e) => field.onChange(e.target.value)}
      />
      {field.error}
    </div>
  );
};
```

The only special thing is the field prop which contains `value, error, onChange, onBlur, focusRef`
