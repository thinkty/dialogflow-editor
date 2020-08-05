import React, { Component } from 'react';
import { Menu, Space } from 'antd';

import { CONTEXT_TYPE, INTENT_TYPE } from '../configs/graph';
import DisabledArrayInput from './inputs/DisabledArrayInput';
import DisabledTextInput from './inputs/DisabledTextInput';
import SimpleTextInput from './inputs/SimpleTextInput';
import SimpleArrayInput from './inputs/SimpleArrayInput';

/**
 * Component to edit the currently selected node
 */
export default class NodeEditor extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props };
  }

  /**
   * Update the currently selected node on prop change
   *
   * @param {*} props Next props
   * @param {*} state Previous state
   */
  static getDerivedStateFromProps(props, state) {
    return {
      selected: props.selected,
    };
  }

  /**
   * Handle changes from simple string input fields
   *
   * @param {*} event
   */
  onChange = (event) => {
    const { id, value } = event.target;
    const { selected, update } = this.state;
    selected[id] = value;
    this.setState({ selected });

    // Notify the parent component to rerender the graph to show changes
    update();
  }

  render() {
    const { selected } = this.state;
    if (!selected) {
      // Do not render if selected is null
      return null;
    }

    const defaultOpenMenus = [
      'nodeData',
      'contexts',
      'events',
      'trainingPhrases',
    ];

    const {
      id,
      type,
      title,
      events,
      contexts,
      trainingPhrases,
    } = selected;

    // Distinguish between context type and intent type
    if (type === CONTEXT_TYPE) {
      return (
        <Space
          direction="vertical"
          style={{
            width: '100%',
            padding: 20,
          }}
        >
          <DisabledTextInput value={id} label="Id" />
          <DisabledTextInput value={type} label="Type" />
          <SimpleTextInput
            id="title"
            value={title}
            label="Name"
            onChange={this.onChange}
          />
        </Space>
      );
    }

    if (type === INTENT_TYPE) {
      return (
        <Menu
          mode="inline"
          style={{ width: '100%' }}
          defaultOpenKeys={defaultOpenMenus}
          selectable={false}
        >
          <Menu.SubMenu key="nodeData" title="Node Data">
            <Menu.Item key="id">
              <DisabledTextInput value={id} label="Id" />
            </Menu.Item>
            <Menu.Item key="type">
              <DisabledTextInput value={type} label="Type" />
            </Menu.Item>
            <Menu.Item key="name">
              <SimpleTextInput
                id="title"
                value={title}
                label="Name"
                onChange={this.onChange}
              />
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Divider />
          <Menu.SubMenu key="contexts" title="Contexts">
            <Menu.Item
              key="inputContext"
              style={{
                height: contexts.in.length === 0 ? 90 : contexts.in.length * 40 + 35,
              }}
            >
              <DisabledArrayInput items={contexts.in} label="Input Contexts" />
            </Menu.Item>
            <Menu.Item
              key="outputContext"
              style={{
                height: contexts.out.length === 0 ? 90 : contexts.out.length * 40 + 35,
                marginBottom: 40,
              }}
            >
              <DisabledArrayInput items={contexts.out} label="Output Contexts" />
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Divider />
          <Menu.SubMenu key="events" title="Events">
            <Menu.Item
              key="events"
              style={{ height: events.length === 0 ? 100 : events.length * 45 + 40 }}
            >
              <SimpleArrayInput
                items={events}
                label="Events"
                id="events"
                onChange={this.onChange}
              />
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="trainingPhrases" title="Training Phrases">
            <Menu.Item
              key="trainingPhrases"
              style={{
                height: trainingPhrases.length === 0 ? 100 : trainingPhrases.length * 45 + 40,
              }}
            >
              <SimpleArrayInput
                items={trainingPhrases}
                label="Training Phrases"
                id="trainingPhrases"
                onChange={this.onChange}
              />
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      );
    }
    return null;
  }
}
