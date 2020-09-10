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
export function getGraphs(url) {
  const controller = new AbortController();
  const options = {
    method: 'GET',
    signal: controller.signal,
  };

  setTimeout(() => { controller.abort() }, 10000);
  return fetch(url, options)
    .then((response) => (response.json()));
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
