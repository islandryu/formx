import * as React from 'react';
import 'react-app-polyfill/ie11';
import * as ReactDOM from 'react-dom';
import { Config, Form } from '../.';
import * as yup from 'yup';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

const DateField = ({ label, field }) => {
  return (
    <div>
      <h4>{label}</h4>
      <DatePicker {...field} selected={field.value} onChange={field.onChange} />
      {field.error}
    </div>
  );
};

const config: Config = {
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
  dateOfBirth: {
    component: DateField,
    props: (context, form) => ({
      label: 'Date of birth',
      schema: yup.date().required(),
    }),
    initState: (context) => ({
      value: context.person ? new Date(context.person.dateOfBirth) : null,
    }),
    transform: (context, form, value) => (value ? value.toISOString() : null),
  },
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// simulates api request
const getPerson = async () => {
  const person = {
    firstName: 'Dusan',
    lastName: 'Jovanov',
    dateOfBirth: new Date().toISOString(),
  };
  await sleep(500);
  return person;
};

export const App = () => {
  const [person, setPerson] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = React.useRef<Form>(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const person = await getPerson();
      setPerson(person);
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!formRef.current) return;
    formRef.current.resetForm();
  }, [person]);

  const context = {
    person,
  };

  return (
    <Form
      config={config}
      context={context}
      onSubmit={(originalValues, transformedValues) =>
        console.log(originalValues, transformedValues)
      }
      ref={formRef}
    >
      {({ fields, submitForm, resetForm }) => {
        return (
          <div>
            {isLoading && <h1>Loading person...</h1>}
            {fields.firstName}
            {fields.lastName}
            {fields.fullName}
            {fields.dateOfBirth}
            <button onClick={() => submitForm()}>Submit</button>
            <button onClick={() => resetForm()}>Reset</button>
          </div>
        );
      }}
    </Form>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
