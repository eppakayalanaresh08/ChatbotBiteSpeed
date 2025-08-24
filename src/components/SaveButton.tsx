import React from 'react';

interface SaveButtonProps {
  onSave: () => void;
  showSuccess?: boolean;
}

// Save Button component positioned in the top right corner
const SaveButton: React.FC<SaveButtonProps> = ({ onSave, showSuccess = false }) => {
  return (
    <div className="absolute top-4 right-4 z-10">
      <button
        onClick={onSave}
        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl ${
          showSuccess 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {showSuccess ? 'Saved Successfully!' : 'Save Changes'}
      </button>
    </div>
  );
};

export default SaveButton;