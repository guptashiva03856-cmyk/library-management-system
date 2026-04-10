// API Base URL
const API_BASE_URL = 'http://localhost:5000';

// API Endpoints
const API_ENDPOINTS = {
    books: `${API_BASE_URL}/books`,
    authors: `${API_BASE_URL}/authors`,
    members: `${API_BASE_URL}/members`
};

// DOM Elements
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const formFields = document.getElementById('form-fields');
const dataForm = document.getElementById('data-form');
const itemIdInput = document.getElementById('item-id');

// Current context (book, author, or member)
let currentContext = '';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadAllData();
    setupEventListeners();
});

// Load all data from the API
async function loadAllData() {
    try {
        await Promise.all([
            fetchData('books', 'books-list', renderBooks),
            fetchData('authors', 'authors-list', renderAuthors),
            fetchData('members', 'members-list', renderMembers)
        ]);
    } catch (error) {
        console.error('Error loading data:', error);
        showNotification('Error loading data. Please check the console for details.', 'error');
    }
}

// Generic function to fetch data from an endpoint
async function fetchData(endpoint, containerId, renderFunction) {
    try {
        const response = await fetch(`${API_ENDPOINTS[endpoint]}/`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const container = document.getElementById(containerId);
        container.innerHTML = ''; // Clear existing content
        
        if (data && data.length > 0) {
            data.forEach(item => {
                container.appendChild(renderFunction(item));
            });
        } else {
            container.innerHTML = '<p class="text-gray-500">No items found</p>';
        }
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        document.getElementById(containerId).innerHTML = 
            '<p class="text-red-500">Error loading data. Check console for details.</p>';
    }
}

// Render a book item
function renderBooks(book) {
    const item = document.createElement('div');
    item.className = 'border p-3 rounded hover:bg-gray-50';
    item.innerHTML = `
        <div class="flex justify-between items-start">
            <div>
                <h4 class="font-medium">${book.title || 'No Title'}</h4>
                <p class="text-sm text-gray-600">By: ${book.author || 'Unknown'}</p>
                <p class="text-xs text-gray-500">ISBN: ${book.isbn || 'N/A'}</p>
            </div>
            <div class="flex space-x-1">
                <button onclick="editItem('book', '${book.id}')" class="text-blue-500 hover:text-blue-700">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteItem('book', '${book.id}')" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    return item;
}

// Render an author item
function renderAuthors(author) {
    const item = document.createElement('div');
    item.className = 'border p-3 rounded hover:bg-gray-50';
    item.innerHTML = `
        <div class="flex justify-between items-start">
            <div>
                <h4 class="font-medium">${author.name || 'No Name'}</h4>
                <p class="text-sm text-gray-600">${author.email || 'No email'}</p>
                <p class="text-xs text-gray-500">ID: ${author.id || 'N/A'}</p>
            </div>
            <div class="flex space-x-1">
                <button onclick="editItem('author', '${author.id}')" class="text-blue-500 hover:text-blue-700">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteItem('author', '${author.id}')" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    return item;
}

// Render a member item
function renderMembers(member) {
    const item = document.createElement('div');
    item.className = 'border p-3 rounded hover:bg-gray-50';
    item.innerHTML = `
        <div class="flex justify-between items-start">
            <div>
                <h4 class="font-medium">${member.name || 'No Name'}</h4>
                <p class="text-sm text-gray-600">${member.email || 'No email'}</p>
                <p class="text-xs text-gray-500">ID: ${member.id || 'N/A'}</p>
            </div>
            <div class="flex space-x-1">
                <button onclick="editItem('member', '${member.id}')" class="text-blue-500 hover:text-blue-700">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteItem('member', '${member.id}')" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    return item;
}

// Show the add modal with the appropriate form fields
function showAddModal(context) {
    currentContext = context;
    itemIdInput.value = '';
    
    // Set modal title
    modalTitle.textContent = `Add New ${capitalizeFirstLetter(context)}`;
    
    // Set form fields based on context
    formFields.innerHTML = getFormFields(context);
    
    // Show the modal
    modal.classList.remove('hidden');
}

// Show the edit modal with the item's current data
async function editItem(context, id) {
    currentContext = context;
    itemIdInput.value = id;
    
    try {
        const response = await fetch(`${API_ENDPOINTS[context]}/${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const item = await response.json();
        
        // Set modal title
        modalTitle.textContent = `Edit ${capitalizeFirstLetter(context)}`;
        
        // Set form fields with current data
        formFields.innerHTML = getFormFields(context, item);
        
        // Show the modal
        modal.classList.remove('hidden');
    } catch (error) {
        console.error(`Error fetching ${context} data:`, error);
        showNotification('Error loading item data', 'error');
    }
}

// Get the appropriate form fields based on context
function getFormFields(context, item = {}) {
    const fields = {
        book: [
            { name: 'title', label: 'Title', type: 'text', value: item.title || '', required: true },
            { name: 'author', label: 'Author', type: 'text', value: item.author || '', required: true },
            { name: 'isbn', label: 'ISBN', type: 'text', value: item.isbn || '', required: true },
            { name: 'published_date', label: 'Published Date', type: 'date', value: item.published_date || '' },
            { name: 'description', label: 'Description', type: 'textarea', value: item.description || '' }
        ],
        author: [
            { name: 'name', label: 'Name', type: 'text', value: item.name || '', required: true },
            { name: 'email', label: 'Email', type: 'email', value: item.email || '' },
            { name: 'bio', label: 'Biography', type: 'textarea', value: item.bio || '' }
        ],
        member: [
            { name: 'name', label: 'Name', type: 'text', value: item.name || '', required: true },
            { name: 'email', label: 'Email', type: 'email', value: item.email || '', required: true },
            { name: 'phone', label: 'Phone', type: 'tel', value: item.phone || '' },
            { name: 'address', label: 'Address', type: 'text', value: item.address || '' }
        ]
    };
    
    return fields[context].map(field => {
        if (field.type === 'textarea') {
            return `
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="${field.name}">
                        ${field.label}
                    </label>
                    <textarea 
                        id="${field.name}" 
                        name="${field.name}" 
                        class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ${field.required ? 'required' : ''}
                    >${field.value}</textarea>
                </div>
            `;
        } else {
            return `
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="${field.name}">
                        ${field.label}
                    </label>
                    <input 
                        type="${field.type}" 
                        id="${field.name}" 
                        name="${field.name}" 
                        value="${field.value}"
                        class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ${field.required ? 'required' : ''}
                    >
                </div>
            `;
        }
    }).join('');
}

// Close the modal
function closeModal() {
    modal.classList.add('hidden');
    dataForm.reset();
}

// Delete an item
async function deleteItem(context, id) {
    if (!confirm(`Are you sure you want to delete this ${context}?`)) return;
    
    try {
        const response = await fetch(`${API_ENDPOINTS[context]}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        showNotification(`${capitalizeFirstLetter(context)} deleted successfully`, 'success');
        loadAllData(); // Refresh the data
    } catch (error) {
        console.error(`Error deleting ${context}:`, error);
        showNotification(`Error deleting ${context}`, 'error');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Form submission
    dataForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(dataForm);
        const data = {};
        formData.forEach((value, key) => {
            if (value) data[key] = value;
        });
        
        const id = itemIdInput.value;
        const method = id ? 'PUT' : 'POST';
        const url = id 
            ? `${API_ENDPOINTS[currentContext]}/${id}`
            : `${API_ENDPOINTS[currentContext]}/`;
        
        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'An error occurred');
            }
            
            const result = await response.json();
            showNotification(
                `${capitalizeFirstLetter(currentContext)} ${id ? 'updated' : 'added'} successfully`,
                'success'
            );
            
            closeModal();
            loadAllData(); // Refresh the data
        } catch (error) {
            console.error(`Error saving ${currentContext}:`, error);
            showNotification(
                `Error: ${error.message || 'Failed to save data'}`,
                'error'
            );
        }
    });
}

// Show a notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const bgColor = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    }[type] || 'bg-blue-500';
    
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded shadow-lg`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Make functions available globally
window.showAddModal = showAddModal;
window.editItem = editItem;
window.deleteItem = deleteItem;
window.closeModal = closeModal;
