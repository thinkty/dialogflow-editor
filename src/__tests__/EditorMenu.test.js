import React from 'react';
import { shallow, mount } from 'enzyme';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import EditorMenu from '../EditorMenu';

describe('Editor Menu Smoke Test', () => {

  const graph = {
    nodes: [],
    edges: [],
  };
  const importGraph = jest.fn();
  const downloadGraph = jest.fn();

  it('renders without crashing', () => {
    shallow(
      <EditorMenu
        graph={graph}
        importGraph={importGraph}
        downloadGraph={downloadGraph}
      />
    );
  });

  it('renders all the sub modals without crashing', () => {
    mount(
      <EditorMenu
        graph={graph}
        importGraph={importGraph}
        downloadGraph={downloadGraph}
      />
    );
  });
});

describe('Editor Menu Component', () => {

  Object.defineProperty(window, 'localStorage', {
    value: {
      setItem: jest.fn()
    }
  });

  const graph = {
    nodes: [],
    edges: [],
  };
  const downloadGraph = jest.fn();
  let output;

  beforeEach(() => {
    output = render(
      <EditorMenu
        graph={graph}
        importGraph={jest.fn()}
        downloadGraph={downloadGraph}
      />
    );
  })

  it('stores the graph to localstorage', () => {
    const { getByRole } = output;
    const saveButton = getByRole('button', { name: 'Save' });

    fireEvent.click(saveButton);
    expect(window.localStorage.setItem).toHaveBeenCalledWith('graph', JSON.stringify(graph));
  });

  it('renders the editable text fields', () => {
    const { getByText } = output;
    const agent = getByText('Name of agent');
    const flowchart = getByText('Name of flowchart');

    expect(agent).toBeVisible();
    expect(flowchart).toBeVisible();
  });

  it('exports json to file', () => {
    global.downloadJSON = jest.fn();

    const { getByRole } = output;
    const exportButton = getByRole('button', { name: 'Import / Export down' });
    
    fireEvent.mouseEnter(exportButton);
    const exportAsJSONButton = getByRole('menuitem', { name: 'Export to .json' });
    fireEvent.click(exportAsJSONButton);

    expect(downloadGraph).toHaveBeenCalledTimes(1);
  });
});
