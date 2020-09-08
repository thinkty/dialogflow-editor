import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Radio, message } from 'antd';
import { nodeAttributes } from '../configs/type';
import { nodeTypes } from '../configs/graph';

/**
 * A component to select a type of node to create
 */
export default class ContextMenuModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: '',
    };
  }

  /**
   * Spawn the selected node
   */
  spawnNodeOnMouse = () => {
    const { selected } = this.state;
    const { spawnNode, closeContextMenu } = this.props;

    if (selected === '') {
      message.error('Please select a node type', 3);
      return;
    }

    spawnNode(selected);
    closeContextMenu();
  }

  /**
   * On radio select change
   *
   * @param {*} event
   */
  onChange = (event) => {
    this.setState({ selected: event.target.value });
  }

  render() {
    const { openContextMenu, closeContextMenu, mousePosition } = this.props;
    const top = mousePosition[1];
    const left = mousePosition[0] - window.innerWidth / 2;

    return (
      <Modal
        title={null}
        visible={openContextMenu}
        closable={false}
        okText="Spawn"
        onOk={this.spawnNodeOnMouse}
        onCancel={closeContextMenu}
        mask={false}
        style={{ top, left }}
      >
        <p>Select the type of node to spawn at the mouse point</p>
        <Radio.Group onChange={this.onChange}>
          {
            nodeTypes.map((type) => (
              <Radio.Button key={type} value={type}>
                { nodeAttributes[type].displayName }
              </Radio.Button>
            ))
          }
        </Radio.Group>
      </Modal>
    );
  }
}

ContextMenuModal.propTypes = {
  openContextMenu: PropTypes.bool.isRequired,
  mousePosition: PropTypes.array.isRequired,
  closeContextMenu: PropTypes.func.isRequired,
  spawnNode: PropTypes.func.isRequired,
};
