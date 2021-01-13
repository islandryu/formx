import { Component, createRef, RefObject, ReactNode } from 'react';
import { Field } from './Field';
import { Config, Context, IndexObject, Error } from './types';
import * as React from 'react';

type Props = {
  children: (args: {
    fields: IndexObject<ReactNode>;
    submitForm: () => void;
    resetForm: () => void;
  }) => any;
  context: Context;
  onSubmit: (data: IndexObject) => void;
  config: Config;
};

type State = {
  fields: IndexObject;
};

export type Broadcast = (name: string, type: string) => void;

export class Form extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      fields: {},
    };
  }

  componentDidMount() {
    const fields: IndexObject = {};
    for (const [name, c] of Object.entries(this.props.config)) {
      this.fieldRefs[name] = createRef();
      fields[name] = (
        <Field
          ref={this.fieldRefs[name]}
          config={c}
          onMount={() => {
            setTimeout(() => {
              this.updateField(name);
            });
          }}
          initialState={c.initState ? c.initState(this.props.context) : {}}
          broadcast={this.broadcast}
          name={name}
        />
      );
    }
    this.setState({ fields });
  }

  fieldRefs: IndexObject<RefObject<Field>> = {};

  getValues = () => {
    return Object.entries(this.fieldRefs).reduce<IndexObject>(
      (values, [name, r]) => {
        if (!r.current) return values;
        values[name] = r.current.getValue();
        return values;
      },
      {}
    );
  };

  getErrors = () => {
    return Object.entries(this.fieldRefs).reduce<IndexObject<Error>>(
      (errors, [name, r]) => {
        if (!r.current) return errors;
        errors[name] = r.current.getError();
        return errors;
      },
      {}
    );
  };

  getFormProp = () => {
    return {
      values: this.getValues(),
      errors: this.getErrors(),
    };
  };

  updateField = (name: string) => {
    const fieldRef = this.fieldRefs[name].current;
    if (!fieldRef) return;
    fieldRef.update(
      this.props.config[name].props(this.props.context, this.getFormProp())
    );
  };

  resetField = (name: string) => {
    const fieldRef = this.fieldRefs[name].current;
    if (!fieldRef) return;
    const fieldConfig = this.props.config[name];
    fieldRef.initState(
      fieldConfig.initState ? fieldConfig.initState(this.props.context) : {}
    );
  };

  broadcast = (name: string, type: string) => {
    if (type === 'value') {
      this.validateField(name);
    }
    Object.entries(this.props.config).forEach(([n, c]) => {
      if (c.deps && c.deps.includes(name)) {
        this.updateField(n);
      }
    });
  };

  validateField = (name: string) => {
    const fieldRef = this.fieldRefs[name].current;
    if (!fieldRef) return;
    fieldRef.validate();
  };

  isValid = () => {
    const isInvalid = Object.values(this.getErrors()).some(
      (err) => err !== undefined
    );
    return !isInvalid;
  };

  submitForm = () => {
    Object.keys(this.props.config).forEach((name) => {
      this.validateField(name);
    });
    setTimeout(() => {
      if (this.isValid()) {
        this.props.onSubmit(this.getValues());
      }
    });
  };

  resetForm = () => {
    Object.keys(this.props.config).forEach((name) => {
      this.resetField(name);
    });
  };

  render() {
    return this.props.children({
      fields: this.state.fields,
      submitForm: this.submitForm,
      resetForm: this.resetForm,
    });
  }
}
