import React, { Component, createRef } from 'react';
import { Broadcast } from './Form';
import { Error, FieldConfig, PropsObject } from './types';
import { isFunction, isPromise } from './util';

type Props = {
  config: FieldConfig;
  onMount: () => void;
  initialState: any;
  broadcast: Broadcast;
  name: string;
};

type State = {
  schema?: any;
  value: any;
  error: Error;
  validate?: PropsObject['validate'];
};

export class Field extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = this.props.initialState;
  }

  focusRef = createRef<{ focus?: () => void }>();

  componentDidMount() {
    this.props.onMount();
  }

  componentDidUpdate(_: Props, prevState: State) {
    if (prevState.value !== this.state.value) {
      this.props.broadcast(this.props.name, 'value');
    }
    if (prevState.error !== this.state.error) {
      this.props.broadcast(this.props.name, 'error');
    }
  }

  getValue = () => {
    return this.state.value;
  };

  getError = () => {
    return this.state.error;
  };

  validate = () => {
    if (this.state.schema) {
      this.state.schema
        .validate(this.state.value)
        .then(() => {
          this.setState({ ...this.state, error: undefined });
        })
        .catch((err: any) => {
          this.setState({ ...this.state, error: err.errors[0] });
        });
    }
    //
    else if (this.state.validate) {
      if (isFunction(this.state.validate)) {
        const result = this.state.validate(this.state.value);
        if (isPromise(result)) {
          result
            .then((err) => this.setState({ ...this.state, error: err }))
            .catch((err) => console.log(err));
        }
        //
        else {
          this.setState({ ...this.state, error: result as string });
        }
      }
    }
  };

  update = (newState: any, cb?: () => void) => {
    this.setState(
      {
        ...this.state,
        ...newState,
        value: this.state.value,
        error: this.state.error,
      },
      cb
    );
  };

  initState = (newState: any) => {
    this.setState(newState);
  };

  onChange = (value: any) => {
    this.setState({ ...this.state, value }, () => {
      this.validate();
    });
  };

  onBlur = () => {
    this.validate();
    this.props.broadcast(this.props.name, 'blur');
  };

  setValue = (value: any) => {
    this.setState({ ...this.state, value });
  };

  setError = (error: Error) => {
    this.setState({ ...this.state, error });
  };

  focusField = () => {
    if (!this.focusRef.current) return;
    if (!isFunction(this.focusRef.current.focus)) return;
    this.focusRef.current.focus();
  };

  render() {
    return (
      <this.props.config.component
        {...this.state}
        field={{
          value: this.state.value,
          error: this.state.error,
          onChange: this.onChange,
          onBlur: this.onBlur,
          focusRef: this.focusRef,
        }}
      />
    );
  }
}
