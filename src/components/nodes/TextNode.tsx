import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { MessageCircle } from 'lucide-react';

interface TextNodeData {
  text: string;
}

// Custom Text Node component that matches the design from the images
const TextNode: React.FC<NodeProps<TextNodeData>> = ({ data, selected }) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg border-2 min-w-[200px] ${
      selected ? 'border-blue-500' : 'border-gray-200'
    }`}>
      {/* Node Header */}
      <div className="bg-teal-200 px-3 py-2 rounded-t-lg border-b border-teal-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle size={14} className="text-teal-600" />
          <span className="text-sm font-medium text-teal-700">Send Message</span>
        </div>
        <div className="w-3 h-3 bg-teal-600 rounded-full"></div>
      </div>
      
      {/* Node Content */}
      <div className="p-3 bg-white rounded-b-lg">
        <div className="text-sm text-gray-700 break-words">
          {data.text || 'Enter your message...'}
        </div>
      </div>

      {/* Connection Handles */}
      {/* Target Handle - Left side (can have multiple incoming connections) */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-teal-400 !border-2 !border-white"
        style={{ left: -6 }}
      />
      
      {/* Source Handle - Right side (can have only one outgoing connection) */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-teal-400 !border-2 !border-white"
        style={{ right: -6 }}
      />
    </div>
  );
};

// Memoize the component for performance
export default memo(TextNode);