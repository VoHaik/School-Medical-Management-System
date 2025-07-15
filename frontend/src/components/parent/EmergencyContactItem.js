import React from 'react';

const EmergencyContactItem = React.memo(({ contact, index, onChange, onRemove }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
      <input
        type="text"
        name="name"
        value={contact.name}
        onChange={(e) => onChange(index, e)}
        className="p-2 border border-gray-300 rounded-md"
        placeholder="Name"
      />
      <input
        type="text"
        name="relationship"
        value={contact.relationship}
        onChange={(e) => onChange(index, e)}
        className="p-2 border border-gray-300 rounded-md"
        placeholder="Relationship"
      />
      <div className="flex items-center space-x-2">
        <input
          type="tel"
          name="phone"
          value={contact.phone}
          onChange={(e) => onChange(index, e)}
          className="flex-1 p-2 border border-gray-300 rounded-md"
          placeholder="Phone"
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

export default EmergencyContactItem;
