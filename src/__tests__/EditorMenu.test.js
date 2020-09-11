import React from 'react';
import { shallow, mount } from 'enzyme';
import '@testing-library/jest-dom';
import { render, fireEvent, cleanup } from '@testing-library/react';
import EditorMenu from '../EditorMenu';
import ExportModal from '../EditorMenu/ExportModal';
import ImportModal from '../EditorMenu/ImportModal';
import VersionControlModal from '../EditorMenu/VersionControlModal';
import { formatDate } from '../EditorMenu/util';

describe('Editor Menu Smoke Test', () => {

  const graph = {
    nodes: [],
    edges: [],
  };
  const clearGraph = jest.fn();
  const importGraph = jest.fn();
  const downloadGraph = jest.fn();
  Object.defineProperty(window, 'localStorage', {
    value: {
      setItem: jest.fn(),
      getItem: jest.fn().mockReturnValue(null)
    }
  });

  it('renders without crashing', () => {
    shallow(
      <EditorMenu
        graph={graph}
        clearGraph={clearGraph}
        importGraph={importGraph}
        downloadGraph={downloadGraph}
      />
    );
  });

  it('renders all the sub modals without crashing', () => {
    mount(
      <EditorMenu
        graph={graph}
        clearGraph={clearGraph}
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
        clearGraph={jest.fn()}
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

  it('renders the editable text field', () => {
    const { getByText } = output;
    const agent = getByText('Name of agent');

    expect(agent).toBeVisible();
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


describe('Export Modal Component', () => {

  const visible = true;
  const agent = 'tempAgent';
  const onCancel = jest.fn();
  const graph = {
    nodes: ['item', 'item'],
    edges: ['item'],
  };
  let output;

  beforeEach(() => {
    output = render(
      <ExportModal
        visible={visible}
        agent={agent}
        onCancel={onCancel}
        graph={graph}
      />
    );
  });

  it('renders without crashing', () => {
    mount(
      <ExportModal
        visible={visible}
        agent={agent}
        onCancel={onCancel}
        graph={graph}
      />
    );
  });

  it('renders the modal with appropriate input', () => {
    const initialValue = 'www.example.com';
    const { getAllByRole } = output;
    const inputs = getAllByRole('textbox');
    let exists = false;

    inputs.forEach((input) => {
      if (input.hasAttribute('value') && input.value === initialValue) {
        exists = true;
      }
    });

    expect(exists).toBeTruthy();
  });

  it('makes a request on send clicked', () => {
    global.fetch = jest.fn(async () => {});
    const { getAllByRole } = output;
    const button = getAllByRole('button', { name: 'Send' })[0];
    
    fireEvent.click(button);
    expect(global.fetch).toHaveBeenCalled();
  });

  it('closes modal on cancel', () => {
    const { getAllByRole } = output;
    const button = getAllByRole('button', { name: 'Close' })[0];

    fireEvent.click(button);
    expect(onCancel).toHaveBeenCalled();
  });
});

describe('Import Modal Component', () => {

  const visible = true;
  const importGraph = jest.fn();
  const onCancel = jest.fn();
  let output = render(
    <ImportModal 
      visible={visible}
      importGraph={importGraph}
      onCancel={onCancel}
    />
  );

  beforeEach(() => {
    output = render(
      <ImportModal 
        visible={visible}
        importGraph={importGraph}
        onCancel={onCancel}
      />
    );
  });

  it('renders without crashing', () => {
    mount(
      <ImportModal 
        visible={visible}
        importGraph={importGraph}
        onCancel={onCancel}
      />
    );
  });

  it('imports file on click', () => {
    const { getAllByRole } = output;
    const button = getAllByRole('button', { name: 'Import' })[0];
    const readAsTextSpy = jest.spyOn(FileReader.prototype, 'readAsText');

    fireEvent.click(button);
    expect(readAsTextSpy).toBeCalledWith('');
  });

});

describe('Version Control Modal Component', () => {

  const visible = true;
  const importGraph = jest.fn();
  const onCancel = jest.fn();
  const graph = {
    nodes: ['item', 'item'],
    edges: ['item'],
  };

  it('renders without crashing', () => {
    mount(
      <VersionControlModal 
        visible={visible}
        importGraph={importGraph}
        graph={graph}
        onCancel={onCancel}
      />
    );
  });
});
