import React, { Component } from 'react';
import { Switch, Space, Typography } from 'antd';

export default class SimpleBooleanInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props
    };
  }

  /**
   * Update on prop change
   *
   * @param {*} props Next props
   * @param {*} state Previous state
   */
  static getDerivedStateFromProps(props, state) {
    return {
      ...props,
    };
  }

  /**
   * Event handler for input switch value change
   *
   * @param {Boolean} checked Current value of the check box
   */
  onChange = (checked) => {
    const { id, onChange } = this.state;
    onChange({ target: { id, value: checked } });
  }

  render() {

    const { value, label } = this.state;

    return (
      <Space direction="horizontal" size="middle">
        <Typography>
          {label}
        </Typography>
        <Switch
          checked={value}
          onChange={this.onChange}
        />
      </Space>
    );
  }
}
