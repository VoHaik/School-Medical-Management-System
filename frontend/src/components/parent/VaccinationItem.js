import React from 'react';

const VaccinationItem = React.memo(({ vaccination, index, onChange, onRemove }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
      <input
        type="text"
        name="vaccineName"
        value={vaccination.vaccineName}
        onChange={(e) => onChange(index, e)}
        className="p-2 border border-gray-300 rounded-md"
        placeholder="Vaccine Name"
      />
      <input
        type="date"
        name="vaccinationDate"
        value={vaccination.vaccinationDate}
        onChange={(e) => onChange(index, e)}
        className="p-2 border border-gray-300 rounded-md"
      />
      <div className="flex items-center space-x-2">
        <input
          type="text"
          name="notes"
          value={vaccination.notes}
          onChange={(e) => onChange(index, e)}
          className="flex-1 p-2 border border-gray-300 rounded-md"
          placeholder="Notes (optional)"
        />
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-2 text-red-600 hover:text-red-800"
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  );
});

export default VaccinationItem;
