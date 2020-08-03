import React, { Component } from 'react';
import UneditableTextInput from './UneditableTextInput';
import { Menu, Space } from 'antd';
import { CONTEXT_TYPE, INTENT_TYPE } from '../configs/graph';

/**
 * Component to edit the currently selected node
 */
export default class NodeEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.selected
    }
  }

  /**
   * Update the currently selected node on prop change and when the given prop
   * has the property selected that is not null
   * 
   * @param {*} props Next props
   * @param {*} state Previous state
   */
  static getDerivedStateFromProps(props, state) {
    if (!!props.selected) {
      if (!state.selected || state.selected.id !== props.selected.id) {
        return {
          selected: props.selected
        };
      }
    }
    return null;
  }

  render() {
    const { selected } = this.state;

    // Do not render if selected is null
    if (!selected) {
      return <div/>;
    }

    const { id, type } = this.state.selected;

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
            key="uneditable"
            title="Node Data"
          >
            <Menu.Item key="id">
              <UneditableTextInput value={id} label="Id" />
            </Menu.Item>
            <Menu.Item key="type">
              <UneditableTextInput value={type} label="Type" />
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu
  
          >
  
          </Menu.SubMenu>
        </Menu>
      );
    } else {
      return null;
    }
  }
}
