import React from 'react';
import PropTypes from 'prop-types';
import {
  EVENT_COLOR,
  FALLBACK_COLOR,
  WEBHOOK_COLOR,
} from '../configs/graph';

/**
 * A functional component to render the attributes regarding event, fallback,
 * and webhook. The color of these attributes are defined in configs/graph.js
 *
 * @param {*} props Contains node data
 */
export default function AttributeSVG(props) {
  const { events, isFallback, fulfillment } = props;
  const attributes = [];

  if (!!events && events.length > 0) {
    attributes.push(EVENT_COLOR);
  }

  if (isFallback) {
    attributes.push(FALLBACK_COLOR);
  }

  if (fulfillment) {
    attributes.push(WEBHOOK_COLOR);
  }

  const radius = 5;
  const distance = 15;
  const offset = ((attributes.length - 1) * distance) / 2;
  const shapes = [];

  for (let i = 0; i < attributes.length; i += 1) {
    const color = attributes[i];

    shapes.push(
      <circle
        key={color}
        cx={distance * i - offset}
        cy={-30}
        r={radius}
        fill={color}
      />,
    );
  }

  return (
    <g>
      {shapes}
    </g>
  );
}

AttributeSVG.propTypes = {
  events: PropTypes.arrayOf(PropTypes.string).isRequired,
  isFallback: PropTypes.bool.isRequired,
  fulfillment: PropTypes.bool.isRequired,
};
