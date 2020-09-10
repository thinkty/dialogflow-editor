import React, { Component } from 'react';
import {
  Modal, Space, Typography, Input, message, Button, List,
} from 'antd';
import PropTypes from 'prop-types';
import { getGraphs, saveGraph } from './vc';
import { formatDate } from './util';

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
      url: 'http://localhost:8080/graphs',
      docs: [],
      sendingRequest: false,
      isUrlValid: false,
    };
  }

  // Handle url change
  onUrlChange = (event) => {
    this.setState({ url: event.target.value });
  }

  // Set the url again
  resetUrl = () => {
    this.setState({ isUrlValid: false });
  }

  /**
   * Retrieve the graphs from the given url
   */
  getGraphs = () => {
    const { url } = this.state;
    getGraphs(url)
      .then((docs) => {
        this.setState({
          docs,
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
      .then((value) => {
        if (value.status === 200) {
          message.success('Graph saved');
          this.getGraphs(); // Get the new list from the server
        } else {
          message.error(`${value.status} : Failed to save graph`);
        }
      })
      .catch(() => {
        message.error('Failed to save graph');
      });
  }

  /**
   * Function to render list items to show the retrieved graph
   *
   * @param {object} item Object containing graph and its creation time
   */
  renderItem = (item) => {
    const { importGraph } = this.props;
    const { time, graph } = item;
    const date = new Date(time);

    return (
      <List.Item
        key={date.getTime()}
        actions={[<Button onClick={() => { importGraph(graph); }}>Import</Button>]}
      >
        {
          formatDate(date)
        }
      </List.Item>
    );
  }

  render() {
    const { visible, onCancel } = this.props;
    const {
      url, sendingRequest, isUrlValid, docs,
    } = this.state;
    return (
      <Modal
        title="Version Control"
        visible={visible}
        onOk={isUrlValid ? onCancel : this.checkUrlAndGetGraphs}
        okText={isUrlValid ? 'Done' : 'Next'}
        onCancel={isUrlValid ? this.resetUrl : onCancel}
        cancelText={isUrlValid ? 'Back' : 'Cancel'}
        confirmLoading={sendingRequest}
      >
        {
          isUrlValid
            ? (
              <Space direction="vertical">
                <Space>
                  <Button onClick={this.saveGraph}>
                    Save current graph
                  </Button>
                  <Button onClick={this.getGraphs}>
                    Refresh
                  </Button>
                </Space>
                <List
                  size="small"
                  dataSource={docs}
                  locale={{ emptyText: 'No Graphs' }}
                  renderItem={this.renderItem}
                />
              </Space>
            )
            : (
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
            )
        }
      </Modal>
    );
  }
}

VersionControlModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  importGraph: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  graph: PropTypes.shape({
    nodes: PropTypes.array,
    edges: PropTypes.array,
  }).isRequired,
};
