import React from 'react';
import { List } from 'antd';
import PropTypes from 'prop-types';

/**
 * Functional component to display uneditable arrays
 *
 * @param {*} props Object containing an array of items and label
 */
export default function DisabledArrayInput(props) {
  const { items, label } = props;

  return (
    <List
      size="small"
      locale={{ emptyText: 'Empty' }}
      header={<div>{label}</div>}
      dataSource={items}
      renderItem={(item) => <List.Item>{item}</List.Item>}
    />
  );
}

DisabledArrayInput.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  label: PropTypes.string.isRequired,
};
