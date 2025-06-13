import React from 'react';

const MedicationItem = React.memo(({ medication, index, onChange, onRemove }) => {
  console.log(`Rendering MedicationItem: ${index}`);
  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={medication}
        onChange={(e) => onChange(index, e.target.value)}
        className="flex-1 p-2 border border-gray-300 rounded-md"
        placeholder="Enter medication"
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

export default MedicationItem;
