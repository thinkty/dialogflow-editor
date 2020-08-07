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
  CONTEXT_TYPE,
} from '../configs/graph';
import NodeEditor from '../NodeEditor';
import EditorMenu from '../EditorMenu';

const { Content, Sider, Header } = Layout;
const sample = require('../sample.json');

/**
 * Main component to edit intents
 */
export default class DialogflowEditor extends Component {
  constructor(props) {
    super(props);
    const localGraph = localStorage.getItem('graph');
    this.state = {
      graph: !localGraph ? sample : JSON.parse(localGraph),
      selected: null,
      type: nodeTypes[0],
      layoutEngineType: 'VerticalTree',
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
        out: [],
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
        const value = edge.source === id ? 'in' : 'out';
        connectedNodeIds.set(key, value);
        return false;
      }
      return true;
    });

    // Remove the nodeId from any of the connected nodes' contexts if the
    // deleted node is a context node
    if (viewNode.type === CONTEXT_TYPE) {
      graph.nodes = nodeArr.map((node) => {
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

    // Rerender graph on delete node
    this.updateGraph();
  };

  /**
   * Edge 'mouseUp' handler
   *
   * @param {IEdge} viewEdge
   */
  onSelectEdge = (viewEdge) => {
    this.setState({ selected: viewEdge });
  };

  /**
   * Determines if an edge can be created or not. Currently, an edge can only be
   * created between an intent node and a context node. An edge that tries to
   * connect the same type of nodes will not be created
   *
   * @param {INode} startNode Source node of the edge
   * @param {INode} endNode Target node of the edge
   * @returns {Boolean} Whether it can create an edge or not
   */
  canCreateEdge = (startNode, endNode) => {
    // Allow edge creation when source or target is undefined. If false is
    // returned here, the svg will not even render.
    if (!startNode || !endNode) {
      return true;
    }

    return (startNode.type !== endNode.type);
  }

  /**
   * Creates a new edge between two nodes. Only add the edge when the source
   * node is not the same as the target. When adding an edge, update the context
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

    if (viewEdge.source !== viewEdge.target) {
      const isInputContext = (sourceViewNode.type === CONTEXT_TYPE);
      const intentNode = (isInputContext ? targetViewNode : sourceViewNode);
      const contextNode = (isInputContext ? sourceViewNode : targetViewNode);

      graph.nodes = graph.nodes.map((node) => {
        if (node[NODE_KEY] === intentNode[NODE_KEY]) {
          node.contexts[isInputContext ? 'in' : 'out'].push(contextNode[NODE_KEY]);
        }
        return node;
      });

      graph.edges = [...graph.edges, viewEdge];
      this.setState({
        graph,
      });

      // Rerender graph on create edge
      this.updateGraph();
    }
  };

  /**
   * Determines if an edge can be swapped or not based on the rules similar to
   * canCreateEdge.
   *
   * TODO: This feature is not yet released (v6.7.1)
   *
   * @param {INode} sourceNode
   * @param {INode} targetNode
   * @param {IEdge} edge
   * @returns {Boolean} Whether it can swap edge or not
   */
  canSwapEdge = (sourceNode, targetNode, edge) => {}

  /**
   * Called when an edge is reattached to a different target. On swapping edge,
   * if the source node is an intent node, it should remove the previous context
   * from the output and add the new context. If the source node is a context
   * node, the previous target intent node should remove the input context and
   * the new target intent node should add the context node.
   *
   * @param {INode} sourceViewNode
   * @param {INode} targetViewNode
   * @param {IEdge} viewEdge
   */
  onSwapEdge = (sourceViewNode, targetViewNode, viewEdge) => {
    const { graph } = this.state;
    const i = this.getEdgeIndex(viewEdge);
    const edge = JSON.parse(JSON.stringify(graph.edges[i]));
    const prevTarget = viewEdge.target;

    edge.source = sourceViewNode[NODE_KEY];
    edge.target = targetViewNode[NODE_KEY];
    graph.edges[i] = edge;
    // reassign the array reference to re-render a swapped edge
    graph.edges = [...graph.edges];

    if (sourceViewNode.type === INTENT_TYPE) {
      graph.nodes = graph.nodes.map((node) => {
        if (node[NODE_KEY] === sourceViewNode[NODE_KEY]) {
          // Remove the old context and add the new context
          const index = node.contexts.out.indexOf(prevTarget);
          if (index > -1) {
            node.contexts.out.splice(index, 1);
          }
          node.contexts.out.push(targetViewNode[NODE_KEY]);
        }
        return node;
      });
    } else if (sourceViewNode.type === CONTEXT_TYPE) {
      graph.nodes = graph.nodes.map((node) => {
        if (node[NODE_KEY] === prevTarget) {
          // Remove the current context from the previous target intent node
          const index = node.contexts.in.indexOf(node[NODE_KEY]);
          if (index > -1) {
            node.contexts.in.splice(index, 1);
          }
        } else if (node[NODE_KEY] === targetViewNode[NODE_KEY]) {
          // Add the current context to the new target intent node
          node.contexts.in.push(node[NODE_KEY]);
        }
        return node;
      });
    } else {
      throw new Error(`Unexpected node type for ${sourceViewNode[NODE_KEY]}`);
    }

    this.setState({
      graph,
    });

    // Re-render graph after swapping edge
    this.updateGraph();
  };

  /**
   * Called when an edge is deleted. If the source node is an intent node,
   * remove the target context node id from the context list. If the source node
   * was a context node, remove the context node id from the target intent
   * node's context list.
   *
   * @param {IEdge} viewEdge
   * @param {IEdge[]} edges
   */
  onDeleteEdge = (viewEdge, edges) => {
    const { graph } = this.state;

    graph.nodes = graph.nodes.map((node) => {
      if (node.type === INTENT_TYPE) {
        if (node[NODE_KEY] === viewEdge.source) {
          const index = node.contexts.out.indexOf(viewEdge.target);
          if (index > -1) {
            node.contexts.out.splice(index, 1);
          }
        } else if (node[NODE_KEY] === viewEdge.target) {
          const index = node.contexts.in.indexOf(viewEdge.source);
          if (index > -1) {
            node.contexts.in.splice(index, 1);
          }
        }
      }

      return node;
    });

    graph.edges = edges;
    this.setState({
      graph,
    });

    // Re render graph on delete edge
    this.updateGraph();
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
    this.setState({ layoutEngineType: 'None' });

    setTimeout(() => {
      this.setState({ layoutEngineType: 'VerticalTree' });
    }, 5);
  }

  render() {
    const { graph, selected, layoutEngineType } = this.state;
    const { nodes, edges } = graph;
    const { NodeTypes, NodeSubTypes, EdgeTypes } = GraphConfig;

    return (
      <Layout hasSider>
        <Header
          style={{
            position: 'fixed',
            width: '100vw',
            backgroundColor: '#fff',
            zIndex: 1,
            borderStyle: 'none none solid none',
            borderWidth: 1,
            borderBottomColor: '#d3d3d3',
          }}
        >
          <EditorMenu graph={graph} />
        </Header>
        <Sider
          defaultCollapsed={false}
          collapsedWidth={0}
          collapsible
          collapsed={!selected || selected.source}
          trigger={null}
          width="30vw"
          style={{
            height: '100vh',
            overflow: 'auto',
            position: 'fixed',
            right: 0,
            background: '#fff',
            paddingTop: '70px',
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
