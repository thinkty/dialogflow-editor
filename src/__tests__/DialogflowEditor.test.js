import React from 'react';
import { shallow, mount } from 'enzyme';

import DialogflowEditor from '../DialogflowEditor';

describe('Dialogflow Editor Component', () => {

  it('renders without crashing', () => {
    shallow(<DialogflowEditor />);
  });

  it('renders all the sub-components without crashing', () => {
    mount(<DialogflowEditor />);
  });

});
