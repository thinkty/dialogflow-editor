import React from 'react';
import ReactDom from 'react-dom';
import NodeEditor from '../NodeEditor';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDom.render(<NodeEditor />, div);
});