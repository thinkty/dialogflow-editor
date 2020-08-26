# Dialogflow Editor
![build](https://travis-ci.com/thinkty/dialogflow-editor.svg?branch=master)

![main](https://imgur.com/AVCTsY4.png)
![editor](https://imgur.com/4xXXyql.png)
![export](https://imgur.com/p3Yc9za.png)

## Overview
A web application for making flowcharts specifically for [Dialogflow](https://cloud.google.com/dialogflow)

## Description
Dialogflow editor is aimed to ease the process of creating a flowchart for your chatbot/agent on Dialogflow. Although the user needs a little bit of prior knowledge about [intents](https://cloud.google.com/dialogflow/docs/intents-overview) and [contexts](https://cloud.google.com/dialogflow/docs/contexts-overview) in order to utilize this tool, I tried my best to make it as intuitive as possible.

This tool only consists of the editting part and does not contain any process for the actual parsing and uploading of the intents to Dialogflow. This is intended as the backend requires various private information about the dialogflow agent which I am not willing to handle at the moment. Also, since the graph's nodes are already divided into intents and contexts, I do not think that it will be too difficult to quickly build a REST server to handle the parsing and updating parts. I'm also planning to create a sample node.js server on how to do this and perhaps add an Authorization header option when exporting.

## Usage
- **Create**: right click on the desired location in the graph and select the type of node to create
- **Copy**: select a node to copy and press the `ctrl` key while clicking on the position to paste the selected node to
- **Edit**: select a node to edit and a side bar containing various input fields will appear on the right
- **Remove**: remove a node by selecting it and pressing the `del` key
- **Save**: save the graph locally by clicking on the save button at the top
- **Import**: click on the `Import from .json` button to import a graph into the editor. The graph must have a valid format
- **Download**: click on the `Export to .json` button to download the graph in a JSON file
- **Export to url**: click on the `Import / Export` button at the top, and click on `Export to url`. Enter the destination url to send the graph in JSON, the name of the agent, and the name of the flowchart. Click `send` to finish

Based on the sample graph, although the flowchart is extremely simple, it shows the basic rules on how to use this tool. One can specify the training phrases, responses, action, events, fallback, fulfillment, and etc just as they can with the Dialogflow Console. I recommend starting the graph with a context node instead of an intent node to have more control over the flow and block any unexpected jumps between conversations.

Thinking of the graph as a [State Diagram](https://en.wikipedia.org/wiki/State_diagram) seems to make it easier to understand. Each context node is the state and the intent nodes that are connected to the context node are the edges. Based on the user input, an intent whose training phrases have a high similarity will be the edge that leads to the next state (context node).

## Plans
- Entity support : I am currently thinking of ways to enable Entity highlighting as accessible as possible in the Editor
- Dynamic SVG shapes : Intent nodes w/ buttons and text areas to show an overview of the node
- Custom payloads : Some platforms have quick replies and other various rich formats. I plan to support those by adding an editor section which the user can input any custom payloads that will be saved to the Intent
- Authorization OR OAuth : I am still learning about this so this might take some time

Feedbacks are welcome!

## License
MIT