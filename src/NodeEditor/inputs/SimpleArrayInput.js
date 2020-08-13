import React, { Component } from 'react';
import {
  List, Input, Space, Form,
} from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

/**
 * A component for editting array with an interactive list and a text input
 * field which can be used to add new items to the list
 */
export default class SimpleArrayInput extends Component {
  constructor(props) {
    super(props);
    this.state = { temp: '' };
  }

  /**
   * Called when the user clicks on the delete icon in the list. Remove the item
   * from the list and also update the parent component
   *
   * @param {*} item Item to delete from the list
   */
  onDelete = (item) => {
    const { id, onChange, items } = this.props;
    const index = items.indexOf(item);

    if (index > -1) {
      items.splice(index, 1);
      onChange({ target: { id, value: items } });
    }
  }

  /**
   * Event handler when the user submits the temporary input field. Chech that
   * the input is not empty and add it to the items and report the change to the
   * parent component
   */
  onSubmit = () => {
    const { id, onChange, items } = this.props;
    const { temp } = this.state;

    if (temp === '') {
      return;
    }

    items.push(temp);
    onChange({ target: { id, value: items } });
    this.setState({ temp: '' });
  }

  /**
   * Event handler for input field value change
   *
   * @param {*} event
   */
  onChange = (event) => {
    this.setState({ temp: event.target.value });
  }

  render() {
    const { items, label } = this.props;
    const { temp } = this.state;

    return (
      <Space direction="vertical" style={{ width: '100%' }}>
        <List
          size="small"
          locale={{ emptyText: `No ${label}` }}
          dataSource={items}
          bordered
          renderItem={(item) => (
            <List.Item
              actions={[<CloseOutlined onClick={() => this.onDelete(item)} />]}
            >
              {item}
            </List.Item>
          )}
        />
        <Form onFinish={this.onSubmit}>
          <Form.Item>
            <Input
              id="temp"
              value={temp}
              onChange={this.onChange}
              placeholder="Press enter to add new entry"
            />
          </Form.Item>
        </Form>
      </Space>
    );
  }
}

SimpleArrayInput.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  label: PropTypes.string.isRequired,
};
