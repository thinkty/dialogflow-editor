import React, { Component } from 'react';
import { Input } from 'antd';

export default class SimpleTextInput extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      value: this.props.value,
      label: this.props.label,
      onChange: this.props.onChange
    };
  }

  /**
   * Update on prop change
   * 
   * @param {*} props Next props
   * @param {*} state Previous state
   */
  static getDerivedStateFromProps(props, state) {
    if (state.value !== props.value) {
      return {
        value: props.value
      };
    }
    return null;
  }

  render() {
    const { id, value, label, onChange } = this.state;

    return (
      <Input 
        id={id}
        value={value}
        addonBefore={label}
        onChange={onChange}
      />
    );
  }
}