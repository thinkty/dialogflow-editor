import React, { Component } from 'react';
import { Menu, Space, Input } from 'antd';
import PropTypes from 'prop-types';

import { CONTEXT_TYPE, INTENT_TYPE } from '../configs/graph';
import DisabledArrayInput from './inputs/DisabledArrayInput';
import DisabledTextInput from './inputs/DisabledTextInput';
import SimpleTextInput from './inputs/SimpleTextInput';
import SimpleArrayInput from './inputs/SimpleArrayInput';
import SimpleBooleanInput from './inputs/SimpleBooleanInput';
import ComplexArrayInput from './inputs/ComplexArrayInput';

/**
 * Component to edit the currently selected node
 */
export default class NodeEditor extends Component {
  /**
   * Handle changes from simple string input fields
   *
   * @param {*} event
   */
  onChange = (event) => {
    const { id, value } = event.target;
    const { updateSelected } = this.props;

    updateSelected(id, value);
  }

  render() {
    const { selected } = this.props;
    if (!selected || selected.source) {
      // Do not render if selected is null or is edge
      return null;
    }

    const defaultOpenMenus = [
      'nodeData',
      'action',
      'events',
      'payload',
      'fallback',
      'contexts',
      'responses',
      'fulfillment',
      'trainingPhrases',
    ];

    const {
      id,
      type,
      title,
      action,
      events,
      payload,
      contexts,
      responses,
      isFallback,
      fulfillment,
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

    let length = 0;
    responses.forEach((pool) => {
      if (pool.length === 0) {
        length += 130;
      } else {
        length += (pool.length * 45) + 60;
      }
    });

    if (type === INTENT_TYPE) {
      return (
        <Menu
          mode="inline"
          style={{ width: '100%' }}
          defaultOpenKeys={defaultOpenMenus}
          selectable={false}
          inlineIndent={15}
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
          <Menu.SubMenu key="fallback" title="Fallback">
            <Menu.Item key="isFallback" style={{ marginBottom: 40 }}>
              <SimpleBooleanInput
                id="isFallback"
                value={isFallback}
                label="Is Fallback"
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
              style={{
                height: events.length === 0 ? 100 : events.length * 45 + 40,
                marginBottom: 40,
              }}
            >
              <SimpleArrayInput
                items={events}
                label="Events"
                id="events"
                onChange={this.onChange}
              />
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Divider />
          <Menu.SubMenu key="trainingPhrases" title="Training Phrases">
            <Menu.Item
              key="trainingPhrases"
              style={{
                height: trainingPhrases.length === 0 ? 100 : trainingPhrases.length * 45 + 40,
                marginBottom: 40,
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
          <Menu.Divider />
          <Menu.SubMenu key="action" title="Action">
            <Menu.Item key="action" style={{ marginBottom: 40 }}>
              <SimpleTextInput
                id="action"
                value={action}
                label=""
                onChange={this.onChange}
              />
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Divider />
          <Menu.SubMenu key="payload" title="Payload">
            <Menu.Item
              key="payload"
              style={{
                height: 160,
                marginBottom: 40,
              }}
            >
              <Input.TextArea
                id="payload"
                value={payload}
                rows={6}
                onChange={this.onChange}
              />
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Divider />
          <Menu.SubMenu key="responses" title="Responses">
            <Menu.Item
              key="responses"
              style={{
                height: length + 80,
                marginBottom: 40,
              }}
            >
              <ComplexArrayInput
                id="responses"
                onChange={this.onChange}
                label="Responses"
                pools={responses}
              />
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Divider />
          <Menu.SubMenu key="fulfillment" title="Fulfillment">
            <Menu.Item key="fulfillment" style={{ marginBottom: 40 }}>
              <SimpleBooleanInput
                id="fulfillment"
                value={fulfillment}
                label="Enable Webhook"
                onChange={this.onChange}
              />
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      );
    }

    // Does not match any known node type
    return null;
  }
}

NodeEditor.propTypes = {
  updateSelected: PropTypes.func.isRequired,
  selected: PropTypes.any,
};

NodeEditor.defaultProps = {
  selected: null,
};
