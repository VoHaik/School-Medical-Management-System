import React from 'react';

const ChronicIllnessItem = React.memo(({ illness, index, onChange, onRemove }) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={illness}
        onChange={(e) => onChange(index, e.target.value)}
        className="flex-1 p-2 border border-gray-300 rounded-md"
        placeholder="Enter chronic illness"
      />
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="p-2 text-red-600 hover:text-red-800"
      >
        <i className="fas fa-trash"></i>
      </button>
    </div>
  );
});

export default ChronicIllnessItem;
