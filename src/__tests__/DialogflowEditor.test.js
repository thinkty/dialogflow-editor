import React from 'react';
import { shallow, mount } from 'enzyme';
import '@testing-library/jest-dom';
import { render, fireEvent, cleanup } from '@testing-library/react';
import DialogflowEditor from '../DialogflowEditor';
import ContextMenuModal from '../DialogflowEditor/ContextMenuModal';

describe('Dialogflow Editor Component', () => {

  it('renders without crashing', () => {
    shallow(<DialogflowEditor />);
  });

  it('renders all the sub-components without crashing', () => {
    mount(<DialogflowEditor />);
  });

});

describe('Context Menu Modal Component', () => {

  const openContextMenu = true;
  const closeContextMenu = jest.fn();
  const spawnNode = jest.fn();
  let output = render(
    <ContextMenuModal
      openContextMenu={openContextMenu}
      closeContextMenu={closeContextMenu}
      spawnNode={spawnNode}
    />
  );

  it('renders without crashing', () => {
    shallow(
      <ContextMenuModal
        openContextMenu={openContextMenu}
        closeContextMenu={closeContextMenu}
        spawnNode={spawnNode}
      />
    );
  });

  it('renders all the sub-components without crashing', () => {
    mount(
      <ContextMenuModal
        openContextMenu={openContextMenu}
        closeContextMenu={closeContextMenu}
        spawnNode={spawnNode}
      />
    );
  });

  it('closes on cancel click', () => {
    const { getByRole } = output;
    const button = getByRole('button', {name: 'Cancel'});
    fireEvent.click(button);
    expect(closeContextMenu).toHaveBeenCalled();
  });

  it('checks the selected type before spawning', () => {
    const { getByRole } = output;
    const button = getByRole('button', {name: 'Spawn'});
    fireEvent.click(button);
    expect(spawnNode).not.toHaveBeenCalled();
  });

  it('spawns the node on spawn click', () => {
    const { getByRole } = output;
    const type = getByRole('radio', {name: 'Intent Type'});
    fireEvent.click(type);

    const button = getByRole('button', {name: 'Spawn'});
    fireEvent.click(button);

    expect(spawnNode).toHaveBeenCalled();
  });
});
