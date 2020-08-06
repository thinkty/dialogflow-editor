import React from 'react';
import { shallow, mount } from 'enzyme';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';

import NodeEditor from '../NodeEditor';
import DisabledArrayInput from '../NodeEditor/inputs/DisabledArrayInput';
import DisabledTextInput from '..//NodeEditor/inputs/DisabledTextInput';
import SimpleArrayInput from '../NodeEditor/inputs/SimpleArrayInput';
import SimpleBooleanInput from '../NodeEditor/inputs/SimpleBooleanInput';
import SimpleTextInput from '../NodeEditor/inputs/SimpleTextInput';

describe('Node Editor Smoke Test', () => {

  it('renders without crashing', () => {
    shallow(<NodeEditor />);
  });

  it('renders all the sub input components without crashing', () => {
    mount(<NodeEditor />);
  });

});

describe('Node Editor Component w/ Intent Node', () => {

  const selected = {
    id: "a0c13faf-723d-4208-85d0-76eaf7c790c5",
    title: "inode1",
    type: "intentNode",
    contexts: {
      in: ["c802d68d-c57d-40cf-bb72-536b5413741d"],
      out: []
    },
    events: ["start"],
    trainingPhrases: ["default training phrase"],
    action: "checkUser",
    responses: ["default response"],
    fulfillment: false
  };
  const updateSpy = jest.fn();
  let output;

  beforeEach(() => {

    // https://jestjs.io/docs/en/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    output = render(<NodeEditor selected={selected} update={updateSpy} />);
  });

  it('renders the node editor with intent node', () => {
    const { getByText, getAllByText } = output;
    expect(getByText('Node Data')).toBeVisible();
    expect(getAllByText('Contexts')[0]).toBeVisible();
    expect(getByText('Input Contexts')).toBeVisible();
    expect(getByText('Output Contexts')).toBeVisible();
    expect(getByText('Action')).toBeVisible();
    expect(getByText('Events')).toBeVisible();
    expect(getAllByText('Responses')[0]).toBeVisible();
    expect(getByText('Fulfillment')).toBeVisible();
    expect(getAllByText('Training Phrases')[0]).toBeVisible();
  });

  it('renders with input components', () => {
    const { getByText, getByDisplayValue } = output;
    expect(getByDisplayValue(selected.id)).toBeVisible();
    expect(getByDisplayValue(selected.title)).toBeVisible();
    expect(getByDisplayValue(selected.type)).toBeVisible();
    expect(getByText(selected.contexts.in[0])).toBeVisible();
    expect(getByText(selected.events[0])).toBeVisible();
    expect(getByText(selected.trainingPhrases[0])).toBeVisible();
    expect(getByDisplayValue(selected.action)).toBeVisible();
    expect(getByText(selected.responses[0])).toBeVisible();
  });
});

describe('Node Editor Component w/ Context Node', () => {

  const selected = {
    id: "c802d68d-c57d-40cf-bb72-536b5413741d",
    title: "cnode1",
    type: "contextNode"
  };
  const updateSpy = jest.fn();
  let output;

  beforeEach(() => {

    // https://jestjs.io/docs/en/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    output = render(<NodeEditor selected={selected} update={updateSpy} />);
  });

  it('renders the node editor with context node', () => {
    const { getByText, getByDisplayValue } = output;
    expect(getByText('Id')).toBeVisible();
    expect(getByDisplayValue(selected.id)).toBeVisible();
    expect(getByText('Type')).toBeVisible();
    expect(getByDisplayValue(selected.type)).toBeVisible();
    expect(getByText('Name')).toBeVisible();
    expect(getByDisplayValue(selected.title)).toBeVisible();
  });

  it('updates the name of the context node', () => {
    const { getByDisplayValue } = output;
    const input = getByDisplayValue(selected.title);

    fireEvent.change(input, { target: { value: 'new name' } });

    expect(updateSpy).toHaveBeenCalled();
  });

  it('renders immutable inputs as disabled', () => {
    const { getByDisplayValue } = output;
    const disabledInput = getByDisplayValue(selected.id);
    expect(disabledInput).toHaveAttribute('disabled');
  });
});