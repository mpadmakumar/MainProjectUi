document.addEventListener('DOMContentLoaded', () => {

    // --- Global Selectors ---
    const sidebar = document.getElementById('adminSidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const navLinks = document.querySelectorAll('.sidebar-nav a, .logo a');
    const contentSections = document.querySelectorAll('.content-section');
    const headerTitle = document.getElementById('main-header-title');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const logoutLink = document.getElementById('adminLogoutLink');

    // --- API Endpoints ---
    const API_BASE_URL = 'https://mainprojectapi.onrender.com';
    const STATS_URL = `${API_BASE_URL}/admin/stats`;
    const USERS_URL = `${API_BASE_URL}/admin/users`;
    const PRODUCTS_VIEW_URL = `${API_BASE_URL}/viewProduct`;
    const PRODUCT_ADD_URL = `${API_BASE_URL}/addProduct`;
    const PRODUCT_UPDATE_URL = (id) => `${API_BASE_URL}/UpdateProduct?id=${id}`;
    const PRODUCT_DELETE_URL = (id) => `${API_BASE_URL}/DeleteProduct?id=${id}`;
    const ORDERS_URL = `${API_BASE_URL}/admin/viewOrders`;
    const ORDER_DETAILS_URL = (id) => `${API_BASE_URL}/admin/viewOrderDetails?orderId=${id}`;
    const ORDER_UPDATE_STATUS_URL = `${API_BASE_URL}/admin/updateOrderStatus`;
    // ✅ NEW: API Endpoint for Payments (உங்கள் சரியான URL-ஐ இங்கே மாற்றவும்)
    const PAYMENTS_URL = `${API_BASE_URL}/admin/payments`;

    // --- Common UI Functions ---
    const showLoading = (show) => { loadingOverlay.style.display = show ? 'flex' : 'none'; };
    const showMessage = (element, message, type) => {
        element.textContent = message;
        element.className = `message-container ${type}`;
        element.style.display = 'block';
        setTimeout(() => { element.style.display = 'none'; }, 5000);
    };

    // --- Navigation Logic ---
    const showSection = (sectionId) => {
        let title = 'Admin Panel';
        contentSections.forEach(section => section.classList.remove('active'));
        document.getElementById(sectionId).classList.add('active');

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === sectionId) {
                link.classList.add('active');
                if (link.innerText.trim()) title = link.innerText.trim();
            }
        });
        headerTitle.textContent = title === 'Dashboard' ? 'Dashboard Overview' : `${title}`;
        if (sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }

        switch (sectionId) {
            case 'dashboard-section': fetchDashboardStats(); break;
            case 'products-section': fetchProducts(); break;
            case 'orders-section': fetchOrders(); break;
            case 'users-section': fetchUsers(); break;
            case 'requests-section': fetchRequests(); break;
            // ✅ NEW: Call fetchPayments when the payments section is shown
            case 'payments-section': fetchPaymentDetails(); break;
        }
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.dataset.section;
            if (sectionId) showSection(sectionId);
        });
    });

    // --- Sidebar and Logout ---
    sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('active'));
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('You have been logged out.');
    });

    // --- Dashboard Logic ---
    async function fetchDashboardStats() {
        const statsGrid = document.getElementById('statsGrid');
        showLoading(true);
        try {
            const response = await fetch(STATS_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const stats = await response.json();
            statsGrid.innerHTML = `
                <div class="stat-card orders"><i class="fas fa-clipboard-list icon"></i><h3>Total Orders</h3><span class="value">${stats.totalOrders || 0}</span></div>
                <div class="stat-card products"><i class="fas fa-box icon"></i><h3>Total Products</h3><span class="value">${stats.totalProducts || 0}</span></div>
                <div class="stat-card users"><i class="fas fa-users icon"></i><h3>Total Users</h3><span class="value">${stats.totalUsers || 0}</span></div>
                <div class="stat-card request"><i class="fas fa-file-signature" style="font-size:36px; color:#3F51B5;"></i><h3>Total Request</h3><span class="value">${stats.totalrequest || 0}</span></div>
            `;
        } catch (error) {
            statsGrid.innerHTML = `<p class="error-message"><i class="fas fa-exclamation-circle"></i> Failed to load statistics.</p>`;
        } finally {
            showLoading(false);
        }
    }

    // --- Users Logic ---
    async function fetchUsers() {
        const container = document.getElementById('usersTableContainer');
        showLoading(true);
        container.innerHTML = `<p class="loading-message"><i class="fas fa-spinner fa-spin"></i> Loading users...</p>`;
        try {
            const response = await fetch(USERS_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const users = await response.json();
            if (users.length === 0) {
                container.innerHTML = '<p>No users found.</p>';
                return;
            }
            let tableHtml = `<table class="data-table"><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone No</th><th>Address</th></tr></thead><tbody>`;
            users.forEach(user => {
                tableHtml += `
                    <tr>
                        <td>${user.id || 'N/A'}</td>
                        <td>${user.name || 'N/A'}</td>
                        <td>${user.email || 'N/A'}</td>
                        <td>${user.phone || 'N/A'}</td>
                        <td>${user.address || 'N/A'}</td>
                    </tr>`;
            });
            tableHtml += `</tbody></table>`;
            container.innerHTML = tableHtml;
        } catch (error) {
            container.innerHTML = `<p class="error-message"><i class="fas fa-exclamation-circle"></i> Failed to load users.</p>`;
        } finally {
            showLoading(false);
        }
    }

    // --- Orders Logic ---
    async function fetchOrders() {
        const container = document.getElementById('ordersTableContainer');
        showLoading(true);
        container.innerHTML = `<p class="loading-message"><i class="fas fa-spinner fa-spin"></i> Loading orders...</p>`;

        try {
            const response = await fetch(ORDERS_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const orders = await response.json();
            if (orders.length === 0) {
                container.innerHTML = '<p>No orders found.</p>';
                return;
            }

            let tableHtml = `<table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Date</th>
                                        <th>Customer Name</th>
                                        <th>User Name</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="admin-orders-table-body">`;

            orders.forEach(order => {
                const status = order.status;
                const statusDropdown = `
                    <select onchange="updateOrderStatus(this, ${order.orderId})" data-original-status="${status}" class="status-select status-${status.toLowerCase()}">
                        <option value="Pending" ${status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Shipped" ${status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="Delivered" ${status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="Cancelled" ${status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                `;

                tableHtml += `
                    <tr>
                        <td class="font-bold">#${order.orderId}</td>
                        <td>${order.orderDate}</td>
                        <td>${order.customerName}</td>
                        <td>${order.userName}</td>
                        <td class="font-semibold">Rs.${(order.totalAmount || 0).toFixed(2)}</td>
                        <td>${statusDropdown}</td>
                        <td>
                            <button onclick="viewOrderDetails(${order.orderId})" class="btn btn-primary">
                                <i class="fas fa-eye"></i> View
                            </button>
                        </td>
                    </tr>`;
            });

            tableHtml += `</tbody></table>`;
            container.innerHTML = tableHtml;
        } catch (error) {
            container.innerHTML = `<p class="message-container error"><i class="fas fa-exclamation-circle"></i> Failed to load orders.</p>`;
        } finally {
            showLoading(false);
        }
    }

    // --- Order Details Modal and Status Update ---
    window.viewOrderDetails = async (orderId) => {
        const modal = document.getElementById('orderDetailsModal');
        const modalContent = document.getElementById('modal-content');
        modal.classList.remove('hidden');
        modalContent.innerHTML = '<p class="text-center p-8 text-gray-500"><i class="fas fa-spinner fa-spin"></i> Loading details...</p>';

        try {
            const response = await fetch(ORDER_DETAILS_URL(orderId));
            const details = await response.json();

            let itemsHtml = '<h4 class="text-lg font-semibold mt-6 mb-3 text-gray-800">Products in this Order:</h4><div class="space-y-4">';
            details.items.forEach(item => {
                itemsHtml += `
                    <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <img src="${item.imageUrl}" alt="${item.productName}" class="w-20 h-20 object-cover rounded-md">
                        <div>
                            <p class="font-semibold text-gray-900">${item.productName}</p>
                            <p class="text-sm text-gray-600">Quantity: ${item.quantity}</p>
                        </div>
                    </div>`;
            });
            itemsHtml += '</div>';

            modalContent.innerHTML = `
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                    <div><strong class="block text-gray-500 font-medium">Order ID:</strong><p class="text-gray-900 font-semibold">#${details.orderIdText}</p></div>
                    <div><strong class="block text-gray-500 font-medium">Order Date:</strong><p class="text-gray-900">${details.orderDate}</p></div>
                    <div><strong class="block text-gray-500 font-medium">Customer:</strong><p class="text-gray-900">${details.customerName}</p></div>
                    <div><strong class="block text-gray-500 font-medium">Status:</strong><span class="px-2 py-1 font-semibold rounded-full bg-yellow-100 text-yellow-800">${details.status}</span></div>
                </div>
                <div class="mt-5 pt-5 border-t border-gray-200">
                    <strong class="block text-gray-500 text-sm font-medium">Shipping Address:</strong>
                    <p class="text-gray-800 mt-1">${details.address}, ${details.city}, ${details.pincode}</p>
                    <p class="text-gray-800">Mobile: ${details.mobileNumber}</p>
                </div>
                ${itemsHtml}`;
        } catch (error) {
            console.error("Failed to fetch order details:", error);
            modalContent.innerHTML = `<p class="text-center p-8 text-red-500">Failed to load order details.</p>`;
        }
    };

    window.updateOrderStatus = async (selectElement, orderId) => {
        const newStatus = selectElement.value;
        const originalStatus = selectElement.dataset.originalStatus;

        if (!confirm(`Are you sure you want to change the status for order #${orderId} to "${newStatus}"?`)) {
            selectElement.value = originalStatus;
            return;
        }

        showLoading(true);

        try {
            const response = await fetch(ORDER_UPDATE_STATUS_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: orderId, newStatus: newStatus })
            });
            const result = await response.json();
            if (result.status === 'success') {
                alert(result.message);
                selectElement.dataset.originalStatus = newStatus;
                selectElement.className = `status-select status-${newStatus.toLowerCase()}`;
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error("Failed to update status:", error);
            alert(`Error: ${error.message}`);
            selectElement.value = originalStatus;
        } finally {
            showLoading(false);
        }
    };

    window.closeModal = () => {
        document.getElementById('orderDetailsModal').classList.add('hidden');
    };

    const searchInput = document.getElementById('orderSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const tableBody = document.getElementById('admin-orders-table-body');
            if (!tableBody) return;
            const rows = tableBody.getElementsByTagName('tr');

            for (const row of rows) {
                const customerNameCell = row.cells[2];
                const userNameCell = row.cells[3];
                if (customerNameCell && userNameCell) {
                    const customerName = customerNameCell.textContent.toLowerCase();
                    const userName = userNameCell.textContent.toLowerCase();
                    if (customerName.includes(searchTerm) || userName.includes(searchTerm)) {
                        row.style.display = "";
                    } else {
                        row.style.display = "none";
                    }
                }
            }
        });
    }

    // --- Products Logic ---
    const productForm = document.getElementById('productForm');
    const { productName, productDescription, productPrice, productStock, productCategory, productImageUrl } = productForm.elements;
    const saveProductBtn = document.getElementById('saveProductBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const formMessage = document.getElementById('formMessage');
    const productsTableContainer = document.getElementById('productsTableContainer');
    const tableMessageProducts = document.getElementById('tableMessageProducts');
    let editingProductId = null;

    function resetForm() {
        productForm.reset();
        editingProductId = null;
        saveProductBtn.innerHTML = '<i class="fas fa-save"></i> Add Product';
        saveProductBtn.classList.replace('btn-primary', 'btn-success');
        cancelEditBtn.style.display = 'none';
    }

    cancelEditBtn.addEventListener('click', resetForm);

    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        showLoading(true);
        const productData = {
            name: productName.value.trim(), description: productDescription.value.trim(),
            price: parseFloat(productPrice.value), stock: parseInt(productStock.value, 10),
            category: productCategory.value, imageUrl: productImageUrl.value.trim()
        };
        const method = editingProductId ? 'PUT' : 'POST';
        const url = editingProductId ? PRODUCT_UPDATE_URL(editingProductId) : PRODUCT_ADD_URL;
        try {
            const response = await fetch(url, { method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(productData) });
            if (!response.ok) throw new Error(await response.text());
            showMessage(formMessage, `Product ${editingProductId ? 'updated' : 'added'} successfully!`, 'success');
            resetForm(); fetchProducts();
        } catch (error) {
            showMessage(formMessage, `Error: ${error.message}`, 'error');
        } finally { showLoading(false); }
    });

    async function fetchProducts() {
        showLoading(true);
        productsTableContainer.innerHTML = `<p class="loading-message"><i class="fas fa-spinner fa-spin"></i> Loading products...</p>`;
        try {
            const response = await fetch(PRODUCTS_VIEW_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const products = await response.json();
            if (products.length === 0) { productsTableContainer.innerHTML = '<p>No products found.</p>'; return; }
            let tableHtml = `<table class="data-table product-table"><thead><tr><th>Id</th><th>Image</th><th>Name</th><th>Price</th><th>Stock</th><th>Category</th><th>Actions</th></tr></thead><tbody>`;
            products.forEach(p => {
                tableHtml += `<tr data-id="${p.id}" data-name="${p.name}" data-description="${p.description || ''}" data-price="${p.price}" data-stock="${p.stock}" data-category="${p.category || ''}" data-imageurl="${p.imageUrl || ''}">
                            <td>${p.id}</td><td><img src="${p.imageUrl || ''}" alt="${p.name}"></td><td>${p.name}</td><td>Rs.${(p.price || 0).toFixed(2)}</td>
                            <td>${p.stock}</td><td>${p.category || 'N/A'}</td>
                            <td class="actions"><button class="btn btn-primary edit-btn"><i class="fas fa-edit"></i> Edit</button><button class="btn btn-danger delete-btn"><i class="fas fa-trash-alt"></i> Delete</button></td></tr>`;
            });
            productsTableContainer.innerHTML = tableHtml + `</tbody></table>`;
        } catch (error) {
            productsTableContainer.innerHTML = `<p class="error-message"><i class="fas fa-exclamation-circle"></i> Failed to load products.</p>`;
        } finally { showLoading(false); }
    }

    productsTableContainer.addEventListener('click', async (e) => {
        const target = e.target.closest('button');
        if (!target) return;
        const row = target.closest('tr'); const id = row.dataset.id;
        if (target.classList.contains('edit-btn')) {
            editingProductId = id;
            productName.value = row.dataset.name; productDescription.value = row.dataset.description; productPrice.value = row.dataset.price;
            productStock.value = row.dataset.stock; productCategory.value = row.dataset.category; productImageUrl.value = row.dataset.imageurl;
            saveProductBtn.innerHTML = '<i class="fas fa-upload"></i> Update Product'; saveProductBtn.classList.replace('btn-success', 'btn-primary');
            cancelEditBtn.style.display = 'inline-flex'; productForm.scrollIntoView({ behavior: 'smooth' });
        }
        if (target.classList.contains('delete-btn')) {
            if (!confirm(`Are you sure you want to delete product ID: ${id}?`)) return;
            showLoading(true);
            try {
                const response = await fetch(PRODUCT_DELETE_URL(id), { method: 'DELETE' });
                if (!response.ok) throw new Error(await response.text());
                showMessage(tableMessageProducts, 'Product deleted successfully!', 'success'); fetchProducts();
            } catch (error) {
                showMessage(tableMessageProducts, `Error: ${error.message}`, 'error');
            } finally { showLoading(false); }
        }
    });
    
    // --- ✅✅✅ NEW: Function to fetch and display payment details ✅✅✅ ---
// ✅ மேம்படுத்தப்பட்ட fetchPayments செயல்பாடு
document.addEventListener("DOMContentLoaded", () => {
    // This function will be called when your "Payment Details" section is shown
    fetchPaymentDetails(); 
});

// API endpoint to get all order data
const ADMIN_GET_ORDERS_URL = 'https://mainprojectapi.onrender.com/admin/getOrders';

// This function fetches all orders and displays them in a table like your image
async function fetchPaymentDetails() {
    const container = document.getElementById('paymentsTableContainer');
    container.innerHTML = `<p class="loading-message"><i class="fas fa-spinner fa-spin"></i> Loading payment details...</p>`;

    try {
        const response = await fetch(ADMIN_GET_ORDERS_URL); 
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const orders = await response.json();

        if (!orders || orders.length === 0) {
            container.innerHTML = '<p class="empty-message">No payment records found.</p>';
            return;
        }

        // 🟢 Create table headers exactly like your image
        let tableHtml = `<table class="data-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Amount</th>
                                    <th>Payment Method</th>
                                    <th>Payment Status</th>
                                    <th>Transaction ID</th>
                                </tr>
                            </thead>
                            <tbody>`;
        
        orders.forEach(order => {
            const paymentStatus = order.paymentStatus || 'N/A';
            
            // 🟢 Dropdown to UPDATE Payment Status
            const paymentStatusDropdown = `
                <select onchange="updatePaymentStatus(this, '${order.orderIdText}')" class="status-select status-${paymentStatus.toLowerCase().replace(/ /g, '-')}">
                    <option value="Pending" ${paymentStatus === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Verification Pending" ${paymentStatus === 'Verification Pending' ? 'selected' : ''}>Verification Pending</option>
                    <option value="Paid" ${paymentStatus === 'Paid' ? 'selected' : ''}>Paid</option>
                    <option value="Failed" ${paymentStatus === 'Failed' ? 'selected' : ''}>Failed</option>
                </select>
            `;

            tableHtml += `
                <tr>
                    <td>#${order.orderIdText}</td>
                    <td>${order.customerName || 'N/A'}</td>
                    <td class="font-semibold">₹${(order.totalAmount || 0).toFixed(2)}</td>
                    <td>${order.paymentMethod}</td>
                    <td>${paymentStatusDropdown}</td>
                    <td class="transaction-id">${order.transactionId || 'N/A'}</td>
                </tr>`;
        });

        tableHtml += `</tbody></table>`;
        container.innerHTML = tableHtml;

    } catch (error) {
        console.error("Failed to fetch orders:", error);
        container.innerHTML = `<p class="error-message">Failed to load payment details.</p>`;
    }
}

// This function updates ONLY the payment status
window.updatePaymentStatus = async function(selectElement, orderIdText) {
    const newStatus = selectElement.value;
    const ADMIN_UPDATE_PAYMENT_STATUS_URL = 'https://mainprojectapi.onrender.com/admin/updatePaymentStatus';
    
    if (!confirm(`Are you sure you want to change the PAYMENT status for Order #${orderIdText} to "${newStatus}"?`)) {
        fetchPaymentDetails(); // Reload table to revert the dropdown if cancelled
        return;
    }

    try {
        const response = await fetch(ADMIN_UPDATE_PAYMENT_STATUS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                orderIdText: orderIdText,
                newStatus: newStatus
            })
        });

        const result = await response.json();
        if (result.status === 'success') {
            alert(result.message);
            fetchPaymentDetails(); // Refresh table on success
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error(`Failed to update payment status:`, error);
        alert(`Error: ${error.message}`);
        fetchPaymentDetails(); // Revert on error
    }
}





    // --- Custom Requests Logic ---
    async function fetchRequests() {
        const tableContainer = document.getElementById("requestsTableContainer");
        const messageContainer = document.getElementById("tableMessageRequests");
        showLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/admin/customRequests`);
            if (!res.ok) throw new Error("Failed to fetch requests");

            const data = await res.json();
            tableContainer.innerHTML = ""; // Clear loading message

            if (!data || data.length === 0) {
                tableContainer.innerHTML = `<p class="empty-message">No custom design requests found.</p>`;
                return;
            }
            const table = document.createElement("table");
            table.className = "data-table"; // Use consistent table class
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Jewelry Type</th>
                        <th>Description</th>
                        <th>Image</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map((req, i) => `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${req.name}</td>
                            <td>${req.email}</td>
                            <td>${req.phone || "-"}</td>
                            <td>${req.jewelryType || "-"}</td>
                            <td class="description-cell">${req.description || "-"}</td>
                            <td>
                                ${req.image_path
                                    ? `<a href="${req.image_path}" target="_blank" rel="noopener noreferrer"><img src="${req.image_path}" alt="Request Image" style="width:80px;height:auto;border-radius:4px;"></a>`
                                    : "-"}
                            </td>
                            <td>
                                <button class="btn btn-danger delete-request-btn" data-id="${req.id}">
                                    <i class="fas fa-trash-alt"></i> Delete
                                </button>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>`;
            tableContainer.appendChild(table);
        } catch (err) {
            console.error(err);
            messageContainer.innerHTML = `<p class="error-message">Error loading requests. Please try again.</p>`;
        } finally {
            showLoading(false);
        }
    }

    document.getElementById('requestsTableContainer').addEventListener('click', async (e) => {
        if (e.target.closest('.delete-request-btn')) {
            const id = e.target.closest('.delete-request-btn').dataset.id;
            if (!confirm("Are you sure you want to delete this request?")) return;
            showLoading(true);
            try {
                const res = await fetch(`${API_BASE_URL}/admin/customRequests?id=${id}`, { method: "DELETE" });
                if (res.ok) {
                    showMessage(document.getElementById('tableMessageRequests'), 'Request deleted successfully.', 'success');
                    fetchRequests();
                } else {
                    throw new Error('Failed to delete request.');
                }
            } catch (err) {
                console.error(err);
                showMessage(document.getElementById('tableMessageRequests'), 'Error deleting request.', 'error');
            } finally {
                showLoading(false);
            }
        }
    });

    // --- Cloudinary Modal & Upload Logic ---
    const openUploaderBtn = document.getElementById('openUploaderBtn');
    const uploaderModal = document.getElementById('uploaderModal');
    const closeUploaderModal = document.getElementById('closeUploaderModal');

    if (openUploaderBtn) {
        openUploaderBtn.addEventListener('click', () => { uploaderModal.style.display = 'flex'; });
    }
    if (closeUploaderModal) {
        closeUploaderModal.addEventListener('click', () => { uploaderModal.style.display = 'none'; });
    }
    window.addEventListener('click', (e) => {
        if (e.target === uploaderModal) uploaderModal.style.display = 'none';
    });

    const CLOUD_NAME = "dusfv4tqf";
    const UPLOAD_PRESET = "liln6c3x";
    const uploadButton = document.getElementById('upload-button');
    const fileInput = document.getElementById('file-input');
    const statusElement = document.getElementById('status');
    const urlElement = document.getElementById('uploaded-image-url');
    const imagePreview = document.getElementById('image-preview');
    const productImageUrlInput = document.getElementById('productImageUrl');

    if (uploadButton) {
        uploadButton.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) uploadFile(file);
        });

        function uploadFile(file) {
            const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', UPLOAD_PRESET);
            statusElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
            urlElement.style.display = 'none';
            imagePreview.style.display = 'none';
            fetch(url, { method: 'POST', body: formData })
                .then(response => response.json())
                .then(data => {
                    if (data.secure_url) {
                        const imageUrl = data.secure_url;
                        statusElement.innerHTML = '<i class="fas fa-check-circle" style="color:green;"></i> Upload Successful!';
                        urlElement.textContent = imageUrl;
                        urlElement.style.display = 'block';
                        imagePreview.src = imageUrl;
                        imagePreview.style.display = 'block';
                        productImageUrlInput.value = imageUrl;
                    } else { throw new Error('Upload failed.'); }
                })
                .catch(error => {
                    console.error('Error uploading the file:', error);
                    statusElement.innerHTML = '<i class="fas fa-times-circle" style="color:red;"></i> Upload Failed. Please try again.';
                });
        }
    }

    // --- Initial Load ---
    showSection('dashboard-section');

});