import React, { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import TextNode from './nodes/TextNode';
import NodesPanel from './panels/NodesPanel';
import SettingsPanel from './panels/SettingsPanel';
import SaveButton from './SaveButton';
import ErrorNotification from './ErrorNotification';

// Initial nodes for demonstration
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'textNode',
    position: { x: 250, y: 200 },
    data: { text: 'test message 1' },
  },
];

const initialEdges: Edge[] = [];

// Function to load saved flow from localStorage
const loadSavedFlow = () => {
  try {
    const savedFlow = localStorage.getItem('chatbot-flow');
    if (savedFlow) {
      const flowData = JSON.parse(savedFlow);
      console.log('Loading saved flow from localStorage:', flowData);
      return {
        nodes: flowData.nodes || initialNodes,
        edges: flowData.edges || initialEdges,
      };
    }
  } catch (error) {
    console.error('Error loading saved flow:', error);
  }
  return {
    nodes: initialNodes,
    edges: initialEdges,
  };
};

// Load saved data or use initial data
const { nodes: loadedNodes, edges: loadedEdges } = loadSavedFlow();
// Define custom node types
const nodeTypes = {
  textNode: TextNode,
};

const ChatbotFlowBuilder: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(loadedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(loadedEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  let dragNodeId = useRef<string | null>(null);

  // Handle connection between nodes
  const onConnect = useCallback(
    (params: Connection | Edge) => {
      // Check if source already has a connection (only one edge per source handle)
      const sourceHasConnection = edges.some(edge => 
        edge.source === params.source && edge.sourceHandle === params.sourceHandle
      );
      
      if (!sourceHasConnection) {
        setEdges((eds) => addEdge(params, eds));
      }
    },
    [edges, setEdges]
  );

  // Handle node selection
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.stopPropagation();
      setSelectedNode(node);
    },
    []
  );

  // Handle clicking on empty space to deselect
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Handle drag over for drop functionality
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop to create new nodes
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData('application/reactflow');
      
      if (typeof nodeType === 'undefined' || !nodeType || !reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `node_${Date.now()}`,
        type: nodeType,
        position,
        data: { text: 'text message' },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  // Update selected node text
  const updateNodeText = useCallback(
    (nodeId: string, newText: string) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, text: newText } } : node
        )
      );
      
      if (selectedNode && selectedNode.id === nodeId) {
        setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, text: newText } });
      }
    },
    [selectedNode, setNodes]
  );

  // Save flow with validation
  const handleSave = useCallback(() => {
    setShowError(false);
    setShowSuccess(false);
    
    if (nodes.length <= 1) {
      // If there's only one node or no nodes, save is allowed
      console.log('Saving flow with single node to localStorage...');
      const flowData = {
        nodes,
        edges,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem('chatbot-flow', JSON.stringify(flowData));
      console.log('Flow saved to localStorage:', flowData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      return;
    }

    // Check if there are nodes with empty target handles (no incoming connections)
    const nodesWithoutIncomingConnections = nodes.filter(node => {
      return !edges.some(edge => edge.target === node.id);
    });

    if (nodesWithoutIncomingConnections.length > 1) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    // Save to localStorage on successful validation
    console.log('Saving validated flow to localStorage...');
    const flowData = {
      nodes,
      edges,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem('chatbot-flow', JSON.stringify(flowData));
    console.log('Flow saved to localStorage:', flowData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  }, [nodes, edges]);

  return (
    <div className="w-full h-screen flex bg-gray-100">
      {/* Error Notification */}
      {showError && <ErrorNotification />}
      
      {/* Main Flow Area */}
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          connectionLineType="smoothstep"
          snapToGrid={true}
          snapGrid={[15, 15]}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          attributionPosition="bottom-left"
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>

      {/* Save Button */}
      <SaveButton onSave={handleSave} showSuccess={showSuccess} />

      {/* Right Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        {selectedNode ? (
          <SettingsPanel
            selectedNode={selectedNode}
            onUpdateNode={updateNodeText}
            onBack={() => setSelectedNode(null)}
          />
        ) : (
          <NodesPanel />
        )}
      </div>
    </div>
  );
};

const WrappedChatbotFlowBuilder: React.FC = () => (
  <ReactFlowProvider>
    <ChatbotFlowBuilder />
  </ReactFlowProvider>
);

export default WrappedChatbotFlowBuilder;