import React, { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { ArrowLeft } from 'lucide-react';

interface SettingsPanelProps {
  selectedNode: Node;
  onUpdateNode: (nodeId: string, newText: string) => void;
  onBack: () => void;
}

// Settings Panel component for editing selected nodes
const SettingsPanel: React.FC<SettingsPanelProps> = ({
  selectedNode,
  onUpdateNode,
  onBack,
}) => {
  const [text, setText] = useState(selectedNode.data.text || '');

  // Update local state when selected node changes
  useEffect(() => {
    setText(selectedNode.data.text || '');
  }, [selectedNode]);

  // Handle text input changes
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    setText(newText);
    onUpdateNode(selectedNode.id, newText);
  };

  return (
    <div className="p-6">
      {/* Header with back button */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          aria-label="Go back to nodes panel"
        >
          <ArrowLeft size={16} className="text-gray-600" />
        </button>
        <h3 className="text-lg font-medium text-gray-800">Message</h3>
      </div>

      {/* Settings Form */}
      <div className="space-y-4">
        <div>
          <label htmlFor="node-text" className="block text-sm font-medium text-gray-700 mb-2">
            Text
          </label>
          <textarea
            id="node-text"
            value={text}
            onChange={handleTextChange}
            placeholder="Enter your message..."
            className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            autoFocus
          />
        </div>
        
        {/* Additional settings can be added here as the application grows */}
        {/* 
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message Type
          </label>
          <select className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Text</option>
            <option>Image</option>
            <option>Button</option>
          </select>
        </div>
        */}
      </div>

      {/* Help text */}
      <div className="mt-6 text-xs text-gray-500">
        Edit the message content for the selected node. Changes are saved automatically.
      </div>
    </div>
  );
};

export default SettingsPanel;