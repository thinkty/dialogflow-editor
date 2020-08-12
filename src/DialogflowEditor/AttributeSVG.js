import React from 'react';
import PropTypes from 'prop-types';
import {
  EVENT_COLOR,
  FALLBACK_COLOR,
  WEBHOOK_COLOR,
} from '../configs/graph';

const EV = EVENT_COLOR;
const FB = FALLBACK_COLOR;
const WH = WEBHOOK_COLOR;

/**
 * A functional component to render the attributes regarding event, fallback,
 * and webhook. The color of these attributes are defined in configs/graph.js
 *
 * @param {*} props Contains node data
 */
export default function AttributeSVG(props) {
  const { events, isFallback, fulfillment } = props;
  const specifiedAttributes = [];

  if (!!events && events.length > 0) {
    specifiedAttributes.push(EV);
  }

  if (isFallback) {
    specifiedAttributes.push(FB);
  }

  if (fulfillment) {
    specifiedAttributes.push(WH);
  }

  const radius = 7;
  const offset = (specifiedAttributes.length - 1) * radius;
  const shapes = [];

  for (let i = 0; i < specifiedAttributes.length; i += 1) {
    const color = specifiedAttributes[i];

    shapes.push(
      <circle
        key={color}
        cx={20 * i - offset}
        cy={-30}
        r={radius}
        fill={color}
      />,
    );
  }

  return (
    <g>
      {
        shapes
      }
    </g>
  );
}

AttributeSVG.propTypes = {
  events: PropTypes.arrayOf(PropTypes.string).isRequired,
  isFallback: PropTypes.bool.isRequired,
  fulfillment: PropTypes.bool.isRequired,
};
