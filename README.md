# Dialogflow Editor
![build](https://travis-ci.com/thinkty/dialogflow-editor.svg?branch=master)

![main](https://imgur.com/AVCTsY4.png)
![editor](https://imgur.com/4xXXyql.png)

## Overview
A web application for making flowcharts specifically for [Dialogflow](https://cloud.google.com/dialogflow)

## Description
Dialogflow editor is aimed to ease the process of creating a flowchart for your chatbot/agent on Dialogflow. Although the user needs a little bit of prior knowledge about [intents](https://cloud.google.com/dialogflow/docs/intents-overview) and [contexts](https://cloud.google.com/dialogflow/docs/contexts-overview) in order to utilize this tool, I tried my best to make it as intuitive as possible.

## Usage
- **Create**: right click on the desired location in the graph and select the type of node to create
- **Edit**: select a node to edit and a side bar containing various input fields will appear on the right
- **Save**: save the graph locally by clicking on the save button at the top
- **Remove**: remove a node by selecting it and pressing the `del` key
- **Import**: click on the `Import from .json` button to import a graph into the editor. The graph must have a valid format
- **Download**: click on the `Export to .json` button to download the graph in a JSON file
- **Export to url**: click on the `Import / Export` button at the top, and click on `Export to url`. Enter the destination url to send the graph in JSON, the name of the agent, and the name of the flowchart. Click `send` to finish

Based on the sample graph, although the flowchart is extremely simple, it shows the basic rules on how to use this tool. One can specify the training phrases, responses, action, events, fallback, fulfillment, and etc just as they can with the Dialogflow Console. I recommend starting the graph with a context node instead of an intent node to have more control over the flow and block any unexpected jumps between conversations.

Thinking of the graph as a [State Diagram](https://en.wikipedia.org/wiki/State_diagram) seems to make it easier to understand. Each context node is the state and the intent nodes that are connected to the context node are the edges. Based on the user input, an intent whose training phrases have a high similarity will be the edge that leads to the next state (context node).

## Plans
- Graph validation: internal validation methods to check for dangling nodes, pattern matching, and more.
- Entity support
- Dynamic SVG shapes: Intent nodes w/ buttons and text areas to show an overview of the node

Feedbacks are welcome!

## License
MIT