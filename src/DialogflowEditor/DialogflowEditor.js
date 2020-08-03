import React, { Component } from 'react';
// eslint-disable-next-line
import { INode, IEdge, GraphView } from 'react-digraph';
import { v4 as uuidv4 } from 'uuid';
import { Layout } from 'antd';
import GraphConfig, {
  NODE_KEY,
  nodeTypes,
  BASIC_EDGE,
  INTENT_TYPE,
  CONTEXT_TYPE
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
      layoutEngineType: "VerticalTree"
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

    // Initialize contexts if it is an intent node
    if (type === INTENT_TYPE) {
      viewNode.contexts = {
        in: [],
        out: []
      };
    }

    graph.nodes = [...graph.nodes, viewNode];
    this.setState({ graph });
  };

  /**
   * Deletes a node from the graph
   *
   * @param {INode} viewNode
   * @param {String} nodeId
   * @param {INode[]} nodeArr
   */
  onDeleteNode = (viewNode, nodeId, nodeArr) => {
    const { graph } = this.state;

    // Delete any connected edges and save the connected nodes for later use
    const connectedNodeIds = new Map();
    const newEdges = graph.edges.filter((edge, i) => {
      const id = viewNode[NODE_KEY];

      if (edge.source === id || edge.target === id) {
        const key = edge.source === id ? edge.target : edge.source;
        const value = edge.source === id ? "in" : "out";
        connectedNodeIds.set(key, value);
        return false;
      }
      return true;
    });

    // Remove the nodeId from any of the connected nodes' contexts if the
    // deleted node is a context node
    if (viewNode.type === CONTEXT_TYPE) {
      graph.nodes = nodeArr.map(node => {
        if (connectedNodeIds.has(node[NODE_KEY])) {
          const value = connectedNodeIds.get(node[NODE_KEY]);
          const index = node.contexts[value].indexOf(nodeId);
          if (index > -1) {
            node.contexts[value].splice(index, 1);
          }
        }
        return node;
      });
    } else {
      graph.nodes = nodeArr;
    }

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
   * Creates a new edge between two nodes
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

    // Only add the edge when the source node is not the same as the target and
    // they should have different types
    if (viewEdge.source !== viewEdge.target &&
      sourceViewNode.type !== targetViewNode.type) 
    {
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

  /**
   * Update the graph when some of the nodes has changed. The update is
   * triggered by changing the layout engine type which is not an intuitive
   * method of doing but it works.
   * 
   * @see https://github.com/uber/react-digraph/issues/192#issuecomment-577770253
   */
  updateGraph = () => {

    // Replace the modified node from the nodes array
    this.setState({
      layoutEngineType: "None"
    });

    setTimeout(() => {
      this.setState({
        layoutEngineType: "VerticalTree"
      });
    }, 5);
  }

  render() {
    const { graph, selected, layoutEngineType } = this.state;
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
          <NodeEditor
            selected={selected}
            update={this.updateGraph}
          />
        </Sider>
        <Content
          style={{
            height: '100vh',
          }}
        >
          <GraphView
            layoutEngineType={layoutEngineType}
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
            canCreateEdge={this.canCreateEdge}
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
