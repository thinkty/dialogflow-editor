import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';

/**
 * Functional component to display uneditable text
 *
 * @param {*} props An object containing value and label to display
 */
export default function DisabledTextInput(props) {
  const { value, label } = props;

  if (!props || !value || !label) {
    return null;
  }

  return (
    <Input
      disabled
      value={value}
      addonBefore={label}
    />
  );
}

DisabledTextInput.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};
