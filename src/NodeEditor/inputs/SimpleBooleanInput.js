import React, { Component } from 'react';
import { Switch, Space, Typography } from 'antd';
import PropTypes from 'prop-types';

/**
 * A component for editting boolean through a switch
 */
export default class SimpleBooleanInput extends Component {
  /**
   * Event handler for input switch value change
   *
   * @param {Boolean} checked Current value of the check box
   */
  onChange = (checked) => {
    const { id, onChange } = this.props;
    onChange({ target: { id, value: checked } });
  }

  render() {
    const { value, label } = this.props;

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

SimpleBooleanInput.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
};
