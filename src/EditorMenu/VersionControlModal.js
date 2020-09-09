import React, { Component } from 'react';
import { Modal, Space, Typography, Input, message, Button } from 'antd';
import PropTypes from 'prop-types';
import { getGraphs, saveGraph } from './vc';

/**
 * A component to display the modal to version control the graph
 * - Save the graph to a server specified by the user
 * - Retrieve the list of graphs from a server
 * - Import the graph from the retrieved list
 */
export default class VersionControlModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: 'https://example.com',
      graphs: [],
      sendingRequest: false,
      isUrlValid: false,
    };
  }

  /**
   * Handle url change 
   */
  onUrlChange = (event) => {
    this.setState({ url: event.target.value });
  }

  /**
   * Retrieve the graphs from the given url
   */
  getGraphs = () => {
    const { url } = this.state;
    getGraphs(url)
      .then((graphs) => {
        this.setState({
          graphs,
          isUrlValid: true,
          sendingRequest: false,
        });
      })
      .catch(() => {
        message.error(`Could not retrieve graphs from ${url}`);
        this.setState({ sendingRequest: false });
      });
  }

  /**
   * Check the url and retrieve the graphs from the given url
   */
  checkUrlAndGetGraphs = () => {
    this.setState({ sendingRequest: true });
    const { url } = this.state;

    if (url === '') {
      message.error('URL cannot be empty');
      this.setState({ sendingRequest: false });
      return;
    }

    this.getGraphs();
  }

  /**
   * Save the current graph to the server
   */
  saveGraph = () => {
    const { graph } = this.props;
    const { url } = this.state;

    saveGraph(url, graph)
      .then(() => {
        message.success('Graph saved');
        getGraphs(); // Get the new list from the server
      })
      .catch(() => {
        message.error('Failed to save graph');
      });
  }

  render() {
    const { visible, onCancel } = this.props;
    const { url, sendingRequest, isUrlValid } = this.state;
    return (
      <Modal
        title="Version Control"
        visible={visible}
        onOk={isUrlValid ? onCancel : this.checkUrlAndGetGraphs}
        okText={isUrlValid ? 'Done' : 'Next'}
        cancelText={null}
        onCancel={onCancel}
        confirmLoading={sendingRequest}
      >
        {
          isUrlValid ?
          <Space direction="vertical">
            <p>List to show the graph by time. Click on the item to import it. Click on refresh to get the list again</p>
            <Button>
              Save current graph
            </Button>
          </Space> :
          <Space direction="vertical">
            <Typography>
              Provide a url to the server to get the graphs from (using GET)
            </Typography>
            <Input
              id="vcUrl"
              value={url}
              onChange={this.onUrlChange}
            />
          </Space>
        }
      </Modal>
    );
  }
}

VersionControlModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  importGraph: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  graph:  PropTypes.shape({
    nodes: PropTypes.array,
    edges: PropTypes.array,
  }).isRequired,
};
