import React from 'react';
import { MessageCircle } from 'lucide-react';

// Nodes Panel component for drag and drop functionality
const NodesPanel: React.FC = () => {
  // Handle drag start for node creation
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-800 mb-6">Nodes Panel</h3>
      
      {/* Draggable Node Items */}
      <div className="space-y-4">
        {/* Text/Message Node */}
        <div
          className="border-2 border-blue-500 rounded-lg p-4 cursor-grab active:cursor-grabbing hover:bg-blue-50 transition-colors"
          draggable
          onDragStart={(event) => onDragStart(event, 'textNode')}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageCircle size={20} className="text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-600">Message</span>
          </div>
        </div>
        
        {/* Placeholder for future node types - keeping the architecture extensible */}
        {/* 
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 opacity-50">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Plus size={20} className="text-gray-400" />
            </div>
            <span className="text-sm text-gray-400">More nodes coming soon...</span>
          </div>
        </div>
        */}
      </div>
      
      <div className="mt-8 text-xs text-gray-500">
        Drag and drop nodes to create your chatbot flow
      </div>
    </div>
  );
};

export default NodesPanel;