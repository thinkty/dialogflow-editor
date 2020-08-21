import React, { Component } from 'react';
import {
  Modal,
  Input,
  Space,
  Typography,
  Divider,
  message,
  Select,
} from 'antd';
import PropTypes from 'prop-types';

/**
 * A component to display the modal to export current graph to a specified url
 */
export default class ExportModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      protocol: 'https://',
      url: 'www.example.com',
      sending: false,
    };
  }

  /**
   * Called on 'send' clicked. Sends the graph to the specified url with the
   * POST method and waits for 10 seconds at maximum
   */
  sendGraph = () => {
    const {
      graph,
      agent,
      onCancel,
    } = this.props;
    const { protocol, url } = this.state;

    if (url === '') {
      message.error('Empty url', 2);
      return;
    }

    const controller = new AbortController();
    const options = {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ graph, agent }),
    };

    fetch(`${protocol}${url}`, options)
      .then((response) => {
        this.setState({ sending: false });
        if (response.status === 200) {
          message.success('Graph sent', 2);
          onCancel(); // Close modal
        } else {
          response.text().then((data) => {
            if (data.indexOf('<pre>') !== -1) {
              const text = data.substring(data.indexOf('<pre>') + 5, data.indexOf('</pre>'));
              message.error(text, 2);
            } else {
              message.error(`${response.status} ${response.statusText}`, 2);
            }
          });
        }
      })
      .catch((reason) => {
        this.setState({ sending: false });
        if (reason.message) {
          message.error(reason.message, 4);
        }
      });
    setTimeout(() => controller.abort(), 10000); // 10 seconds max
    this.setState({ sending: true });
  }

  /**
   * Event handler for input field value change
   *
   * @param {*} event
   */
  onChange = (event) => {
    const { id, value } = event.target;
    this.setState({ [id]: value });
  }

  /**
   * Handle the change of protocol for the url
   *
   * @param {string} protocol http or https
   */
  handleProtocolChange = (protocol) => {
    this.setState({ protocol });
  }

  render() {
    const {
      visible,
      agent,
      onCancel,
      graph,
    } = this.props;
    const { protocol, url, sending } = this.state;

    return (
      <Modal
        title="Export to URL"
        visible={visible}
        onOk={this.sendGraph}
        onCancel={onCancel}
        okText="Send"
        confirmLoading={sending}
      >
        <Space direction="vertical">
          <Typography style={{ marginBottom: 10 }}>
            Sends the current graph to the url using the
            <Typography.Text code>POST</Typography.Text>
            method. If the server at the specified url does not respond with a
            status of 200 in 10 seconds, the operation will be aborted.
          </Typography>
          <Input
            id="url"
            addonBefore={(
              <Select
                defaultValue={protocol}
                onChange={this.handleProtocolChange}
              >
                <Select.Option value="https://">https://</Select.Option>
                <Select.Option value="http://">http://</Select.Option>
              </Select>
            )}
            value={url}
            onChange={this.onChange}
            allowClear
          />
        </Space>
        <Divider />
        <Typography>
          Payload to&nbsp;
          {protocol}
          {url}
        </Typography>
        <code>
          <br />
          {'{'}
          <br />
          &nbsp;&nbsp;agent: &quot;
          {agent}
          &quot;,
          <br />
          &nbsp;&nbsp;graph:&nbsp;
          {'{'}
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;nodes: [...], (
          {graph.nodes.length}
          &nbsp;nodes)
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;edges: [...]&nbsp;&nbsp;(
          {graph.edges.length}
          &nbsp;edges)
          <br />
          &nbsp;&nbsp;
          {'}'}
          <br />
          {'}'}
          <br />
        </code>
      </Modal>
    );
  }
}

ExportModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  agent: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  graph: PropTypes.shape({
    nodes: PropTypes.array,
    edges: PropTypes.array,
  }).isRequired,
};
