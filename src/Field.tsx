import React, { Component } from 'react';
import { Broadcast } from './Form';
import { Error, FieldConfig } from './types';

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
};

export class Field extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = this.props.initialState;
  }

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
  };

  update = (newState: any) => {
    this.setState({
      ...this.state,
      ...newState,
      value: this.state.value,
      error: this.state.error,
    });
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
  };

  setValue = (value: any) => {
    this.setState({ ...this.state, value });
  };

  setError = (error: Error) => {
    this.setState({ ...this.state, error });
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
        }}
      />
    );
  }
}
