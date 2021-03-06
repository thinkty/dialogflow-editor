import React, { Component } from 'react';
import {
  Space, Typography, Button, Dropdown, Menu, message,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import ExportModal from './ExportModal';
import ImportModal from './ImportModal';
import VersionControlModal from './VersionControlModal';

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

    let agent = localStorage.getItem('agent');
    if (!agent) {
      agent = 'Name of agent';
    }

    this.state = {
      agent,
      exportModalVisible: false,
      importModalVisible: false,
      vcModalVisible: false,
    };
  }

  // Helper to close the export modal
  closeExportModal = () => {
    this.setState({ exportModalVisible: false });
  }

  // Helper to close the import modal
  closeImportModal = () => {
    this.setState({ importModalVisible: false });
  }

  // Helper to close the VC modal
  closeVCModal = () => {
    this.setState({ vcModalVisible: false });
  }

  // Helper to open the VC modal
  openVCModal = () => {
    this.setState({ vcModalVisible: true });
  }

  /**
   * Handle chatbot/agent input change
   *
   * @param {string} value
   */
  onAgentChange = (value) => {
    this.setState({ agent: value });
    localStorage.setItem('agent', value);
  }

  /**
   * Save current graph to local storage
   */
  saveGraph = () => {
    const { graph } = this.props;
    localStorage.setItem('graph', JSON.stringify(graph));
    message.success('Saved graph', 1);
  }

  /**
   * Given the key of the menu that the user has selected, execute the
   * appropriate function to handle export/import
   */
  handleExportImportOnClick = ({ key }) => {
    const { graph, downloadGraph } = this.props;

    switch (key) {
      case overlayKeys.import.json.key:
        this.setState({ importModalVisible: true });
        break;

      case overlayKeys.export.json.key:
        downloadGraph(graph);
        break;

      case overlayKeys.export.url.key:
        this.setState({ exportModalVisible: true });
        break;

      default:
        throw new Error(`Unexpected operation: ${key}`);
    }
  }

  render() {
    const { graph, importGraph, clearGraph } = this.props;
    const {
      agent,
      exportModalVisible,
      importModalVisible,
      vcModalVisible,
    } = this.state;
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
        </Space>
        <Button onClick={this.saveGraph}>
          Save
        </Button>
        <Button onClick={clearGraph}>
          Clear
        </Button>
        <Dropdown overlay={exportImportMenu} mouseEnterDelay={0}>
          <Button>
            Import / Export
            <DownOutlined />
          </Button>
        </Dropdown>
        <Button onClick={this.openVCModal}>
          VC
        </Button>
        <ExportModal
          visible={exportModalVisible}
          agent={agent}
          onCancel={this.closeExportModal}
          graph={graph}
        />
        <ImportModal
          visible={importModalVisible}
          importGraph={importGraph}
          onCancel={this.closeImportModal}
        />
        <VersionControlModal
          visible={vcModalVisible}
          importGraph={importGraph}
          onCancel={this.closeVCModal}
          graph={graph}
        />
      </Space>
    );
  }
}

EditorMenu.propTypes = {
  graph: PropTypes.shape({
    nodes: PropTypes.array,
    edges: PropTypes.array,
  }).isRequired,
  clearGraph: PropTypes.func.isRequired,
  importGraph: PropTypes.func.isRequired,
  downloadGraph: PropTypes.func.isRequired,
};
