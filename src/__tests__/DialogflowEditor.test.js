import React from 'react';
import ReactDom from 'react-dom';
import DialogflowEditor from '../DialogflowEditor';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDom.render(<DialogflowEditor />, div);
});