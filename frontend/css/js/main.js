const API_BASE_URLS = {
    books: 'http://localhost:8001/books/',
    authors: 'http://localhost:8002/authors/',
    members: 'http://localhost:8003/members/'
};

const SCHEMAS = {
    books: [
        { key: 'Title', label: 'Title', type: 'text', required: true },
        { key: 'Author', label: 'Author', type: 'text', required: true },
        { key: 'Year', label: 'Year', type: 'number', required: true },
        { key: 'Genre', label: 'Genre', type: 'text', required: true }
    ],
    authors: [
        { key: 'Name', label: 'Name', type: 'text', required: true },
        { key: 'Nationality', label: 'Nationality', type: 'text', required: true },
        { key: 'Born', label: 'Born Year', type: 'number', required: true }
    ],
    members: [
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'member_id', label: 'Member ID', type: 'text', required: true },
        { key: 'join_date', label: 'Join Date', type: 'date', required: true }
    ]
};

let currentView = 'books';
let currentData = [];
let mainChart = null;

// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const pageTitle = document.getElementById('page-title');
const totalCount = document.getElementById('total-count');
const dataTable = document.getElementById('data-table');
const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const dataForm = document.getElementById('data-form');
const formFields = document.getElementById('form-fields');
const itemIdInput = document.getElementById('item-id');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const searchInput = document.getElementById('search-input');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadView('books');
    setupEventListeners();
});

function setupEventListeners() {
    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            loadView(item.dataset.target);
        });
    });

    // Modal Actions
    document.getElementById('add-btn').addEventListener('click', () => openModal());
    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('cancel-modal').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // Form Submission
    // Form Submission
    dataForm.addEventListener('submit', handleFormSubmit);

    // Search
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = currentData.filter(item => {
            return Object.values(item).some(val =>
                String(val).toLowerCase().includes(query)
            );
        });
        renderTable(filtered);
    });
}

async function loadView(view) {
    currentView = view;
    pageTitle.textContent = view.charAt(0).toUpperCase() + view.slice(1) + ' Management';

    // Update Stats Icon/Color based on view (optional polish)

    await fetchData();
}

async function fetchData() {
    try {
        const response = await fetch(API_BASE_URLS[currentView]);
        if (!response.ok) throw new Error('Failed to fetch data');

        const data = await response.json();
        // The API returns an object like { "Books": [...] } or just a list depending on implementation
        // Based on Books_api.py, it calls bs.get_all_books(). Let's assume it returns the list directly or wrapped.
        // If we look at library.json, it has keys "Books", "Authors", "Members".
        // Let's handle both cases (direct array or wrapped).

        currentData = Array.isArray(data) ? data : (data[Object.keys(data)[0]] || []);

        // If the API returns the whole DB object (unlikely but possible), we might need to parse.
        // Assuming the services return the list of items.

        // Assuming the services return the list of items.

        renderTable(currentData);
        updateStats();
        updateChart();
    } catch (error) {
        showToast(error.message, 'error');
        console.error(error);
    }
}

function renderTable(data = currentData) {
    const thead = dataTable.querySelector('thead');
    const tbody = dataTable.querySelector('tbody');

    thead.innerHTML = '';
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="100%" style="text-align:center;">No data available</td></tr>';
        return;
    }

    // Generate Headers
    const schema = SCHEMAS[currentView];
    const headerRow = document.createElement('tr');
    schema.forEach(field => {
        const th = document.createElement('th');
        th.textContent = field.label;
        headerRow.appendChild(th);
    });
    const actionTh = document.createElement('th');
    actionTh.textContent = 'Actions';
    actionTh.style.width = '100px';
    headerRow.appendChild(actionTh);
    thead.appendChild(headerRow);

    // Generate Rows
    data.forEach(item => {
        const tr = document.createElement('tr');

        schema.forEach(field => {
            const td = document.createElement('td');
            td.textContent = item[field.key] || '-';
            tr.appendChild(td);
        });

        const actionTd = document.createElement('td');
        actionTd.className = 'actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'btn-icon btn-edit';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.onclick = () => openModal(item);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-icon btn-delete';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.onclick = () => deleteItem(item.id);

        actionTd.appendChild(editBtn);
        actionTd.appendChild(deleteBtn);
        tr.appendChild(actionTd);

        tbody.appendChild(tr);
    });
}

function updateStats() {
    totalCount.textContent = currentData.length;
}

function updateChart() {
    const ctx = document.getElementById('main-chart').getContext('2d');

    // Prepare Data
    let labels = [];
    let data = [];
    let label = '';

    if (currentView === 'books') {
        // Count books by Genre
        const counts = {};
        currentData.forEach(item => {
            const genre = item.Genre || 'Unknown';
            counts[genre] = (counts[genre] || 0) + 1;
        });
        labels = Object.keys(counts);
        data = Object.values(counts);
        label = 'Books by Genre';
    } else if (currentView === 'authors') {
        // Count authors by Nationality
        const counts = {};
        currentData.forEach(item => {
            const nat = item.Nationality || 'Unknown';
            counts[nat] = (counts[nat] || 0) + 1;
        });
        labels = Object.keys(counts);
        data = Object.values(counts);
        label = 'Authors by Nationality';
    } else if (currentView === 'members') {
        // Members by Join Year (derived from date)
        const counts = {};
        currentData.forEach(item => {
            const year = item.join_date ? item.join_date.split('-')[0] : 'Unknown';
            counts[year] = (counts[year] || 0) + 1;
        });
        labels = Object.keys(counts);
        data = Object.values(counts);
        label = 'Members Joining by Year';
    }

    if (mainChart) {
        mainChart.destroy();
    }

    mainChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: 'rgba(99, 102, 241, 0.5)',
                borderColor: '#6366f1',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#f8fafc'
                    }
                }
            }
        }
    });
}

function openModal(item = null) {
    modalTitle.textContent = item ? `Edit ${currentView.slice(0, -1)}` : `Add New ${currentView.slice(0, -1)}`;
    itemIdInput.value = item ? item.id : '';

    formFields.innerHTML = '';
    const schema = SCHEMAS[currentView];

    schema.forEach(field => {
        const div = document.createElement('div');
        div.className = 'form-group';

        const label = document.createElement('label');
        label.textContent = field.label;

        const input = document.createElement('input');
        input.type = field.type;
        input.className = 'form-control';
        input.name = field.key;
        input.required = field.required;
        if (item) input.value = item[field.key];

        div.appendChild(label);
        div.appendChild(input);
        formFields.appendChild(div);
    });

    modalOverlay.classList.add('active');
}

function closeModal() {
    modalOverlay.classList.remove('active');
    dataForm.reset();
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(dataForm);
    const data = Object.fromEntries(formData.entries());
    const id = itemIdInput.value;

    // Ensure numeric fields are numbers
    SCHEMAS[currentView].forEach(field => {
        if (field.type === 'number') {
            data[field.key] = Number(data[field.key]);
        }
    });

    // Add ID if creating new (simple random ID for demo if backend doesn't generate)
    // The backend might expect an ID. Let's check if we need to generate one.
    // Looking at library.json, IDs are short strings like "B088".
    if (!id) {
        data.id = Math.random().toString(36).substr(2, 4);
    }

    try {
        const url = id
            ? `${API_BASE_URLS[currentView]}${id}`
            : API_BASE_URLS[currentView];

        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Operation failed');

        showToast(id ? 'Item updated successfully' : 'Item created successfully', 'success');
        closeModal();
        fetchData();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
        const response = await fetch(`${API_BASE_URLS[currentView]}${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Delete failed');

        showToast('Item deleted successfully', 'success');
        fetchData();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    toast.className = `toast ${type} show`;

    const icon = toast.querySelector('i');
    icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
