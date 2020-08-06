
/**
 * Download the current graph in a json file. This works by creating an html
 * element of type a with attribute href set as the graph data. By executing the
 * click on the element through js, it will initiate the download. See the below
 * link for detailed explanation
 * 
 * @see https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
 * @param {*} graph Current graph object
 */
export function downloadJSON(graph) {
  const graphStr = JSON.stringify(graph);
  const dataStr = 'data:text/json;charset=utf-8,' + graphStr;

  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', 'graph.json');
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}