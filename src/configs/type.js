/**
 * Configuration file for the attributes for each type specified in graph.js
 */

import {
  INTENT_TYPE,
  CONTEXT_TYPE,
} from './graph';

export const generalAttributes = ["id", "title"];

export const nodeAttributes = {
  [INTENT_TYPE]: {
    displayName: 'Intent Node',
    attributes: {
      type: INTENT_TYPE,
      contexts: {
        in: [],
        out: [],
      },
      events: [],
      trainingPhrases: [],
      action: '',
      responses: [],
      fulfillment: false,
    },
  },
  [CONTEXT_TYPE]: {
    displayName: 'Context Node',
    attributes: {
      type: CONTEXT_TYPE,
    },
  },
};
