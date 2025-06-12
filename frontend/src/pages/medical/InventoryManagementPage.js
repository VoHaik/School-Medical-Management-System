import React, { useState } from 'react';

// Placeholder for a potential InventoryTable component
const InventoryTable = ({ items, onEdit, onDelete }) => (
  <table className="min-w-full bg-white shadow rounded">
    <thead className="bg-gray-50">
      <tr>
        <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
        <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
        <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
        <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
        <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
        <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
        <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Low Stock</th>
        <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200">
      {items && items.length > 0 ? items.map(item => (
        <tr key={item.id} className="hover:bg-gray-50">
          <td className="py-3 px-4 border-b whitespace-nowrap">{item.name}</td>
          <td className="py-3 px-4 border-b whitespace-nowrap">{item.type}</td>
          <td className="py-3 px-4 border-b whitespace-nowrap">{item.category}</td>
          <td className="py-3 px-4 border-b whitespace-nowrap">{item.quantity}</td>
          <td className="py-3 px-4 border-b whitespace-nowrap">{item.unit}</td>
          <td className="py-3 px-4 border-b whitespace-nowrap">{item.expiryDate || 'N/A'}</td>
          <td className="py-3 px-4 border-b whitespace-nowrap">{item.quantity <= item.lowStockThreshold ? <span className="text-red-500 font-semibold">Yes</span> : 'No'}</td>
          <td className="py-3 px-4 border-b whitespace-nowrap">
            <button onClick={() => onEdit(item)} className="text-indigo-600 hover:text-indigo-900 mr-2">Edit</button>
            <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-900">Delete</button>
          </td>
        </tr>
      )) : (
        <tr><td colSpan="8" className="text-center py-4">No items in inventory.</td></tr>
      )}
    </tbody>
  </table>
);

// Placeholder for a potential InventoryItemForm component
const InventoryItemForm = ({ onSubmit, onCancel, itemToEdit }) => {
  // Basic state for the form, would be more complex with validation and initial values for editing
  const [itemName, setItemName] = useState(itemToEdit ? itemToEdit.name : '');
  const [itemType, setItemType] = useState(itemToEdit ? itemToEdit.type : 'Medication');
  const [category, setCategory] = useState(itemToEdit ? itemToEdit.category : '');
  const [unit, setUnit] = useState(itemToEdit ? itemToEdit.unit : '');
  const [quantity, setQuantity] = useState(itemToEdit ? itemToEdit.quantity : '');
  const [purchaseDate, setPurchaseDate] = useState(itemToEdit ? itemToEdit.purchaseDate : '');
  const [expiryDate, setExpiryDate] = useState(itemToEdit ? itemToEdit.expiryDate : '');
  const [supplier, setSupplier] = useState(itemToEdit ? itemToEdit.supplier : '');
  const [costPerUnit, setCostPerUnit] = useState(itemToEdit ? itemToEdit.costPerUnit : '');
  const [lowStockThreshold, setLowStockThreshold] = useState(itemToEdit ? itemToEdit.lowStockThreshold : '');
  const [notes, setNotes] = useState(itemToEdit ? itemToEdit.notes : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      itemName, itemType, category, unit, quantity,
      purchaseDate, expiryDate, supplier, costPerUnit,
      lowStockThreshold, notes
    };
    // If itemToEdit exists, add its id to the form data
    if (itemToEdit) {
      formData.id = itemToEdit.id;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded mb-4">
      <h3 className="text-lg font-semibold mb-4">{itemToEdit ? 'Edit Item' : 'Add New Item'}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700">Item Name</label>
          <input type="text" value={itemName} onChange={e => setItemName(e.target.value)} className="w-full p-2 border rounded" required />
        </div>
        <div>
          <label className="block text-gray-700">Type</label>
          <select value={itemType} onChange={e => setItemType(e.target.value)} className="w-full p-2 border rounded">
            <option value="Medication">Medication</option>
            <option value="Supply">Supply</option>
            <option value="Equipment">Equipment</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Category</label>
          <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g., Pain Relief, First Aid" className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-gray-700">Unit</label>
          <input type="text" value={unit} onChange={e => setUnit(e.target.value)} placeholder="e.g., pills, bottles, units" className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-gray-700">Quantity</label>
          <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full p-2 border rounded" required min="0" />
        </div>
        <div>
          <label className="block text-gray-700">Purchase Date</label>
          <input type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-gray-700">Expiry Date</label>
          <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-gray-700">Supplier</label>
          <input type="text" value={supplier} onChange={e => setSupplier(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-gray-700">Cost per Unit (&curren;)</label>
          <input type="number" value={costPerUnit} onChange={e => setCostPerUnit(e.target.value)} className="w-full p-2 border rounded" min="0" step="0.01" />
        </div>
        <div>
          <label className="block text-gray-700">Low Stock Threshold</label>
          <input type="number" value={lowStockThreshold} onChange={e => setLowStockThreshold(e.target.value)} className="w-full p-2 border rounded" min="0" />
        </div>
      </div>
      
      <div className="mt-4">
        <label className="block text-gray-700">Notes</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-2 border rounded" rows="3"></textarea>
      </div>
      
      <div className="flex justify-end mt-6">
        <button type="button" onClick={onCancel} className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded mr-2">Cancel</button>
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Save Item</button>
      </div>
    </form>
  );
};


const InventoryManagementPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  // Placeholder for inventory items - added more fields
  const [inventoryItems, setInventoryItems] = useState([
    { id: 1, name: 'Band-Aids (Box of 100)', type: 'Supply', category: 'First Aid', unit: 'box', quantity: 100, purchaseDate: '2025-01-15', expiryDate: '2026-12-31', supplier: 'MediSupplies Inc.', costPerUnit: 5.00, lowStockThreshold: 20, notes: 'Standard size assorted plasters.' },
    { id: 2, name: 'Ibuprofen 200mg (Bottle of 50)', type: 'Medication', category: 'Pain Relief', unit: 'bottle', quantity: 50, purchaseDate: '2025-03-01', expiryDate: '2025-06-30', supplier: 'PharmaChoice', costPerUnit: 8.50, lowStockThreshold: 10, notes: 'For mild to moderate pain.' },
    { id: 3, name: 'Digital Thermometer', type: 'Equipment', category: 'Diagnostics', unit: 'unit', quantity: 5, purchaseDate: '2024-11-10', expiryDate: '', supplier: 'HealthTech Solutions', costPerUnit: 15.00, lowStockThreshold: 2, notes: 'Requires AA batteries.' },
  ]);

  const handleAddNewItem = () => {
    setEditingItem(null); // Ensure not in edit mode
    setShowForm(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };
  
  const handleDeleteItem = (itemId) => {
    // Later, this will involve an API call
    setInventoryItems(prevItems => prevItems.filter(item => item.id !== itemId));
    console.log('Deleted item with id:', itemId);
  };

  const handleFormSubmit = (formData) => {
    if (editingItem) {
      // Logic to update existing item
      setInventoryItems(prevItems => prevItems.map(item => item.id === editingItem.id ? { ...item, ...formData } : item));
      console.log('Updated item:', { ...editingItem, ...formData });
    } else {
      // Logic to add new item (assign a temporary new ID for now)
      const newItem = { ...formData, id: Date.now() }; // Replace with actual ID from backend
      setInventoryItems(prevItems => [...prevItems, newItem]);
      console.log('New item added:', newItem);
    }
    setShowForm(false);
    setEditingItem(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };
  
  // Filter and search logic
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || item.type === filterType;
    
    let matchesStatus = true;
    if (filterStatus === 'Low Stock') {
      matchesStatus = item.quantity <= item.lowStockThreshold;
    } else if (filterStatus === 'Expired') {
      const today = new Date();
      const expiryDate = new Date(item.expiryDate);
      matchesStatus = item.expiryDate && expiryDate < today;
    } else if (filterStatus === 'Expiring Soon') {
      const today = new Date();
      const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
      const expiryDate = new Date(item.expiryDate);
      matchesStatus = item.expiryDate && expiryDate <= thirtyDaysFromNow && expiryDate >= today;
    }
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Get counts for status badges
  const lowStockCount = inventoryItems.filter(item => item.quantity <= item.lowStockThreshold).length;
  const expiredCount = inventoryItems.filter(item => {
    const today = new Date();
    const expiryDate = new Date(item.expiryDate);
    return item.expiryDate && expiryDate < today;
  }).length;
  const expiringSoonCount = inventoryItems.filter(item => {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    const expiryDate = new Date(item.expiryDate);
    return item.expiryDate && expiryDate <= thirtyDaysFromNow && expiryDate >= today;
  }).length;

  // Get unique categories for filter dropdown
  const getUniqueCategories = () => {
    const categories = [...new Set(inventoryItems.map(item => item.category))];
    return categories.filter(cat => cat && cat.trim() !== '');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Medication and Supplies Inventory</h1>
        <button onClick={handleAddNewItem} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded flex items-center">
          <span className="mr-2">+</span> Add New Item
        </button>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <div className="flex items-center">
            <span className="text-red-600 font-semibold">Low Stock Alerts</span>
            <span className="ml-2 bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">{lowStockCount}</span>
          </div>
        </div>
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded">
          <div className="flex items-center">
            <span className="text-orange-600 font-semibold">Expiring Soon</span>
            <span className="ml-2 bg-orange-100 text-orange-800 text-sm font-medium px-2.5 py-0.5 rounded">{expiringSoonCount}</span>
          </div>
        </div>
        <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded">
          <div className="flex items-center">
            <span className="text-gray-600 font-semibold">Expired Items</span>
            <span className="ml-2 bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded">{expiredCount}</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 bg-white p-4 shadow rounded">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <input 
              type="text" 
              placeholder="Search items by name or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          <div>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Types</option>
              <option value="Medication">Medication</option>
              <option value="Supply">Supply</option>
              <option value="Equipment">Equipment</option>
            </select>
          </div>
          <div>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Expiring Soon">Expiring Soon</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>
      </div>
      
      {showForm && <InventoryItemForm onSubmit={handleFormSubmit} onCancel={handleFormCancel} itemToEdit={editingItem} />}

      {/* Results Summary */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredItems.length} of {inventoryItems.length} items
          {searchTerm && <span> for "{searchTerm}"</span>}
          {filterType !== 'All' && <span> | Type: {filterType}</span>}
          {filterStatus !== 'All' && <span> | Status: {filterStatus}</span>}
        </p>
      </div>

      <InventoryTable items={filteredItems} onEdit={handleEditItem} onDelete={handleDeleteItem} />
    </div>
  );
};

export default InventoryManagementPage;
