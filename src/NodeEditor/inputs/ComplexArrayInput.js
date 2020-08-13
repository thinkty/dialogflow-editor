import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Space, Button } from 'antd';
import SimpleArrayInput from './SimpleArrayInput';

/**
 * A component for editting an array of arrays with multiple interactive lists
 * and multiple text input fields corresponding to hose array of input fields
 */
export default class ComplexArrayInput extends Component {
  /**
   * Handle changes to individual pools of responses
   *
   * @param {*} event Contains the id and value of the changed pool
   */
  onChange = (event) => {
    // Id is the index number of the pool
    const index = event.target.id;
    const updatedPool = event.target.value;
    const { onChange, id, pools } = this.props;

    // Remove the pool if empty
    if (updatedPool.length === 0) {
      pools.splice(index, 1);
      onChange({ target: { id, value: pools } });
      return;
    }

    // Update the pool with the given index and update all the pools
    pools[index] = updatedPool;
    onChange({ target: { id, value: pools } });
  }

  /**
   * Handle adding a new pool
   */
  addNewPool = () => {
    const { onChange, id, pools } = this.props;
    pools.push([]);
    onChange({ target: { id, value: pools } });
  }

  render() {
    const { pools, label } = this.props;
    const simpleArrayInputs = [];

    for (let i = 0; i < pools.length; i += 1) {
      simpleArrayInputs.push(
        <SimpleArrayInput
          key={i}
          id={`${i}`}
          onChange={this.onChange}
          items={pools[i]}
          label={label}
        />
      );
    }

    return (
      <Space direction="vertical" style={{ width: '100%' }}>
        {
          simpleArrayInputs
        }
        <Button
          shape="circle"
          onClick={this.addNewPool}
          size="large"
        >
          +
        </Button>
      </Space>
    );
  }
}

ComplexArrayInput.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  pools: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  label: PropTypes.string.isRequired,
};
