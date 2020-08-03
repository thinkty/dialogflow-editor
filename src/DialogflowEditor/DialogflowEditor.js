import React, { Component } from 'react';
// eslint-disable-next-line
import { INode, IEdge, GraphView } from 'react-digraph';
import { v4 as uuidv4 } from 'uuid';
import { Layout } from 'antd';
import GraphConfig, {
  NODE_KEY,
  nodeTypes,
  BASIC_EDGE
} from '../configs/graph';
import NodeEditor from '../NodeEditor/NodeEditor';

const { Content, Sider } = Layout;
const sample = require('../sample.json');

/**
 * Main component to edit intents
 */
export default class DialogflowEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graph: sample,
      selected: null,
      type: nodeTypes[0],
    };
  }

  /**
   * Helper to find the index of a given node
   *
   * @param {INode} searchNode
   * @returns {number} Index of the search node
   */
  getNodeIndex(searchNode) {
    const { graph } = this.state;
    const { nodes } = graph;

    return nodes.findIndex((node) => (
      node[NODE_KEY] === searchNode[NODE_KEY]
    ));
  }

  /**
   * Helper to find the index of a given edge
   *
   * @param {IEdge} searchEdge
   * @returns {number} Index of the search edge
   */
  getEdgeIndex(searchEdge) {
    const { graph } = this.state;
    const { edges } = graph;

    return edges.findIndex((edge) => (
      edge.source === searchEdge.source && edge.target === searchEdge.target
    ));
  }

  /**
   * Helper to find the node of a given node key
   *
   * @param {String} nodeKey
   * @returns {INode} Node corresponding to the given node key
   */
  getViewNode(nodeKey) {
    const searchNode = {};
    const { graph } = this.state;
    const { nodes } = graph;

    searchNode[NODE_KEY] = nodeKey;
    const i = this.getNodeIndex(searchNode);

    return nodes[i];
  }

  /**
   * Called by 'drag' handler, etc. to sync coordinates from D3 with the graph
   *
   * @param {INode} viewNode
   */
  onUpdateNode = (viewNode) => {
    const { graph } = this.state;
    const i = this.getNodeIndex(viewNode);

    graph.nodes[i] = viewNode;
    this.setState({ graph });
  };

  /**
   * Called by 'mouseUp' handler
   *
   * @param {(INode|Wnull)} viewNode
   */
  onSelectNode = (viewNode) => {
    // Deselect events will send Null viewNode
    this.setState({ selected: viewNode });
  };

  /**
   * Updates the graph with a new node
   *
   * @param {number} x Coordinates
   * @param {number} y Coordinates
   */
  onCreateNode = (x, y) => {
    const { graph, type } = this.state;
    const viewNode = {
      id: uuidv4(),
      title: '',
      type,
      x,
      y,
    };

    graph.nodes = [...graph.nodes, viewNode];
    this.setState({ graph });
  };

  /**
   * Deletes a node from the graph
   *
   * @param {INode} viewNode
   * @param {String} nodeId
   * @param {Inode[]} nodeArr
   */
  onDeleteNode = (viewNode, nodeId, nodeArr) => {
    const { graph } = this.state;

    // Delete any connected edges
    const newEdges = graph.edges.filter((edge, i) => (
      edge.source !== viewNode[NODE_KEY] && edge.target !== viewNode[NODE_KEY]
    ));

    graph.nodes = nodeArr;
    graph.edges = newEdges;

    this.setState({ graph, selected: null });
  };

  /**
   * Edge 'mouseUp' handler
   *
   * @param {IEdge} viewEdge
   */
  onSelectEdge = (viewEdge) => {
    // Do nothing on select edge
  };

  /**
   * Creates a new node between two edges
   *
   * @param {INode} sourceViewNode
   * @param {INode} targetViewNode
   */
  onCreateEdge = (sourceViewNode, targetViewNode) => {
    const { graph } = this.state;
    const type = BASIC_EDGE;

    const viewEdge = {
      id: uuidv4(),
      source: sourceViewNode[NODE_KEY],
      target: targetViewNode[NODE_KEY],
      type,
    };

    // Only add the edge when the source node is not the same as the target
    if (viewEdge.source !== viewEdge.target) {
      graph.edges = [...graph.edges, viewEdge];
      this.setState({
        graph,
      });
    }
  };

  /**
   * Called when an edge is reattached to a different target
   *
   * @param {INode} sourceViewNode
   * @param {INode} targetViewNode
   * @param {IEdge} viewEdge
   */
  onSwapEdge = (sourceViewNode, targetViewNode, viewEdge) => {
    const { graph } = this.state;
    const i = this.getEdgeIndex(viewEdge);
    const edge = JSON.parse(JSON.stringify(graph.edges[i]));

    edge.source = sourceViewNode[NODE_KEY];
    edge.target = targetViewNode[NODE_KEY];
    graph.edges[i] = edge;
    // reassign the array reference to re-render a swapped edge
    graph.edges = [...graph.edges];

    this.setState({
      graph,
    });
  };

  /**
   * Called when an edge is deleted
   *
   * @param {IEdge} viewEdge
   * @param {IEdge[]} edges
   */
  onDeleteEdge = (viewEdge, edges) => {
    const { graph } = this.state;

    graph.edges = edges;
    this.setState({
      graph,
    });
  };

  /**
   * Called when mouse-right clicked
   * TODO: This feature is not released yet
   *
   * @param {number} x
   * @param {number} y
   * @param {Object} event D3 event
   */
  onContextMenu = (x, y, event) => {
    event.prevenDefault();
    // TODO: Prompt new node on right click
    console.log('Right clicked');
  }

  /**
   * Function to render custom background for the graph
   *
   * @param {number} gridSize
   */
  renderBackground = (gridSize) => (
    <rect
      x={-(gridSize || 0) / 4}
      y={-(gridSize || 0) / 4}
      width={gridSize}
      height={gridSize}
      fill="#e9e9e9"
    />
  );

  render() {
    const { graph, selected } = this.state;
    const { nodes, edges } = graph;
    const { NodeTypes, NodeSubTypes, EdgeTypes } = GraphConfig;

    return (
      <Layout hasSider>
        <Sider
          defaultCollapsed={false}
          collapsedWidth={0}
          collapsible
          collapsed={!selected}
          trigger={null}
          width="30vw"
          style={{
            height: '100vh',
            position: 'fixed',
            right: 0,
            background: '#fff',
          }}
        >
          <NodeEditor selected={selected}/>
        </Sider>
        <Content
          style={{
            height: '100vh',
          }}
        >
          <GraphView
            nodeKey={NODE_KEY}
            nodes={nodes}
            edges={edges}
            selected={selected}
            nodeTypes={NodeTypes}
            nodeSubtypes={NodeSubTypes}
            edgeTypes={EdgeTypes}
            onSelectNode={this.onSelectNode}
            onCreateNode={this.onCreateNode}
            onUpdateNode={this.onUpdateNode}
            onDeleteNode={this.onDeleteNode}
            onSelectEdge={this.onSelectEdge}
            onCreateEdge={this.onCreateEdge}
            onSwapEdge={this.onSwapEdge}
            onDeleteEdge={this.onDeleteEdge}
            renderBackground={this.renderBackground}
          />
        </Content>
      </Layout>
    );
  }
}
