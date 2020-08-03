import React, { Component } from 'react';
import UneditableTextInput from './UneditableTextInput';
import { Space } from 'antd';

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


    return (
      <Space direction="vertical">
        <UneditableTextInput value={id} label="Id" />
        <UneditableTextInput value={type} label="Type" />
      </Space>
    );
  }
}
