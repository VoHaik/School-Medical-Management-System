import React from 'react';

const MedicationItem = React.memo(({ medication, index, onChange, onRemove }) => {
  // console.log(`Rendering MedicationItem: ${index}`, medication);

  const handleChange = (e) => {
    // Pass the entire event to the parent onChange handler
    // The parent handler (handleNestedObjectArrayItemChange) expects the event
    // and will use e.target.name and e.target.value
    onChange(index, e); 
  };

  return (
    <div className="p-3 border border-gray-200 rounded-md space-y-3 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          type="text"
          name="name" // Field name for the parent handler
          value={medication.name || ''}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Medication Name (e.g., Paracetamol)"
        />
        <input
          type="text"
          name="dosage" // Field name for the parent handler
          value={medication.dosage || ''}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Dosage (e.g., 500mg)"
        />
      </div>
      <input
        type="text"
        name="frequency" // Field name for the parent handler
        value={medication.frequency || ''}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md"
        placeholder="Frequency (e.g., Twice a day)"
      />
      <textarea
        name="instructions" // Field name for the parent handler
        value={medication.instructions || ''}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md"
        placeholder="Instructions (e.g., Take with food)"
        rows="2"
      />
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="px-3 py-1 text-sm text-red-600 hover:text-red-800 font-medium"
      >
        <i className="fas fa-trash mr-1"></i> Remove Medication
      </button>
    </div>
  );
});

export default MedicationItem;
