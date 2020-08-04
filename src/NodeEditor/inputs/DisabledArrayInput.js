import React from 'react';
import { List } from 'antd';

export default function DisabledArrayInput(props) {
  const { items, label } = props;

  return (
    <List
      size="small"
      locale={{ emptyText: "Empty" }}
      header={<div>{label}</div>}
      dataSource={items}
      renderItem={item => <List.Item>{item}</List.Item>}
    />
  );
}