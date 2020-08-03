import React from 'react';
import { Input } from 'antd';

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