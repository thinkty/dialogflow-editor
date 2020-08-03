import React, { Component } from 'react';
import { Menu, Space } from 'antd';

import SimpleTextInput from './SimpleTextInput';
import UneditableTextInput from './UneditableTextInput';
import { CONTEXT_TYPE, INTENT_TYPE } from '../configs/graph';

/**
 * Component to edit the currently selected node
 */
export default class NodeEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.selected,
      update: this.props.update
    };
  }

  /**
   * Update the currently selected node on prop change and when the given prop
   * has the property selected that is not null
   * 
   * @param {*} props Next props
   * @param {*} state Previous state
   */
  static getDerivedStateFromProps(props, state) {
    return {
      selected: props.selected
    };
  }

  /**
   * Handle changes from simple string input fields
   * 
   * @param {*} event 
   */
  onChange = (event) => {
    const { id, value } = event.target;
    const { selected } = this.state;
    selected[id] = value;
    this.setState({ selected });

    // Notify the parent component to rerender the graph to show changes
    this.state.update();
  }

  render() {
    const { selected } = this.state;
    if (!selected) {
      // Do not render if selected is null
      return null;
    }

    const { id, type, title } = this.state.selected;

    // Distinguish between context type and intent type
    if (type === CONTEXT_TYPE) {
      return (
        <Space 
          direction="vertical"
          style={{
            width: '100%',
            padding: 20
          }}
        >
          <UneditableTextInput value={id} label="Id" />
          <UneditableTextInput value={type} label="Type" />
          <SimpleTextInput
            id="title"
            value={title}
            label="Title"
            onChange={this.onChange}
          />
        </Space>
      );

    } else if (type === INTENT_TYPE) {
      return (
        <Menu
          mode="inline"
          style={{
            width: '100%'
          }}
        >
          <Menu.SubMenu
            key="nodeData"
            title="Node Data"
          >
            <Menu.Item key="id">
              <UneditableTextInput value={id} label="Id" />
            </Menu.Item>
            <Menu.Item key="type">
              <UneditableTextInput value={type} label="Type" />
            </Menu.Item>
            <Menu.Item key="name">
              <SimpleTextInput
                id="title"
                value={title}
                label="Title"
                onChange={this.onChange}
              />
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      );

    } else {
      return null;
    }
  }
}
