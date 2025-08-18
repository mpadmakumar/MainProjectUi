

// --- Global Section References ---
const heroSection = document.getElementById('hero-section');
const categoriesSection = document.getElementById('categories-section');
const featuredProductsSection = document.getElementById('featured-products-section');
const allProductsContainer = document.getElementById('allProductsContainer');
const aboutSection = document.getElementById('about-section');
const contactSection = document.getElementById('contact-section');
const userProfile = document.getElementById('userProfileSection');
const customDesign = document.getElementById('custom-design');
const cartView = document.getElementById('cartView'); // New cart view section
const CheckOutSection = document.getElementById('checkout-section');
const confirmationSection = document.getElementById('confirmation-section');
const myOrdersSection = document.getElementById('my-orders-section');

// --- Core UI Visibility Functions ---
function hideAllContentSections() {
  heroSection.classList.add('hidden');
  categoriesSection.classList.add('hidden');
  featuredProductsSection.classList.add('hidden');
  allProductsContainer.classList.add('hidden');
  aboutSection.classList.add('hidden');
  contactSection.classList.add('hidden');
 userProfile.classList.add('hidden');
  cartView.classList.add('hidden'); // Hide the new cart view
 customDesign.classList.add('hidden');
  CheckOutSection.classList.add('hidden');
    confirmationSection.classList.add('hidden');
    myOrdersSection.classList.add('hidden');
}
function showAboutPage() {
  hideAllContentSections();
  aboutSection.classList.remove('hidden');
  window.scrollTo({ top: aboutSection.offsetTop, behavior: 'smooth' });
}
function showContactPage() {
  hideAllContentSections();
  contactSection.classList.remove('hidden');
  window.scrollTo({ top: contactSection.offsetTop, behavior: 'smooth' });
}

function showCustomDesigntPage() {
  hideAllContentSections();
    customDesign.classList.remove('hidden');
  window.scrollTo({ top:  customDesign.offsetTop, behavior: 'smooth' });
 }
function showHomePage() {
  hideAllContentSections();
  heroSection.classList.remove('hidden');
  categoriesSection.classList.remove('hidden');
  featuredProductsSection.classList.remove('hidden');
  //aboutSection.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
async function showCheckOutPage() {
  hideAllContentSections();
  CheckOutSection.classList.remove('hidden');
  window.scrollTo({ top: CheckOutSection.offsetTop, behavior: 'smooth' });

  const userData = JSON.parse(localStorage.getItem('userData'));
  if (!userData || !userData.name) {
    alert("Please login to proceed to checkout.");
    showHomePage(); // Redirect if not logged in
    return;
  }

  // Fetch cart items to calculate total and show summary
  try {
    const response = await fetch(`${VIEW_CART_API_URL}?userName=${userData.name}`);
    if (!response.ok) throw new Error('Failed to load cart for summary.');
    const cartItems = await response.json();

    if (cartItems.length === 0) {
        alert("Your cart is empty. Add items before checking out.");
        showCartPage(); // Go back to cart if it's empty
        return;
    }

    let totalPrice = 0;
    const summaryContainer = document.getElementById('checkoutOrderSummary');
    summaryContainer.innerHTML = ''; // Clear loading message

    cartItems.forEach(item => {
      const itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;
      const summaryItemHtml = `
        <div class="flex justify-between items-center text-sm">
          <span class="text-gray-600">${item.name} (x${item.quantity})</span>
          <span class="font-medium text-gray-800">₹${itemTotal.toFixed(2)}</span>
        </div>
      `;
      summaryContainer.insertAdjacentHTML('beforeend', summaryItemHtml);
    });

    document.getElementById('checkoutSubtotal').textContent = `₹${totalPrice.toFixed(2)}`;
    document.getElementById('checkoutTotalPrice').textContent = `₹${totalPrice.toFixed(2)}`;

  } catch (error) {
    console.error("Checkout summary error:", error);
    document.getElementById('checkoutOrderSummary').innerHTML = '<p class="text-red-500">Could not load order summary.</p>';
  }

 }
 // ADD THIS NEW FUNCTION to index.js
function showConfirmationPage() {
    hideAllContentSections();
    confirmationSection.classList.remove('hidden');
    window.scrollTo({ top: confirmationSection.offsetTop, behavior: 'smooth' });

    // 1. Get data from the checkout form
    const customerName = document.getElementById('checkoutCustomerName').value;
    const address = document.getElementById('checkoutAddress').value;
    const city = document.getElementById('checkoutCity').value;
    const pincode = document.getElementById('checkoutPincode').value;
    const mobileNumber = document.getElementById('checkoutMobile').value;
    const totalText = document.getElementById('checkoutTotalPrice').textContent;

    // 2. Display the data on the confirmation page
    document.getElementById('confirm-name').textContent = customerName;
    document.getElementById('confirm-address').textContent = address;
    document.getElementById('confirm-city-pincode').textContent = `${city} - ${pincode}`;
    document.getElementById('confirm-mobile').textContent = `Mobile: ${mobileNumber}`;
    document.getElementById('confirm-subtotal').textContent = totalText;
    document.getElementById('confirm-total').textContent = totalText;

    // 3. Store the data in our global variable to use for payment
    finalOrderData = {
        customerName,
        address,
        city,
        pincode,
        mobileNumber,
        totalAmount: parseFloat(totalText.replace('₹', ''))
    };
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.name) {
        finalOrderData.userName = userData.name;
    }
}
function showProductsPage() {
  hideAllContentSections();
  allProductsContainer.classList.remove('hidden');
  productListSection.classList.remove('hidden');
  productDetailView.classList.add('hidden');
  window.scrollTo({ top: allProductsContainer.offsetTop, behavior: 'smooth' });
}

function showCartPage() {
  hideAllContentSections();
  cartView.classList.remove('hidden');
  window.scrollTo({ top: cartView.offsetTop, behavior: 'smooth' });
  const userData = JSON.parse(localStorage.getItem('userData'));
  if (userData && userData.name) {
    renderCartItems(userData.name);
  } else {
    document.getElementById('emptyCartMessage').classList.remove('hidden');
    document.getElementById('cartItemsContainer').innerHTML = '';
    document.getElementById('cartTotalContainer').classList.add('hidden');
  }
}
const GET_USER_API = "https://mainprojectapi.onrender.com/getUser";

async function showUserProfile() {
  hideAllContentSections();
  document.getElementById('userProfileSection').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const userData = JSON.parse(localStorage.getItem('userData'));
  if (!userData || !userData.name) {
    alert("Login required to view profile");
    return;
  }

  try {
    const response = await fetch(`${GET_USER_API}?userName=${userData.name}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user profile. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("User API raw response:", data);

    const user = Array.isArray(data) && data.length > 0 ? data[0] : null;
    if (!user) {
      alert("User not found.");
      return;
    }

    const getSafeValue = (val, fallback = 'Not available') =>
      (val && val.trim() !== '') ? val : fallback;

    const initial = getSafeValue(user.name, 'U').charAt(0).toUpperCase();
    const uName =getSafeValue(user.name) ;

    // Populate fields
    document.querySelector('[data-field="fullName"]').textContent = getSafeValue(uName);
    document.querySelector('[data-field="email"]').textContent = getSafeValue(user.email);
    document.querySelector('[data-field="phone"]').textContent = getSafeValue(user.phone, 'Not provided');
    document.querySelector('[data-field="address"]').textContent = getSafeValue(user.address, 'Not provided');
    document.getElementById('profileInitial').textContent = initial;
    document.querySelectorAll('[id="profileName"]').forEach(el => {
        el.innerHTML = uName;
   });
   document.querySelectorAll('[id="profileEmail"]').forEach(el => {
        el.innerHTML =  getSafeValue(user.email);
   });

    // Store original data for cancel
    originalData = {
      fullName: getSafeValue(user.name),
      email: getSafeValue(user.email),
      phone: getSafeValue(user.phone, 'Not provided'),
      address: getSafeValue(user.address, 'Not provided')
    };

  } catch (error) {
    console.error("Profile Fetch Error:", error);
    alert("Unable to load user profile.");
  }
}

// --- Edit/Save/Cancel logic ---
let originalData = {};

const editBtn = document.getElementById('editBtn');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const profileDetails = document.getElementById('profileDetails');

editBtn.addEventListener('click', () => {
  originalData = {};
  profileDetails.querySelectorAll('[data-field]').forEach(p => {
    const value = p.textContent;
    originalData[p.dataset.field] = value;
    p.outerHTML = `<input type="text" name="${p.dataset.field}" value="${value}" class="border border-gray-300 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-yellow-400 transition" />`;
  });
  toggleButtons(true);
});

saveBtn.addEventListener('click', () => {
  profileDetails.querySelectorAll('input').forEach(input => {
    input.outerHTML = `<p class="text-lg font-medium text-gray-800" data-field="${input.name}">${input.value}</p>`;
  });
  toggleButtons(false);

  // OPTIONAL: Call backend update API here
  // fetch(UPDATE_USER_API, { method: "POST", body: JSON.stringify(updatedData) })
});

cancelBtn.addEventListener('click', () => {
  profileDetails.querySelectorAll('input').forEach(input => {
    input.outerHTML = `<p class="text-lg font-medium text-gray-800" data-field="${input.name}">${originalData[input.name]}</p>`;
  });
  toggleButtons(false);
});

function toggleButtons(editing) {
  editBtn.classList.toggle('hidden', editing);
  saveBtn.classList.toggle('hidden', !editing);
  cancelBtn.classList.toggle('hidden', !editing);
}




// --- Existing index.html JS (adapted for new structure) ---
function toggleDropdown() {
  document.getElementById('profileDropdown').classList.toggle('hidden');
}
function toggleMenu() {
  const menu = document.getElementById("mobile-menu");
  const icon = document.getElementById("menuIcon");

  const isOpen = !menu.classList.contains("hidden");

  if (isOpen) {
    menu.classList.add("hidden");
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
  } else {
    menu.classList.remove("hidden");
    icon.classList.remove("fa-bars");
    icon.classList.add("fa-times");
  }
}

// Optional: Close menu after navigation
function navigateAndCloseMenu(callback) {
  const menu = document.getElementById("mobile-menu");
  const icon = document.getElementById("menuIcon");

  if (!menu.classList.contains("hidden")) {
    menu.classList.add("hidden");
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
  }

  if (typeof callback === "function") {
    callback(); // navigate to page
  }
}

window.onload = function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const userData = JSON.parse(localStorage.getItem('userData'));
  if (isLoggedIn === 'true' && userData) {
    updateUIForLogin(userData);
  } else {
    updateUIForLogout();
  }
  showHomePage();
  fetchProducts();
};
function updateUIForLogin(userData) {
  document.getElementById('loginContainer').classList.add('hidden');
  document.getElementById('userProfile').classList.remove('hidden');
  document.getElementById('userInitial').textContent = userData.initial;
  document.getElementById('profileName').textContent = userData.name;
  document.getElementById('profileEmail').textContent = userData.email;
  document.getElementById('welcomeMessage').textContent = `Welcome back, ${userData.name}! Explore our latest collection.`;
  const mobileAuthSection = document.getElementById('mobileAuthSection');
  mobileAuthSection.innerHTML = `
    <div class="flex items-center p-4 border-b border-gray-100">
      <div class="w-10 h-10 rounded-full bg-yellow-600 text-white flex items-center justify-center mr-3">
        <span class="font-bold text-lg">${userData.initial}</span>
      </div>
      <div>
        <p class="font-semibold text-gray-800">${userData.name}</p>
        <p class="text-xs text-gray-500">${userData.email}</p>
      </div>
    </div>
    <a href="#" onclick="showUserProfile()"  class="block py-3 px-6 text-gray-700 hover:bg-yellow-50 flex items-center"><i class="fas fa-user mr-3"></i>My Profile</a>
    <a href="#" onclick="showCartPage()" class="block py-3 px-6 text-gray-700 hover:bg-yellow-50 flex items-center"><i class="fas fa-shopping-cart mr-3"></i>My Cart</a>
    <li><a href="#" onclick="showMyOrdersPage()" class="block py-3 px-6 text-gray-700 hover:bg-yellow-50 flex items-center"><i class="fas fa-box mr-3"></i>My Orders</a></li>
    <hr class="my-1 border-t border-gray-200">
    <button onclick="handleLogout()" class="w-full text-left py-3 px-6 text-red-600 hover:bg-red-100 flex items-center"><i class="fas fa-sign-out-alt mr-3"></i>Logout</button>
  `;
}
function updateUIForLogout() {
  document.getElementById('loginContainer').classList.remove('hidden');
  document.getElementById('userProfile').classList.add('hidden');
  const mobileAuthSection = document.getElementById('mobileAuthSection');
  mobileAuthSection.innerHTML = `<button onclick="redirectToLoginPage()" class="w-full bg-yellow-600 text-white px-5 py-2 rounded-full hover:bg-yellow-700 transition">Login</button>`;
}
function redirectToLoginPage() {
  window.location.href = 'login.html';
}
function handleLogout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userData');
  localStorage.removeItem('userRole');
  window.location.reload();
}

// --- Merged product.html and product-detail.html JS ---
const productListSection = document.getElementById('productListSection');
const productDetailView = document.getElementById('productDetailView');
const productSearchInput = document.getElementById('productSearch');
const categoryButtonsDiv = document.getElementById('categoryButtons');
const loadingMessageDiv = document.getElementById('loadingMessage');
const productDetailLoadingMessageDiv = document.getElementById('productDetailLoadingMessage');
const productDetailContentDiv = document.getElementById('productDetailContent');
const categoryDiv = document.getElementById('category');

let allProducts = [];
let filteredProducts = [];
let currentCategory = 'All';
let currentSearchTerm = '';
let currentProductId = null;

// --- API Endpoints ---
const PRODUCTS_API_URL = "https://mainprojectapi.onrender.com/viewProduct";
const PRODUCT_DETAIL_API_URL = "https://mainprojectapi.onrender.com/viewProduct";
const ADD_TO_CART_API_URL = "https://mainprojectapi.onrender.com/addToCart";
const VIEW_CART_API_URL = "https://mainprojectapi.onrender.com/viewCart"; // New API endpoint

// --- Helper Functions for Messages ---
function showMessage(targetDiv, iconClass, text, type = 'info') {
    targetDiv.innerHTML = `
        <div class="col-span-full text-center py-10 text-${type === 'danger' ? 'red-600' : (type === 'warning' ? 'yellow-600' : 'gray-600')}">
            <i class="fas ${iconClass} text-4xl mb-4"></i>
            <p class="text-lg">${text}</p>
        </div>
    `;
    targetDiv.classList.remove('hidden');
}

function hideMessage(targetDiv) {
    targetDiv.classList.add('hidden');
    targetDiv.innerHTML = '';
}

function showLoading(targetDiv) {
    showMessage(targetDiv, 'fa-spinner fa-spin', 'Loading...', 'primary');
    targetDiv.classList.remove('hidden');
}

// --- Product List Rendering ---
function renderProducts(productsToRender) {
    productListSection.innerHTML = '';
    hideMessage(loadingMessageDiv);

    if (productsToRender.length === 0) {
        showMessage(loadingMessageDiv, 'fa-box-open', 'No products found matching your criteria.', 'secondary');
        return;
    }

    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'col';
        productCard.innerHTML = `
            <div class="product-card-custom bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full hover:-translate-y-2 transition-transform duration-300">
                <img src="${product.imageUrl || 'https://via.placeholder.com/400x220?text=No+Image'}" class="product-card-image w-full pt-4" alt="${product.name}">
                <div class="p-4 flex flex-col flex-grow justify-between">
                    <div>
                        <h5 class="text-lg md:text-xl font-semibold text-gray-800 mb-2 text-center">${product.name}</h5>
                        <p class="text-gray-600 text-sm mb-3">${product.description ? product.description.substring(0, 70) + '...' : 'No description available.'}</p>
                    </div>
                    <div>
                        <p class="text-yellow-700 text-xl font-bold mb-3 text-center">Rs.${product.price ? product.price.toFixed(2) : 'N/A'}</p>
                        <button onclick="showProductDetail('${product.id}')" class="btn-details-custom bg-gray-800 text-white px-5 py-2 rounded-full font-medium w-full hover:bg-gray-900 transition-colors">View Details <i class="fas fa-arrow-right ml-2"></i></button>
                    </div>
                </div>
            </div>
        `;
        productListSection.appendChild(productCard);
    });
}

// --- Fetch Products from API ---
async function fetchProducts() {
    showLoading(loadingMessageDiv);
    try {
        const response = await fetch(PRODUCTS_API_URL);
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
        }
        const data = await response.json();
        allProducts = data;
        filteredProducts = [...allProducts];
        renderProducts(filteredProducts);
        populateCategories(allProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
        showMessage(loadingMessageDiv, 'fa-times-circle', `Failed to load products: ${error.message}`, 'danger');
    }
}

// --- Category Filtering ---
function populateCategories(products) {
    const categories = new Set();
    products.forEach(product => categories.add(product.category));

    categoryButtonsDiv.innerHTML = `<h6 class="text-base font-semibold text-gray-600 mr-2 mb-2 md:mb-0">Filter by Category:</h6><button class="px-4 py-2 bg-yellow-600 text-white rounded-full font-medium hover:bg-yellow-700 transition active" data-category="All"><i class="fas fa-th-large mr-2"></i>All</button>`;

    categories.forEach(category => {
        if (category) {
            const button = document.createElement('button');
            button.className = 'px-4 py-2 bg-white text-gray-700 rounded-full font-medium border border-gray-400 hover:bg-yellow-100 hover:border-yellow-500 hover:text-yellow-800 transition';
            button.setAttribute('data-category', category);
            button.innerHTML = `<i class="fas fa-tag mr-2"></i> ${category}`;
            categoryButtonsDiv.appendChild(button);
        }
    });

    categoryButtonsDiv.addEventListener('click', (event) => {
        const target = event.target.closest('button');
        if (target && target.dataset.category) {
            currentCategory = target.dataset.category;
            categoryButtonsDiv.querySelectorAll('button').forEach(btn => btn.classList.remove('active', 'bg-yellow-600', 'text-white', 'hover:bg-yellow-700'));
            categoryButtonsDiv.querySelectorAll('button').forEach(btn => btn.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-400', 'hover:bg-yellow-100', 'hover:border-yellow-500', 'hover:text-yellow-800'));

            target.classList.add('active', 'bg-yellow-600', 'text-white', 'hover:bg-yellow-700');
            target.classList.remove('bg-white', 'text-gray-700', 'border', 'border-gray-400', 'hover:bg-yellow-100', 'hover:border-yellow-500', 'hover:text-yellow-800');

            applyFilters();
        }
    });
}

// --- Search and Filter Logic ---
function applyFilters() {
    let tempProducts = [...allProducts];

    if (currentCategory !== 'All') {
        tempProducts = tempProducts.filter(product => product.category === currentCategory);
    }

    if (currentSearchTerm) {
        const searchTermLower = currentSearchTerm.toLowerCase();
        tempProducts = tempProducts.filter(product =>
            (product.name && product.name.toLowerCase().includes(searchTermLower)) ||
            (product.description && product.description.toLowerCase().includes(searchTermLower)) ||
            (product.category && product.category.toLowerCase().includes(searchTermLower))
        );
    }

    filteredProducts = tempProducts;
    renderProducts(filteredProducts);
}

// --- Product Detail View Functions ---
async function showProductDetail(productId) {
  currentProductId = productId;
  productListSection.classList.add('hidden');
  productDetailView.classList.remove('hidden');
  productDetailContentDiv.classList.add('hidden');
  categoryDiv.classList.add('hidden')
  showLoading(productDetailLoadingMessageDiv);

  try {
    const response = await fetch(`${PRODUCT_DETAIL_API_URL}?id=${productId}`);
    const data = await response.json();

    hideMessage(productDetailLoadingMessageDiv);
    if (Array.isArray(data) && data.length > 0) {
      renderProductDetailContent(data[0]);
    } else if (data?.id) {
      renderProductDetailContent(data);
    } else {
      const featuredProduct = allProducts.find(p => p.id === productId);
      if (featuredProduct) {
           renderProductDetailContent(featuredProduct);
      } else {
          showMessage(productDetailLoadingMessageDiv, 'fa-exclamation-triangle', 'Product details not found.', 'warning');
      }
    }
  } catch (error) {
    console.error('Error fetching product details:', error);
    showMessage(productDetailLoadingMessageDiv,'fa-times-circle', `Failed to load product details: ${error.message}`, 'danger');
  }
}

function renderProductDetailContent(product) {
  if (!product) {
    productDetailContentDiv.classList.add('hidden');
    categoryDiv.classList.add('hidden');
    return;
  }

  document.getElementById('detail-imageUrl').src = product.imageUrl || 'https://via.placeholder.com/400x450?text=No+Image';
  document.getElementById('detail-name').textContent = product.name;
  document.getElementById('detail-category').innerHTML = `<i class="fas fa-tag mr-1"></i> ${product.category || 'Uncategorized'}`;
  document.getElementById('detail-description').textContent = product.description || 'No description available.';
  document.getElementById('detail-price').textContent = `Rs.${product.price?.toFixed(2) || 'N/A'}`;
  document.getElementById('quantityInput').value = 1;
   document.getElementById('stock').textContent=`stock : `+product.stock ||'no stock available';
  document.getElementById('addToCartBtn').onclick = () => addToCart(product);

  productDetailContentDiv.classList.remove('hidden');
  categoryDiv.classList.add('hidden');
}

function hideProductDetail() {
  productDetailView.classList.add('hidden');
  productListSection.classList.remove('hidden');
  categoryDiv.classList.remove('hidden');
}

function changeQty(delta) {
  const input = document.getElementById('quantityInput');
  let qty = parseInt(input.value);
  qty = isNaN(qty) ? 1 : qty + delta;
  input.value = qty < 1 ? 1 : qty;
}

// Updated addToCart function to send all parameters
async function addToCart(product) {
  const quantity = parseInt(document.getElementById('quantityInput').value);
  const userData = localStorage.getItem('userData');

  if (!userData) {
    alert('Please login to add items to your cart.');
    return;
  }
  let parseData = JSON.parse(userData);
  const totalPrice = product.price * quantity;

  try {
    const res = await fetch(ADD_TO_CART_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: parseData.name, // Assuming userData has an 'id'
        productId: product.id,
        price: product.price,
        quantity: quantity,
    
      })
    });
 
    if (!res.ok) {
      const rawtext = await res.text();
      console.log("raw backend "+ rawtext);
      const errorText = await res.text();
      throw new Error("Server error: " + res.status + " - " + errorText);
    }
    const data = await res.json();
      alert(data.message );
    

  } catch (err) {
    console.error("Cart error:", err);
    alert("Failed to add to cart: " + err.message);
  }
}

// --- New functions for Cart View ---
// --- Real World Style Cart UI with Full Quantity Update Fix ---

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `fixed top-5 right-5 z-50 px-4 py-2 rounded-lg text-white font-semibold shadow-lg animate-fade-in-up transition-all duration-300 ${
    type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-yellow-600'}`;
  toast.innerText = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

async function renderCartItems(userName) {
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartTotalContainer = document.getElementById('cartTotalContainer');
  const emptyCartMessage = document.getElementById('emptyCartMessage');

  cartItemsContainer.innerHTML = `<div class="text-center py-20 text-yellow-500 animate-pulse">
    <i class="fas fa-spinner fa-spin text-5xl mb-2"></i>
    <p class="mt-2 text-lg font-semibold">Fetching your cart...</p>
  </div>`;
  cartTotalContainer.classList.add('hidden');
  emptyCartMessage.classList.add('hidden');

  try {
    const response = await fetch(`${VIEW_CART_API_URL}?userName=${userName}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const cartItems = await response.json();

    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = `<div class='text-center py-16 text-gray-500'>
        <img src='https://cdn-icons-png.flaticon.com/512/2038/2038854.png' class='mx-auto mb-4 w-20 h-20 opacity-70'/>
        <p class='text-lg font-medium'>Oops! Your cart is empty.</p>
        <a href='#' onclick='showProductsPage()' class='mt-3 inline-block px-5 py-2 text-sm bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition'>Browse Products</a>
      </div>`;
      return;
    }

    let totalPrice = 0;
    cartItemsContainer.innerHTML = '';

    cartItems.forEach(item => {
      const itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;

      const cartItemHtml = `
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 mb-4 rounded-xl bg-white border border-gray-200 shadow hover:shadow-lg transition duration-200">
          <div class="flex items-center gap-4">
            <img src="${item.imageUrl || 'https://via.placeholder.com/100x100?text=No+Image'}" alt="${item.name}" class="w-24 h-24 object-cover rounded-lg border">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">${item.name}</h3>
              <p class="text-sm text-gray-500 mb-1">Category: ${item.category || 'N/A'}</p>
              <div class="flex items-center gap-2 text-sm">
                <span class="text-gray-400 line-through">₹${(item.price * 1.2).toFixed(2)}</span>
                <span class="text-green-600 font-semibold">₹${item.price.toFixed(2)}</span>
                <span class="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">20% off</span>
              </div>
              <div class="flex items-center gap-2 mt-3">
                <button class="w-8 h-8 bg-gray-100 text-gray-700 rounded hover:bg-gray-200" onclick="updateQuantity('${item.productId}', -1)">−</button>
                <span id="qty-${item.productId}" class="px-4 font-medium">${item.quantity}</span>
                <button class="w-8 h-8 bg-gray-100 text-gray-700 rounded hover:bg-gray-200" onclick="updateQuantity('${item.productId}', 1)">+</button>
              </div>
            </div>
          </div>
          <div class="text-right space-y-2">
            <p class="text-lg font-bold text-yellow-700">₹${itemTotal.toFixed(2)}</p>
            <button class="text-sm text-red-600 hover:underline" onclick="removeFromCart('${item.productId}')">
              <i class="fas fa-trash-alt mr-1"></i>Remove
            </button>
          </div>
        </div>
      `;
      cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHtml);
    });

    document.getElementById('cartTotalPrice').textContent = `₹${totalPrice.toFixed(2)}`;
    cartTotalContainer.classList.remove('hidden');

  } catch (error) {
    console.error('Cart error:', error);
    cartItemsContainer.innerHTML = `<div class="text-center py-20 text-red-600">
      <i class="fas fa-exclamation-circle text-5xl mb-2"></i>
      <p class="text-lg font-medium">Could not load your cart. Please try again later.</p>
    </div>`;
  }
}
async function updateQuantity(productId, change) {
  const qtySpan = document.getElementById(`qty-${productId}`);
  if (!qtySpan) {
    console.error(`Quantity element not found for productId: ${productId}`);
    showToast('UI element not found', 'error');
    return;
  }

  let currentQty = parseInt(qtySpan.textContent);
  const newQty = currentQty + change;
  if (newQty < 1) return;

  const item = (filteredProducts || []).find(p => p.id == productId);
  if (!item) {
    console.error(`Product data missing for productId: ${productId}`);
    showToast('Product data missing!', 'error');
    return;
  }

  qtySpan.classList.add('animate-pulse');

  try {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || !userData.name) {
      showToast('User not logged in or session expired', 'error');
      return;
    }

    const response = await fetch(`${ADD_TO_CART_API_URL}`, {
      method: 'PUT',  // ✅ changed from POST to PUT
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userData.name,       // This should be user_name, matched in servlet
        productId: productId,
        quantity: newQty,
        price: item.price
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const result = await response.json();
    showToast(result.message || 'Quantity updated');
    renderCartItems(userData.name);

  } catch (err) {
    console.error('Failed to update quantity:', err);
    showToast('Failed to update quantity', 'error');
  } finally {
    qtySpan.classList.remove('animate-pulse');
  }
}


async function removeFromCart(productId) {
  try {
    const userData = JSON.parse(localStorage.getItem('userData'));
    await fetch(`${ADD_TO_CART_API_URL}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userData.name, productId })
    });
    showToast('Item removed from cart', 'warning');
    renderCartItems(userData.name);
  } catch (err) {
    showToast('Failed to remove item', 'error');
  }
}

// --- Event Listeners ---
productSearchInput.addEventListener('input', (event) => {
    currentSearchTerm = event.target.value.trim();
    applyFilters();
});



// request module
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("customDesignForm");
    const submitBtn = document.getElementById("submitBtn");
    const formMessage = document.getElementById("formMessage");

    const showMessage = (msg, isSuccess) => {
        formMessage.textContent = msg; // ✅ Correct
        alert("Message:"+ msg);

        // Reset classes
        formMessage.className = `mt-6 text-sm font-semibold p-4 rounded-lg ${
            isSuccess ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`;

        formMessage.classList.remove("hidden");
        formMessage.scrollIntoView({ behavior: "smooth" });

        // Auto hide after 5 sec
        setTimeout(() => {
            formMessage.classList.add("hidden");
        }, 5000);
    };

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.innerText = "Submitting...";

        const formData = new FormData(form);

        try {
            const res = await fetch("https://mainprojectapi.onrender.com/userRequest", {
                method: "POST",
                body: formData
            });

            const data = await res.json();

            if (data.success) {
                showMessage("✅ Your custom request has been submitted! We will contact you soon.", true);
                form.reset();
            } else {
                showMessage("❌ Something went wrong. Please try again.", false);
            }
        } catch (err) {
            console.error(err);
            showMessage("❌ Server error. Please try again later.", false);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = "Submit Request";
        }
    });
});

// contact form
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnIcon = document.getElementById('btnIcon');
const formMessage = document.getElementById('formMessage');

function setMessage(text, type = 'info') {
    formMessage.className = 'text-sm p-3 rounded-lg text-center transition-all duration-300 ease-in-out';
    if (type === 'success') {
        formMessage.classList.add('bg-green-800', 'text-green-200');
    } else if (type === 'error') {
        formMessage.classList.add('bg-red-800', 'text-red-200');
    } else {
        formMessage.classList.add('bg-gray-800', 'text-gray-200');
    }
    formMessage.innerHTML = text;
    formMessage.classList.remove('hidden');
}

function clearMessage() {
    formMessage.classList.add('hidden');
}

function setLoading(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        btnIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        btnText.textContent = 'Sending...';
        submitBtn.classList.add('cursor-not-allowed', 'opacity-75');
    } else {
        submitBtn.disabled = false;
        btnIcon.innerHTML = '<i class="fas fa-paper-plane"></i>';
        btnText.textContent = 'Send Message';
        submitBtn.classList.remove('cursor-not-allowed', 'opacity-75');
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessage();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const honeypot = form.website.value;

    if (honeypot) {
        setMessage('Spam detected.', 'error');
        return;
    }
    if (!name || !email || !message) {
        setMessage('Please fill all fields.', 'error');
        return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        setMessage('Please enter a valid email address.', 'error');
        return;
    }

    setLoading(true);

    const payload = { name, email, message };
    try {
        // Simulate a real-world API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Assuming a successful submission for this example
        const res = { ok: true, status: 200 };

        if (res.ok) {
            setMessage('Thank you! Your message has been received. We will reply within 24 hours.', 'success');
            form.reset();
        } else {
            // Simulate a server error response
            setMessage('Server error. Please try again later.', 'error');
        }
    } catch(err) {
        setMessage('Network error. Please check your connection and try again.', 'error');
    } finally {
        setLoading(false);
    }
     })
    //create check out page


// document.getElementById('checkoutForm').addEventListener('submit', async function(event) {
//   event.preventDefault();
//   const errorMessage = document.getElementById('checkout-error-message');
//   errorMessage.textContent = '';
  
//   // --- Step 1: Initialize Stripe with your Publishable Key ---
//   // This uses the Publishable Key you copied.
//   const stripe = Stripe('pk_test_51RwjSDEgOdLsD61ePXI7WM9rM3TaEVekqTb268skgylSKRZLD9pdvzfKOOv0HZ5jgW5KHZluNjTApJMA5GEtjlpj00kt5PAkkn'); // ⚠️ PASTE YOUR PUBLISHABLE KEY HERE

//   // Collect form data to send to your backend
//   const form = event.target;
//   const formData = new FormData(form);
//   const orderData = {};
//   formData.forEach((value, key) => { orderData[key] = value; });
  
//   const userData = JSON.parse(localStorage.getItem('userData'));
//   if (userData && userData.name) {
//     orderData.userName = userData.name;
//   }

//   const totalText = document.getElementById('checkoutTotalPrice').textContent;
//   orderData.totalAmount = parseFloat(totalText.replace('₹', ''));
  
//   try {
//     // Step 2: Call your NEW backend servlet to create a Stripe session
//     const response = await fetch('http://localhost:8081/MainProjectApis/create-stripe-session', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(orderData) 
//     });

//     const session = await response.json();

//     if (session.error) {
//         throw new Error(session.error);
//     }

//     // Step 3: Use Stripe.js to redirect your user to the secure Stripe payment page
//     const result = await stripe.redirectToCheckout({
//       sessionId: session.id
//     });

//     if (result.error) {
//       // If `redirectToCheckout` fails, this will display the error.
//       throw new Error(result.error.message);
//     }
//   } catch(error) {
//       console.error(error);
//       errorMessage.textContent = error.message;
//       alert(`Error: ${error.message}`);
//   }
// });
//confirm page
// DELETE your old 'checkoutForm' listener and ADD these two new ones

// 1. This listener now just shows the confirmation page.
document.getElementById('checkoutForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent page from reloading
    showConfirmationPage();
});


document.getElementById('reviewOrderBtn').addEventListener('click', function() {
    // This calls the function that copies details to the confirmation page
    showConfirmationPage();
});

document.getElementById('reviewOrderBtn').addEventListener('click', function() {
    showConfirmationPage();
});

// payment btn
document.getElementById('proceedToPaymentBtn').addEventListener('click', async function() {
    
    const stripe = Stripe('pk_test_51RwjSDEgOdLsD61ePXI7WM9rM3TaEVekqTb268skgylSKRZLD9pdvzfKOOv0HZ5jgW5KHZluNjTApJMA5GEtjlpj00kt5PAkkn'); // ⚠️ PASTE YOUR PUBLISHABLE KEY
    
    try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData || !userData.name) {
            throw new Error("User not logged in");
        }

        // --- Step 1: Fetch the cart items ---
        console.log("Fetching cart items...");
        const cartResponse = await fetch(`https://mainprojectapi.onrender.com/viewCart?userName=${userData.name}`);
        if (!cartResponse.ok) {
            throw new Error("Failed to fetch cart from API.");
        }
        const cartItems = await cartResponse.json();
        console.log("Cart items fetched:", cartItems); // DEBUG: Check if cart items are correct

        if (!cartItems || cartItems.length === 0) {
            throw new Error("Cannot proceed with an empty cart.");
        }
        
        // --- Step 2: Add cartItems to the finalOrderData object ---
        // 'finalOrderData' is the global variable created by showConfirmationPage()
        finalOrderData.cartItems = cartItems;

        // --- Step 3: Log the final data and send it to the backend ---
        console.log("Final data being sent to servlet:", JSON.stringify(finalOrderData, null, 2)); // DEBUG: This is the most important log!

        const response = await fetch('https://mainprojectapi.onrender.com/create-stripe-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalOrderData) // Send the combined data
        });
        
        const session = await response.json();

        if (session.error) { 
            throw new Error(session.error); 
        }

        const result = await stripe.redirectToCheckout({ sessionId: session.id });

        if (result.error) { 
            throw new Error(result.error.message); 
        }

    } catch(error) {
        console.error(error); // This will now show the detailed error
        alert(`Payment Error: ${error.message}`);
    }
});
// order page
async function showMyOrdersPage() {
  hideAllContentSections();
  myOrdersSection.classList.remove('hidden');
  window.scrollTo({ top: myOrdersSection.offsetTop, behavior: 'smooth' });

  const userData = JSON.parse(localStorage.getItem('userData'));
  const ordersContainer = document.getElementById('orders-list-container');
  const loadingMessage = document.getElementById('orders-loading-message');
  const noOrdersMessage = document.getElementById('no-orders-message');

  loadingMessage.classList.remove('hidden');
  noOrdersMessage.classList.add('hidden');
  ordersContainer.innerHTML = '';
  ordersContainer.appendChild(loadingMessage);

  if (!userData || !userData.name) {
    alert("Please log in to view your orders.");
    showHomePage();
    return;
  }

  try {
    const response = await fetch(`https://mainprojectapi.onrender.com/viewOrders?userName=${userData.name}`);
    const orders = await response.json();

    loadingMessage.classList.add('hidden');

    if (orders.length === 0) {
      noOrdersMessage.classList.remove('hidden');
    } else {
      orders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'bg-white border border-gray-200 rounded-lg p-6 shadow-sm';
        
        let statusColorClasses = 'bg-yellow-100 text-yellow-800'; // Default for Pending
        if (order.status.toLowerCase() === 'shipped') {
            statusColorClasses = 'bg-blue-100 text-blue-800';
        } else if (order.status.toLowerCase() === 'delivered') {
            statusColorClasses = 'bg-green-100 text-green-800';
        } else if (order.status.toLowerCase() === 'cancelled') {
            statusColorClasses = 'bg-red-100 text-red-800';
        }
        
        // --- THIS IS THE CRITICAL PART THAT ADDS THE BUTTON ---
        let actionButtonHtml = '';
        if (order.status && order.status.toLowerCase() === 'pending') {
            actionButtonHtml = `<div class="mt-4 pt-4 border-t text-right">
                                  <button onclick="cancelOrder(${order.orderId})" 
                                      class="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition">
                                      Cancel Order
                                  </button>
                                </div>`;
        }

        let itemsHtml = '<div class="mt-4 pt-4 border-t border-gray-200 space-y-4">';
        order.items.forEach(item => {
            itemsHtml += `
                <div class="flex items-center gap-4">
                    <img src="${item.imageUrl || 'https://via.placeholder.com/100'}" alt="${item.productName}" class="w-16 h-16 object-cover rounded-md border">
                    <div>
                        <p class="font-semibold text-gray-800">${item.productName}</p>
                        <p class="text-sm text-gray-500">Quantity: ${item.quantity}</p>
                    </div>
                </div>
            `;
        });
        itemsHtml += '</div>';

        orderCard.innerHTML = `
          <div class="flex flex-col md:flex-row justify-between md:items-center">
            <div>
              <p class="text-lg font-bold text-gray-800">Order #${order.orderId}</p>
              <p class="text-sm text-gray-500">Placed on: ${order.orderDate}</p>
            </div>
            <div class="mt-4 md:mt-0 text-left md:text-right">
              <p class="text-xl font-bold text-gray-900">₹${(order.totalAmount || 0).toFixed(2)}</p>
              <span class="mt-1 inline-block px-3 py-1 text-sm font-semibold rounded-full ${statusColorClasses}">${order.status}</span>
            </div>
          </div>
          ${itemsHtml}
          ${actionButtonHtml}
        `;
        ordersContainer.appendChild(orderCard);
      });
    }
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    loadingMessage.classList.add('hidden');
    ordersContainer.innerHTML = '<p class="text-center text-red-600">Could not load orders. Please try again later.</p>';
  }
}
//cancel order page
window.cancelOrder = async (orderId) => {
    // 1. Show a confirmation box to prevent accidental clicks
    if (!confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
        return; // Stop the function if the user clicks "Cancel"
    }

    try {
        // 2. Get the logged-in user's data
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData || !userData.name) {
            throw new Error("You must be logged in to cancel an order.");
        }

        // 3. Send the request to your backend servlet
        const response = await fetch('https://mainprojectapi.onrender.com/cancelOrder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                orderId: orderId,
                userName: userData.name // Send both orderId and userName for security
            })
        });

        const result = await response.json();

        // 4. Handle the response from the servlet
        if (result.status === 'success') {
            alert(result.message);
            showMyOrdersPage(); // Refresh the orders list to show the new "Cancelled" status
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error("Failed to cancel order:", error);
        alert(`Error: ${error.message}`);
    }
};
