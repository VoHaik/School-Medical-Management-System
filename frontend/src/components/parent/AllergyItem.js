import React from 'react';

const AllergyItem = React.memo(({ allergy, index, onChange, onRemove }) => {
  // // Uncomment for debugging memoization

  const handleInputChange = (e) => {
    onChange(index, e.target.value);
  };

  const handleRemoveClick = () => {
    onRemove(index);
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={allergy}
        onChange={handleInputChange}
        className="flex-1 p-2 border border-gray-300 rounded-md"
        placeholder="Enter allergy"
      />
      <button
        type="button"
        onClick={handleRemoveClick}
        className="p-2 text-red-600 hover:text-red-800"
      >
        <i className="fas fa-trash"></i>
      </button>
    </div>
  );
});

export default AllergyItem;
