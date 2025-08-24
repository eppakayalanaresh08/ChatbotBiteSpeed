import React from 'react';

// Error Notification component that appears when save validation fails
const ErrorNotification: React.FC = () => {
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
      <div className="bg-red-100 border border-red-300 text-red-700 px-6 py-3 rounded-lg shadow-lg">
        <span className="font-medium">Cannot save Flow</span>
      </div>
    </div>
  );
};

export default ErrorNotification;