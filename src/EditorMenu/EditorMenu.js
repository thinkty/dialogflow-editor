import React, { Component } from 'react';
import {
  Space, Typography, Button, Dropdown, Menu,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const overlayKeys = {
  import: {
    json: {
      key: 'ijson',
      label: 'Import from .json',
    },
  },
  export: {
    json: {
      key: 'ejson',
      label: 'Export to .json',
    },
    url: {
      key: 'eurl',
      label: 'Export to url',
    },
  },
};

export default class EditorMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flowchart: 'Name of flowchart',
      agent: 'Name of agent',
    };
  }

  /**
   * Handle chatbot/flowchart input change
   *
   * @param {string} value
   */
  onFlowchartChange = (value) => {
    this.setState({ flowchart: value });
  }

  /**
   * Handle chatbot/flowchart input change
   *
   * @param {string} value
   */
  onAgentChange = (value) => {
    this.setState({ agent: value });
  }

  /**
   * Save current graph to local storage
   */
  saveGraph = () => {
    const { graph } = this.props;
    localStorage.setItem('graph', JSON.stringify(graph));
  }

  /**
   * Given the key of the menu that the user has selected,
   */
  handleExportImportOnClick = ({ key }) => {
    switch (key) {
      case overlayKeys.import.json.key:
        console.log('import from json');
        break;

      case overlayKeys.export.json.key:
        console.log('export to json');
        break;

      case overlayKeys.export.url.key:
        console.log('export to json');
        break;

      default:
        throw new Error(`Unexpected operation: ${key}`);
    }
  }

  render() {
    // const { graph } = this.props;
    const { flowchart, agent } = this.state;
    const exportImportMenu = (
      <Menu onClick={this.handleExportImportOnClick}>
        <Menu.Item key={overlayKeys.import.json.key}>
          {overlayKeys.import.json.label}
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key={overlayKeys.export.json.key}>
          {overlayKeys.export.json.label}
        </Menu.Item>
        <Menu.Item key={overlayKeys.export.url.key}>
          {overlayKeys.export.url.label}
        </Menu.Item>
      </Menu>
    );

    return (
      <Space direction="horizontal" align="start" size="middle">
        <Space direction="horizontal" align="center" size="small">
          <Typography.Paragraph editable={{ onChange: this.onAgentChange }}>
            {agent}
          </Typography.Paragraph>
          <Typography.Paragraph>/</Typography.Paragraph>
          <Typography.Paragraph editable={{ onChange: this.onFlowchartChange }}>
            {flowchart}
          </Typography.Paragraph>
        </Space>
        <Button onClick={this.saveGraph}>
          Save
        </Button>
        <Dropdown overlay={exportImportMenu}>
          <Button>
            Import / Export
            <DownOutlined />
          </Button>
        </Dropdown>
      </Space>
    );
  }
}

EditorMenu.propTypes = {
  graph: PropTypes.shape({
    nodes: PropTypes.array,
    edges: PropTypes.array,
  }).isRequired,
};
