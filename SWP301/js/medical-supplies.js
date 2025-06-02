// Medical Supplies Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeMedicalSupplies();
    loadSuppliesData();
    setupEventListeners();
});

let suppliesData = [];
let filteredData = [];

function initializeMedicalSupplies() {
    setupFilters();
    setupSorting();
    setupPagination();
}

function setupEventListeners() {
    // Add new supply button
    const addSupplyBtn = document.getElementById('add-supply-btn');
    if (addSupplyBtn) {
        addSupplyBtn.addEventListener('click', showAddSupplyModal);
    }

    // Search functionality
    const searchInput = document.getElementById('search-supplies');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterSupplies();
        });
    }

    // Category filter
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            filterSupplies();
        });
    }

    // Status filter
    const statusFilter = document.getElementById('status-filter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            filterSupplies();
        });
    }

    // Export button
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportSuppliesData);
    }

    // Bulk actions
    const selectAllCheckbox = document.getElementById('select-all');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            toggleSelectAll(this.checked);
        });
    }

    const bulkActionBtn = document.getElementById('bulk-action-btn');
    if (bulkActionBtn) {
        bulkActionBtn.addEventListener('click', showBulkActionMenu);
    }
}

function loadSuppliesData() {
    // Sample data - in real app, this would come from API
    suppliesData = [
        {
            id: 1,
            name: 'Paracetamol 500mg',
            category: 'medications',
            brand: 'Generic',
            currentStock: 25,
            minStock: 50,
            maxStock: 200,
            unit: 'tablets',
            expiryDate: '2025-12-15',
            location: 'Cabinet A1',
            supplier: 'MedSupply Co.',
            cost: 0.15,
            lastUpdated: '2025-05-29'
        },
        {
            id: 2,
            name: 'Bandages (Sterile)',
            category: 'first-aid',
            brand: 'Johnson & Johnson',
            currentStock: 75,
            minStock: 30,
            maxStock: 150,
            unit: 'pieces',
            expiryDate: '2026-08-30',
            location: 'Shelf B2',
            supplier: 'Healthcare Plus',
            cost: 2.50,
            lastUpdated: '2025-05-28'
        },
        {
            id: 3,
            name: 'Digital Thermometer',
            category: 'equipment',
            brand: 'TempSafe',
            currentStock: 5,
            minStock: 3,
            maxStock: 10,
            unit: 'pieces',
            expiryDate: null,
            location: 'Equipment Room',
            supplier: 'MedTech Solutions',
            cost: 25.00,
            lastUpdated: '2025-05-27'
        },
        {
            id: 4,
            name: 'Disposable Gloves',
            category: 'consumables',
            brand: 'SafeHands',
            currentStock: 200,
            minStock: 100,
            maxStock: 500,
            unit: 'pieces',
            expiryDate: '2026-03-20',
            location: 'Storage Room',
            supplier: 'Medical Supplies Ltd',
            cost: 0.25,
            lastUpdated: '2025-05-29'
        },
        {
            id: 5,
            name: 'Insulin Pen',
            category: 'medications',
            brand: 'DiaCare',
            currentStock: 8,
            minStock: 15,
            maxStock: 30,
            unit: 'pieces',
            expiryDate: '2025-09-10',
            location: 'Refrigerator',
            supplier: 'Diabetes Care Co.',
            cost: 45.00,
            lastUpdated: '2025-05-26'
        }
    ];

    filteredData = [...suppliesData];
    updateSuppliesTable();
    updateDashboardStats();
}

function updateSuppliesTable() {
    const tbody = document.querySelector('#supplies-table tbody');
    if (!tbody) return;

    tbody.innerHTML = filteredData.map(supply => {
        const stockStatus = getStockStatus(supply);
        const expiryStatus = getExpiryStatus(supply);
        
        return `
            <tr data-supply-id="${supply.id}">
                <td>
                    <input type="checkbox" class="supply-checkbox" value="${supply.id}">
                </td>
                <td>
                    <div class="supply-info">
                        <strong>${supply.name}</strong>
                        <small>${supply.brand}</small>
                    </div>
                </td>
                <td>
                    <span class="category-badge category-${supply.category}">
                        ${getCategoryName(supply.category)}
                    </span>
                </td>
                <td>
                    <div class="stock-info">
                        <span class="stock-amount ${stockStatus.class}">${supply.currentStock} ${supply.unit}</span>
                        <div class="stock-bar">
                            <div class="stock-fill ${stockStatus.class}" 
                                 style="width: ${(supply.currentStock / supply.maxStock) * 100}%"></div>
                        </div>
                        <small>Min: ${supply.minStock} | Max: ${supply.maxStock}</small>
                    </div>
                </td>
                <td>
                    ${supply.expiryDate ? 
                        `<span class="expiry-date ${expiryStatus.class}">${formatDate(supply.expiryDate)}</span>` : 
                        '<span class="no-expiry">N/A</span>'
                    }
                </td>
                <td>${supply.location}</td>
                <td>$${supply.cost.toFixed(2)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-sm btn-edit" onclick="editSupply(${supply.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-sm btn-restock" onclick="showRestockModal(${supply.id})">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="btn-sm btn-delete" onclick="deleteSupply(${supply.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    // Update checkbox event listeners
    document.querySelectorAll('.supply-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', updateBulkActionButton);
    });
}

function getStockStatus(supply) {
    if (supply.currentStock <= supply.minStock) {
        return { class: 'stock-low', status: 'Low Stock' };
    } else if (supply.currentStock >= supply.maxStock * 0.8) {
        return { class: 'stock-good', status: 'Good Stock' };
    } else {
        return { class: 'stock-medium', status: 'Medium Stock' };
    }
}

function getExpiryStatus(supply) {
    if (!supply.expiryDate) return { class: '', status: 'No Expiry' };
    
    const today = new Date();
    const expiryDate = new Date(supply.expiryDate);
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
        return { class: 'expired', status: 'Expired' };
    } else if (daysUntilExpiry <= 30) {
        return { class: 'expiring-soon', status: 'Expiring Soon' };
    } else if (daysUntilExpiry <= 90) {
        return { class: 'expiring-warning', status: 'Expiring Warning' };
    } else {
        return { class: 'expiry-good', status: 'Good' };
    }
}

function getCategoryName(category) {
    const categories = {
        'medications': 'Medications',
        'first-aid': 'First Aid',
        'equipment': 'Equipment',
        'consumables': 'Consumables'
    };
    return categories[category] || category;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function filterSupplies() {
    const searchTerm = document.getElementById('search-supplies')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('category-filter')?.value || '';
    const statusFilter = document.getElementById('status-filter')?.value || '';

    filteredData = suppliesData.filter(supply => {
        const matchesSearch = supply.name.toLowerCase().includes(searchTerm) ||
                            supply.brand.toLowerCase().includes(searchTerm) ||
                            supply.supplier.toLowerCase().includes(searchTerm);
        
        const matchesCategory = !categoryFilter || supply.category === categoryFilter;
        
        let matchesStatus = true;
        if (statusFilter) {
            const stockStatus = getStockStatus(supply);
            const expiryStatus = getExpiryStatus(supply);
            
            switch (statusFilter) {
                case 'low-stock':
                    matchesStatus = stockStatus.class === 'stock-low';
                    break;
                case 'expiring':
                    matchesStatus = expiryStatus.class === 'expiring-soon' || expiryStatus.class === 'expired';
                    break;
                case 'out-of-stock':
                    matchesStatus = supply.currentStock === 0;
                    break;
            }
        }
        
        return matchesSearch && matchesCategory && matchesStatus;
    });

    updateSuppliesTable();
    updateResultsCount();
}

function updateResultsCount() {
    const resultCount = document.getElementById('results-count');
    if (resultCount) {
        resultCount.textContent = `Showing ${filteredData.length} of ${suppliesData.length} supplies`;
    }
}

function updateDashboardStats() {
    const totalSupplies = suppliesData.length;
    const lowStockItems = suppliesData.filter(supply => supply.currentStock <= supply.minStock).length;
    const expiringItems = suppliesData.filter(supply => {
        if (!supply.expiryDate) return false;
        const daysUntilExpiry = Math.ceil((new Date(supply.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 30;
    }).length;
    const totalValue = suppliesData.reduce((sum, supply) => sum + (supply.currentStock * supply.cost), 0);

    // Update stat cards
    updateStatCard('total-supplies', totalSupplies);
    updateStatCard('low-stock-count', lowStockItems);
    updateStatCard('expiring-count', expiringItems);
    updateStatCard('total-value', `$${totalValue.toFixed(2)}`);
}

function updateStatCard(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function showAddSupplyModal() {
    // In a real application, this would show a modal dialog
    const newSupply = {
        name: prompt('Enter supply name:'),
        category: prompt('Enter category (medications/first-aid/equipment/consumables):'),
        brand: prompt('Enter brand:'),
        currentStock: parseInt(prompt('Enter current stock:')),
        minStock: parseInt(prompt('Enter minimum stock:')),
        maxStock: parseInt(prompt('Enter maximum stock:')),
        unit: prompt('Enter unit:'),
        expiryDate: prompt('Enter expiry date (YYYY-MM-DD) or leave empty:'),
        location: prompt('Enter location:'),
        supplier: prompt('Enter supplier:'),
        cost: parseFloat(prompt('Enter cost per unit:'))
    };

    if (newSupply.name && newSupply.category) {
        newSupply.id = suppliesData.length + 1;
        newSupply.lastUpdated = new Date().toISOString().split('T')[0];
        suppliesData.push(newSupply);
        filterSupplies();
        updateDashboardStats();
        showNotification('Supply added successfully!', 'success');
    }
}

function editSupply(supplyId) {
    const supply = suppliesData.find(s => s.id === supplyId);
    if (!supply) return;

    // In a real application, this would show a modal dialog
    alert(`Edit supply: ${supply.name}\nThis would open an edit modal in a real application.`);
}

function showRestockModal(supplyId) {
    const supply = suppliesData.find(s => s.id === supplyId);
    if (!supply) return;

    const restockAmount = parseInt(prompt(`Restock ${supply.name}\nCurrent stock: ${supply.currentStock} ${supply.unit}\nEnter amount to add:`));
    
    if (restockAmount && restockAmount > 0) {
        supply.currentStock += restockAmount;
        supply.lastUpdated = new Date().toISOString().split('T')[0];
        updateSuppliesTable();
        updateDashboardStats();
        showNotification(`Added ${restockAmount} ${supply.unit} to ${supply.name}`, 'success');
    }
}

function deleteSupply(supplyId) {
    const supply = suppliesData.find(s => s.id === supplyId);
    if (!supply) return;

    if (confirm(`Are you sure you want to delete ${supply.name}?`)) {
        suppliesData = suppliesData.filter(s => s.id !== supplyId);
        filterSupplies();
        updateDashboardStats();
        showNotification('Supply deleted successfully!', 'success');
    }
}

function toggleSelectAll(checked) {
    document.querySelectorAll('.supply-checkbox').forEach(checkbox => {
        checkbox.checked = checked;
    });
    updateBulkActionButton();
}

function updateBulkActionButton() {
    const checkedBoxes = document.querySelectorAll('.supply-checkbox:checked');
    const bulkActionBtn = document.getElementById('bulk-action-btn');
    
    if (bulkActionBtn) {
        if (checkedBoxes.length > 0) {
            bulkActionBtn.style.display = 'block';
            bulkActionBtn.textContent = `Actions (${checkedBoxes.length} selected)`;
        } else {
            bulkActionBtn.style.display = 'none';
        }
    }
}

function showBulkActionMenu() {
    const checkedBoxes = document.querySelectorAll('.supply-checkbox:checked');
    const selectedIds = Array.from(checkedBoxes).map(cb => parseInt(cb.value));
    
    const action = prompt('Select action:\n1. Delete selected\n2. Update location\n3. Update supplier\nEnter 1, 2, or 3:');
    
    switch (action) {
        case '1':
            if (confirm(`Delete ${selectedIds.length} selected supplies?`)) {
                suppliesData = suppliesData.filter(s => !selectedIds.includes(s.id));
                filterSupplies();
                updateDashboardStats();
                showNotification(`${selectedIds.length} supplies deleted`, 'success');
            }
            break;
        case '2':
            const newLocation = prompt('Enter new location:');
            if (newLocation) {
                selectedIds.forEach(id => {
                    const supply = suppliesData.find(s => s.id === id);
                    if (supply) supply.location = newLocation;
                });
                updateSuppliesTable();
                showNotification(`Location updated for ${selectedIds.length} supplies`, 'success');
            }
            break;
        case '3':
            const newSupplier = prompt('Enter new supplier:');
            if (newSupplier) {
                selectedIds.forEach(id => {
                    const supply = suppliesData.find(s => s.id === id);
                    if (supply) supply.supplier = newSupplier;
                });
                updateSuppliesTable();
                showNotification(`Supplier updated for ${selectedIds.length} supplies`, 'success');
            }
            break;
    }
    
    // Clear selections
    document.getElementById('select-all').checked = false;
    toggleSelectAll(false);
}

function exportSuppliesData() {
    const csvContent = generateCSV(filteredData);
    downloadCSV(csvContent, 'medical-supplies-export.csv');
    showNotification('Data exported successfully!', 'success');
}

function generateCSV(data) {
    const headers = ['Name', 'Category', 'Brand', 'Current Stock', 'Min Stock', 'Max Stock', 'Unit', 'Expiry Date', 'Location', 'Supplier', 'Cost', 'Last Updated'];
    
    const csvRows = [
        headers.join(','),
        ...data.map(supply => [
            supply.name,
            getCategoryName(supply.category),
            supply.brand,
            supply.currentStock,
            supply.minStock,
            supply.maxStock,
            supply.unit,
            supply.expiryDate || 'N/A',
            supply.location,
            supply.supplier,
            supply.cost,
            supply.lastUpdated
        ].join(','))
    ];
    
    return csvRows.join('\n');
}

function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
        ${message}
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#007bff'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 4px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Setup sorting functionality
function setupSorting() {
    document.querySelectorAll('[data-sort]').forEach(header => {
        header.addEventListener('click', function() {
            const sortField = this.getAttribute('data-sort');
            sortSupplies(sortField);
        });
    });
}

function sortSupplies(field) {
    const sortDirection = getCurrentSortDirection(field);
    
    filteredData.sort((a, b) => {
        let aVal = a[field];
        let bVal = b[field];
        
        // Handle different data types
        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }
        
        if (sortDirection === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });
    
    updateSuppliesTable();
    updateSortIndicators(field, sortDirection);
}

function getCurrentSortDirection(field) {
    const header = document.querySelector(`[data-sort="${field}"]`);
    const currentDirection = header.getAttribute('data-direction') || 'asc';
    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
    header.setAttribute('data-direction', newDirection);
    return newDirection;
}

function updateSortIndicators(activeField, direction) {
    // Clear all sort indicators
    document.querySelectorAll('[data-sort]').forEach(header => {
        header.classList.remove('sort-asc', 'sort-desc');
    });
    
    // Add indicator to active field
    const activeHeader = document.querySelector(`[data-sort="${activeField}"]`);
    if (activeHeader) {
        activeHeader.classList.add(`sort-${direction}`);
    }
}

function setupPagination() {
    // Pagination would be implemented here for large datasets
    // For now, we're showing all results
}

// Export functions for external use
window.MedicalSupplies = {
    loadSuppliesData,
    filterSupplies,
    showAddSupplyModal,
    editSupply,
    deleteSupply,
    exportSuppliesData
};
