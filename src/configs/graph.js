/**
 * Configuration file for the SVGs available in the react-digraph component.
 * To add a new node or edge shape, follow the steps below.
 *
 * 1. Declare the node/edge type
 * 2. (optional) Specify the dimensions for the new type
 * 3. Draw the shape in SVG
 * 4. Modify the export to include the new type
 */

import React from 'react';

export const NODE_KEY = 'id';
const DEFAULT_COLOR = '#f8f8f8';

// Declaration of node types and edge types

export const INTENT_TYPE = 'intentNode';
export const CONTEXT_TYPE = 'contextNode';
export const BASIC_EDGE = 'basicEdge';

export const nodeTypes = [INTENT_TYPE, CONTEXT_TYPE];
export const edgeTypes = [BASIC_EDGE];

// Dimensions for each types

const INTENT_WIDTH = 100;
const INTENT_HEIGHT = 100;
const INTENT_VIEWBOX = `0 0 ${INTENT_WIDTH} ${INTENT_HEIGHT}`;
const CONTEXT_RADIUS = 40;
const CONTEXT_VIEWBOX = `0 0 ${CONTEXT_RADIUS * 2 + 2} ${CONTEXT_RADIUS * 2 + 2}`;

// Shape specifications for each types

const intentNodeShape = (
  <symbol
    viewBox={INTENT_VIEWBOX}
    width={INTENT_WIDTH}
    height={INTENT_HEIGHT}
    id="intentNode"
  >
    <rect
      width={INTENT_WIDTH}
      height={INTENT_HEIGHT}
      rx="10"
      ry="10"
      fill={DEFAULT_COLOR}
    />
  </symbol>
);

const contextNodeShape = (
  <symbol
    viewBox={CONTEXT_VIEWBOX}
    width={CONTEXT_RADIUS * 2 + 2}
    height={CONTEXT_RADIUS * 2 + 2}
    id="contextNode"
  >
    <circle
      width={CONTEXT_RADIUS * 2 + 2}
      height={CONTEXT_RADIUS * 2 + 2}
      cx={CONTEXT_RADIUS + 1}
      cy={CONTEXT_RADIUS + 1}
      r={CONTEXT_RADIUS}
      fill={DEFAULT_COLOR}
    />
  </symbol>
);

const basicEdgeShape = (
  <symbol viewBox="0 0 50 50" id="basicEdge">
    <circle cx="25" cy="25" r="0" />
  </symbol>
);

// Export

export default {
  EdgeTypes: {
    basicEdge: {
      shape: basicEdgeShape,
      shapeId: '#basicEdge',
    },
  },
  NodeSubTypes: {},
  NodeTypes: {
    intentNode: {
      shape: intentNodeShape,
      shapeId: '#intentNode',
      width: INTENT_WIDTH,
      height: INTENT_HEIGHT,
    },
    contextNode: {
      shape: contextNodeShape,
      shapeId: '#contextNode',
      width: CONTEXT_RADIUS * 2,
      height: CONTEXT_RADIUS * 2,
    },
  },
};
