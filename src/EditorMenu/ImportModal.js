import React, { Component } from 'react';
import {
  Modal,
  Space,
  Typography,
  Input,
  message,
} from 'antd';
import PropTypes from 'prop-types';

/**
 * A component to display the modal to import the graph from
 */
export default class ImportModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reading: false,
      file: '',
    };
  }

  /**
   * Function to import graph from the specified file
   */
  importGraphFromFile = () => {
    const { file } = this.state;
    const { importGraph, onCancel } = this.props;
    const reader = new FileReader();

    reader.onabort = () => {
      message.error('Aborted whlie reading file', 4);
      this.setState({ reading: false });
    };

    reader.onerror = () => {
      message.error(`Failed to read file. ${reader.error}`, 4);
      this.setState({ reading: false });
    };

    reader.onload = (event) => {
      try {
        const graph = JSON.parse(event.target.result);
        importGraph(graph);
        onCancel(); // Close modal
      } catch (error) {
        message.error('Failed to parse into JSON', 4);
      }
      this.setState({ reading: false });
    };

    try {
      reader.readAsText(file);
      this.setState({ reading: true });
    } catch (error) {
      message.error('Failed to read file', 4);
    }
  }

  /**
   * Handle action where user has chosen a file
   *
   * @param {*} event
   */
  onChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    this.setState({ file });
  }

  render() {
    const { visible, onCancel } = this.props;
    const { reading } = this.state;

    return (
      <Modal
        title="Import from file"
        visible={visible}
        onOk={this.importGraphFromFile}
        onCancel={onCancel}
        okText="Import"
        confirmLoading={reading}
      >
        <Space direction="vertical">
          <Typography style={{ marginBottom: 10 }}>
            Reads from a
            <Typography.Text code>.json</Typography.Text>
            file and replaces the graph with the contents of the json file.
          </Typography>
          <Input
            type="file"
            accept=".json,application/json"
            multiple={false}
            onChange={this.onChange}
          />
        </Space>
      </Modal>
    );
  }
}

ImportModal.propTypes = {
  importGraph: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};
