/**
 * This module contains functions for version controlling the graph
 */

/**
 * This function sends a GET request to the specified server to retrieve the
 * list of graphs. If the graphs are retrieved along with the date, parse it and
 * return it. On error, an empty array is returned.
 *
 * @param {string} url Url to send a request to get the graphs
 * @returns An array of objects containing the date and graph
 */
export async function getGraphs(url) {
  // TODO:
  return [
    { date: 1599613771574, graph: { nodes: [], edges: [] } }
  ];
}

/**
 * This function sends a POST request to the specified server to save the given
 * graph. Throws on error.
 *
 * @param {string} url Url to send a request to save the graph
 * @param {object} graph Graph to send
 */
export async function saveGraph(url, graph) {
  // TODO:
  return true;
}
