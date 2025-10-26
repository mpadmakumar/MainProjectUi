
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
function setActiveNav(linkText) {
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    link.classList.remove('active'); // clear old
  });

  const activeLink = Array.from(links).find(link => link.textContent.trim() === linkText);
  if (activeLink) {
    activeLink.classList.add('active');
  }
}

function showAboutPage() {
  hideAllContentSections();
  aboutSection.classList.remove('hidden');
  window.scrollTo({ top: aboutSection.offsetTop, behavior: 'smooth' });
   localStorage.setItem('lastSection', 'about');
   setActiveNav("About");
}
function showContactPage() {
  hideAllContentSections();
  contactSection.classList.remove('hidden');
  window.scrollTo({ top: contactSection.offsetTop, behavior: 'smooth' });
   localStorage.setItem('lastSection', 'contact');
   setActiveNav("Contact");
}

function showCustomDesigntPage() {
  hideAllContentSections();
    customDesign.classList.remove('hidden');
  window.scrollTo({ top:  customDesign.offsetTop, behavior: 'smooth' });
   localStorage.setItem('lastSection', 'customDesign');
 }
function showHomePage() {
  hideAllContentSections();
  heroSection.classList.remove('hidden');
  categoriesSection.classList.remove('hidden');
  featuredProductsSection.classList.remove('hidden');
  //aboutSection.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
   localStorage.setItem('lastSection', 'home');
   setActiveNav("Home");
}
async function showCheckOutPage() {
  hideAllContentSections();
  CheckOutSection.classList.remove("hidden");
  window.scrollTo({ top: CheckOutSection.offsetTop, behavior: "smooth" });
  localStorage.setItem("lastSection", "checkout");

  const userData = JSON.parse(localStorage.getItem("userData"));
  if (!userData || !userData.name) {
    alert("Please login to proceed to checkout.");
    showHomePage(); // Redirect if not logged in
    return;
  }

  // 🆕 Restore saved checkout data if exists (for Go Back & Edit)
  const savedData = JSON.parse(localStorage.getItem('checkoutData'));
  if (savedData) {
    document.getElementById("checkoutCustomerName").value = savedData.customerName || '';
    document.getElementById("checkoutAddress").value = savedData.address || '';
    document.getElementById("checkoutCity").value = savedData.city || '';
    document.getElementById("checkoutPincode").value = savedData.pincode || '';
    document.getElementById("checkoutMobile").value = savedData.mobileNumber || '';

    // Restore selected payment method
    if (savedData.paymentMethod) {
      const paymentRadio = document.querySelector(`input[name="paymentMethod"][value="${savedData.paymentMethod}"]`);
      if (paymentRadio) paymentRadio.checked = true;
    }
  } else {
    // 🆕 Reset form + payment method if no saved data
    document.getElementById("checkoutForm").reset();
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked');
    if (selectedMethod) selectedMethod.checked = false;
  }

  // Fetch cart items to calculate total and show summary
  try {
    const response = await fetch(`${VIEW_CART_API_URL}?userName=${userData.name}`);
    if (!response.ok) throw new Error("Failed to load cart for summary.");
    const cartItems = await response.json();

    if (cartItems.length === 0) {
      alert("Your cart is empty. Add items before checking out.");
      showCartPage(); // Go back to cart if it's empty
      return;
    }

    let totalPrice = 0;
    const summaryContainer = document.getElementById("checkoutOrderSummary");
    summaryContainer.innerHTML = ""; // Clear loading message

    cartItems.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;
      const summaryItemHtml = `
        <div class="flex justify-between items-center text-sm">
          <span class="text-gray-600">${item.name} (x${item.quantity})</span>
          <span class="font-medium text-gray-800">₹${itemTotal.toFixed(2)}</span>
        </div>
      `;
      summaryContainer.insertAdjacentHTML("beforeend", summaryItemHtml);
    });

    document.getElementById("checkoutSubtotal").textContent = `₹${totalPrice.toFixed(2)}`;
    document.getElementById("checkoutTotalPrice").textContent = `₹${totalPrice.toFixed(2)}`;

  } catch (error) {
    console.error("Checkout summary error:", error);
    document.getElementById("checkoutOrderSummary").innerHTML =
      '<p class="text-red-500">Could not load order summary.</p>';
  }
}


 // ADD THIS NEW FUNCTION to index.js
function showConfirmationPage() {
    hideAllContentSections();
    confirmationSection.classList.remove('hidden');
    window.scrollTo({ top: confirmationSection.offsetTop, behavior: 'smooth' });
    localStorage.setItem('lastSection', 'confirmation');

    // 1. Get data from the checkout form
    const customerName = document.getElementById('checkoutCustomerName').value;
    const address = document.getElementById('checkoutAddress').value;
    const city = document.getElementById('checkoutCity').value;
    const pincode = document.getElementById('checkoutPincode').value;
    const mobileNumber = document.getElementById('checkoutMobile').value;
    const totalText = document.getElementById('checkoutTotalPrice').textContent;

    // 🆕 2. Get selected payment method
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked');
    let paymentText = "Not Selected";
    if (selectedMethod) {
        paymentText = selectedMethod.value === "cod"
            ? "Cash on Delivery"
            : "Online Payment (UPI / Wallet / Card)";
    }

    // 3. Display the data on the confirmation page
    document.getElementById('confirm-name').textContent = customerName;
    document.getElementById('confirm-address').textContent = address;
    document.getElementById('confirm-city-pincode').textContent = `${city} - ${pincode}`;
    document.getElementById('confirm-mobile').textContent = `Mobile: ${mobileNumber}`;
    document.getElementById('confirm-subtotal').textContent = totalText;
    document.getElementById('confirm-total').textContent = totalText;
    document.getElementById('confirm-payment').textContent = paymentText;

    // 4. Store the data in our global variable to use for payment
    finalOrderData = {
        customerName,
        address,
        city,
        pincode,
        mobileNumber,
        totalAmount: parseFloat(totalText.replace('₹', '')),
        paymentMethod: selectedMethod ? selectedMethod.value : null
    };

    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.name) {
        finalOrderData.userName = userData.name;
    }

    // 🆕 5. Save checkout data to localStorage to retain on Go Back
    const checkoutData = {
        customerName,
        address,
        city,
        pincode,
        mobileNumber,
        paymentMethod: selectedMethod ? selectedMethod.value : null
    };
    localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
}

function showProductsPage() {
  hideAllContentSections();
  allProductsContainer.classList.remove('hidden');
  productListSection.classList.remove('hidden');
  productDetailView.classList.add('hidden');
  window.scrollTo({ top: allProductsContainer.offsetTop, behavior: 'smooth' });
  localStorage.setItem('lastSection', 'products');
  setActiveNav("Products");
}

function showCartPage() {
  hideAllContentSections();
  cartView.classList.remove('hidden');
  window.scrollTo({ top: cartView.offsetTop, behavior: 'smooth' });
  localStorage.setItem('lastSection', 'cart');
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
  localStorage.setItem('lastSection', 'userProfile');
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
    localStorage.setItem('userDetails', JSON.stringify(originalData));
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

function toggleButtons(editing) {
  editBtn.classList.toggle('hidden', editing);
  saveBtn.classList.toggle('hidden', !editing);
  cancelBtn.classList.toggle('hidden', !editing);
}

// Edit mode
editBtn.addEventListener('click', () => {
  originalData = {};
  profileDetails.querySelectorAll('[data-field]').forEach(p => {
    const value = p.textContent;
    originalData[p.dataset.field] = value;
    p.outerHTML = `<input type="text" name="${p.dataset.field}" value="${value}" 
      class="border border-gray-300 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-yellow-400 transition" />`;
  });
  toggleButtons(true);
});

// Save profile
saveBtn.addEventListener('click', () => {
  const updatedData = {};
  profileDetails.querySelectorAll('input').forEach(input => {
    updatedData[input.name] = input.value;
    input.outerHTML = `<p class="text-lg font-medium text-gray-800" data-field="${input.name}">${input.value}</p>`;
  });
  toggleButtons(false);

  // 🔗 Call backend API
  fetch("https://mainprojectapi.onrender.com/UserProfileUpdate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData)
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("✅ Profile updated successfully!");
      } else {
        alert("❌ Update failed: " + data.message);
      }
    })
    .catch(err => {
      console.error("Error updating profile:", err);
      alert("⚠️ Server error while updating profile");
    });
});

// Cancel editing
cancelBtn.addEventListener('click', () => {
  profileDetails.querySelectorAll('input').forEach(input => {
    input.outerHTML = `<p class="text-lg font-medium text-gray-800" data-field="${input.name}">${originalData[input.name]}</p>`;
  });
  toggleButtons(false);
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
    <a href="#" onclick="showMyOrdersPage()" class="block py-3 px-6 text-gray-700 hover:bg-yellow-50 flex items-center"><i class="fas fa-box mr-3"></i>My Orders</a>
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
   localStorage.setItem('lastSection', 'productDetail');
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
  document.getElementById('stock').setAttribute("data-stock", product.stock || 0);
  document.getElementById('addToCartBtn').onclick = () => addToCart(product);

  productDetailContentDiv.classList.remove('hidden');
  categoryDiv.classList.add('hidden');
}

function changeQty(delta) {
  const input = document.getElementById('quantityInput');
  let qty = parseInt(input.value);
  let stock = parseInt(document.getElementById('stock').getAttribute("data-stock")); // stock from attribute

  qty = isNaN(qty) ? 1 : qty + delta;

  // quantity should not exceed stock
  if (qty > stock) {
    qty = stock;
  }

  // quantity should not go below 1
  if (qty < 1) {
    qty = 1;
  }

  input.value = qty;
}

function hideProductDetail() {
  productDetailView.classList.add('hidden');
  productListSection.classList.remove('hidden');
  categoryDiv.classList.remove('hidden');
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
// document.addEventListener("DOMContentLoaded", () => {
//     const form = document.getElementById("customDesignForm");
//     const submitBtn = document.getElementById("submitBtn");
//     const formMessage = document.getElementById("formMessage");
//     const deliveryDateInput = document.getElementById("deliveryDate"); 

//     // ✅ Load saved user data
//     const savedData = JSON.parse(localStorage.getItem('userDetails'));

//     if(savedData){
//         document.getElementById("emailid").value = savedData.email || '';
//         document.getElementById("phone").value = savedData.phone || '';
//         document.getElementById("uName").value = savedData.username || savedData.fullName || '';
//     }

//     const showMessage = (msg, isSuccess) => {
//         formMessage.textContent = msg;
//         alert("Message: " + msg); 

//         formMessage.className = `mt-6 text-sm font-semibold p-4 rounded-lg ${
//             isSuccess ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
//         }`;
//         formMessage.classList.remove("hidden");
//         formMessage.scrollIntoView({ behavior: "smooth" });

//         setTimeout(() => {
//             formMessage.classList.add("hidden");
//         }, 5000);
//     };

//     form.addEventListener("submit", async (e) => {
//         e.preventDefault();

//         // 🔒 Step 1: Check login (username must exist in localStorage)
//         if (!savedData || !savedData.username) {
//             showMessage("❌ Please login to submit your request.", false);
//             return; // Stop here if not logged in
//         }

//         // --- 📅 Step 2: Validate Delivery Date ---
//         const selectedDateValue = deliveryDateInput.value;
//         if (!selectedDateValue) {
//             showMessage("❌ Please select a delivery date.", false);
//             return;
//         }

//         const selectedDate = new Date(selectedDateValue);
//         const today = new Date();
//         today.setHours(0, 0, 0, 0); 

//         if (selectedDate <= today) {
//             showMessage("❌ Please select a future date. Today or past dates are not allowed.", false);
//             return;
//         }

//         // --- Step 3: Submit Request ---
//         submitBtn.disabled = true;
//         submitBtn.innerText = "Submitting...";

//         const formData = new FormData(form);

//         try {
//             const res = await fetch("https://mainprojectapi.onrender.com/userRequest", {
//                 method: "POST",
//                 body: formData
//             });

//             const data = await res.json();

//             if (data.success) {
//                 showMessage("✅ Your custom request has been submitted! We will contact you soon.", true);
//                 form.reset();
//             } else {
//                 showMessage("❌ Something went wrong. Please try again.", false);
//             }
//         } catch (err) {
//             console.error(err);
//             showMessage("❌ Server error. Please try again later.", false);
//         } finally {
//             submitBtn.disabled = false;
//             submitBtn.innerText = "Submit Request";
//         }
//     });
// });
// document.addEventListener("DOMContentLoaded", () => {
//   // Form Elements
//   const form = document.getElementById("customDesignForm");
//   const finalSubmitBtn = document.getElementById("final-submit-btn");
//   const formMessage = document.getElementById("formMessage");
//   const descriptionInput = document.getElementById("description");
//   const fileInput = document.getElementById("image");
  
//   // AI Elements
//   const generateBtn = document.getElementById('generate-and-submit-btn');
//   const modal = document.getElementById('selection-modal');
//   const modalLoader = document.getElementById('modal-loader');
//   const imageOptionsContainer = document.getElementById('image-options');
//   const closeBtn = document.querySelector('.close-btn');
//   const confirmSelectionBtn = document.getElementById('confirm-selection-btn');
//   const aiImagePreviewContainer = document.getElementById('ai-image-preview-container');
//   const aiSelectedImage = document.getElementById('ai-selected-image');

//   // --- 🔑 API Key மற்றும் இறுதி URL ---
//   const HUGGING_FACE_API_KEY =""; // <-- உங்கள் சொந்த கீயை இங்கே பேஸ்ட் செய்யவும்
//   const API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

//   // !!! திருத்தம் 1: 'savedData' வேரியபிள் இங்கே வரையறுக்கப்பட்டுள்ளது !!!
//   const savedData = JSON.parse(localStorage.getItem('userDetails'));
//   if (savedData) {
//       document.getElementById("emailid").value = savedData.email || '';
//       document.getElementById("phone").value = savedData.phone || '';
//       document.getElementById("uName").value = savedData.username || savedData.fullName || '';
//   }

//   const showMessage = (msg, isSuccess) => {
//       formMessage.textContent = msg;
//       formMessage.className = `text-center my-4 text-sm font-semibold p-4 rounded-lg ${
//           isSuccess ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
//       }`;
//       formMessage.classList.remove("hidden");
//   };
  
//   async function queryAPI(prompt) {
//       const response = await fetch(API_URL, {
//           method: 'POST',
//           // !!! திருத்தம் 2: 'Content-Type' ஹெடர் இங்கே சேர்க்கப்பட்டுள்ளது !!!
//           headers: {
//               "Authorization": `Bearer ${HUGGING_FACE_API_KEY}`,
//               "Content-Type": "application/json"
//           },
//           body: JSON.stringify({
//               inputs: prompt,
//               options: { use_cache: false, wait_for_model: true }
//           })
//       });
//       if (!response.ok) {
//           const errorText = await response.text();
//           throw new Error(`API request failed: ${response.statusText} - Details: ${errorText}`);
//       }
//       return response.blob();
//   }

//   generateBtn.addEventListener('click', async (e) => {
//       e.preventDefault();
//       if (!form.reportValidity()) {
//           showMessage("Please fill in all required fields (*).", false);
//           return;
//       }
      
//       modal.classList.remove('hidden');
//       modalLoader.style.display = 'block';
//       imageOptionsContainer.innerHTML = '';
//       confirmSelectionBtn.classList.add('hidden');
//       generateBtn.disabled = true;
//       generateBtn.innerText = "Generating...";

//       const prompt = `A professional high-resolution photograph of a covering jewelry: ${descriptionInput.value.trim()}, intricate details, studio lighting.`;
//       const promises = [queryAPI(prompt), queryAPI(prompt), queryAPI(prompt), queryAPI(prompt)];

//       try {
//           const imageBlobs = await Promise.all(promises);
//           imageBlobs.forEach(blob => {
//               const img = document.createElement('img');
//               img.src = URL.createObjectURL(blob);
//               imageOptionsContainer.appendChild(img);
//           });
//       } catch (error) {
//           console.error("Error generating images:", error);
//           let detailedError = "Please check your API key and ensure you've accepted the model's terms on Hugging Face.";
//           if (error.message.includes('503')) {
//               detailedError = "The AI model is currently loading, please try again in a moment.";
//           }
//           showMessage(`❌ Failed to generate designs. ${detailedError}`, false);
//           modal.classList.add('hidden');
//       } finally {
//           modalLoader.style.display = 'none';
//           confirmSelectionBtn.classList.remove('hidden');
//           generateBtn.disabled = false;
//           generateBtn.innerText = "Generate AI Designs";
//       }
//   });

//   imageOptionsContainer.addEventListener('click', (e) => {
//       if (e.target.tagName === 'IMG') {
//           document.querySelectorAll('#image-options img').forEach(img => img.classList.remove('selected'));
//           e.target.classList.add('selected');
//       }
//   });

//   confirmSelectionBtn.addEventListener('click', async () => {
//       const selectedImg = document.querySelector('#image-options img.selected');
//       if (!selectedImg) {
//           alert("Please select a design.");
//           return;
//       }
//       const response = await fetch(selectedImg.src);
//       const blob = await response.blob();
//       const file = new File([blob], "ai-generated-design.png", { type: "image/png" });
//       const dataTransfer = new DataTransfer();
//       dataTransfer.items.add(file);
//       fileInput.files = dataTransfer.files;

//       aiSelectedImage.src = selectedImg.src;
//       aiImagePreviewContainer.classList.remove('hidden');
      
//       modal.classList.add('hidden');
      
//       finalSubmitBtn.classList.remove('hidden');
//       generateBtn.classList.add('hidden');
//   });
  
//   closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

//   form.addEventListener("submit", async (e) => {
//       e.preventDefault();
//       finalSubmitBtn.disabled = true;
//       finalSubmitBtn.innerText = "Submitting...";
//       const formData = new FormData(form);

//       try {
//           const res = await fetch("http://localhost:8081/MainProjectApis/userRequest", {
//               method: "POST",
//               body: formData
//           });
//           const data = await res.json();
//           if (data.success) {
//               alert("✅ Your custom request has been submitted!", true);
//               form.reset();
//               aiImagePreviewContainer.classList.add('hidden');
//               finalSubmitBtn.classList.add('hidden');
//               generateBtn.classList.remove('hidden');
//           } else {
//               showMessage(`❌ Submission failed: ${data.message}`, false);
//           }
//       } catch (err) {
//           console.error(err);
//           showMessage("❌ Server error. Please try again later.", false);
//       } finally {
//           finalSubmitBtn.disabled = false;
//           finalSubmitBtn.innerText = "Final Submit Request";
//       }
//   });
// });
document.addEventListener("DOMContentLoaded", () => {
  // Form Elements
  const form = document.getElementById("customDesignForm");
  const finalSubmitBtn = document.getElementById("final-submit-btn");
  const formMessage = document.getElementById("formMessage");
  const descriptionInput = document.getElementById("description");
  const fileInput = document.getElementById("image");
  const deliveryDateInput = document.getElementById("deliveryDate");

  // AI Elements
  const generateBtn = document.getElementById("generate-and-submit-btn");
  const modal = document.getElementById("selection-modal");
  const modalLoader = document.getElementById("modal-loader");
  const imageOptionsContainer = document.getElementById("image-options");
  const closeBtn = document.querySelector(".close-btn");
  const confirmSelectionBtn = document.getElementById("confirm-selection-btn");
  const aiImagePreviewContainer = document.getElementById("ai-image-preview-container");
  const aiSelectedImage = document.getElementById("ai-selected-image");

  // --- 🔑 API Key நீக்கப்பட்டது (பாதுகாப்பானது) ---
  // const HUGGING_FACE_API_KEY = ""; // (நீக்கப்பட்டது)
  // const API_URL = "..."; // (நீக்கப்பட்டது)

  // --- !!! உங்கள் Java Backend API URL-கள் !!! ---
  // Vercel-ல் deploy செய்யும்போது 'relative path' பயன்படுத்துவது சிறந்தது.
  const GENERATE_API_URL = "https://mainprojectapi.onrender.com/generateImage"; // <-- 1. இது உங்கள் புதிய Servlet URL
  const SUBMIT_FORM_URL = "https://mainprojectapi.onrender.com/userRequest"; // <-- 2. இது உங்கள் பழைய Servlet URL

  const savedData = JSON.parse(localStorage.getItem("userDetails"));
  if (savedData) {
    document.getElementById("emailid").value = savedData.email || "";
    document.getElementById("phone").value = savedData.phone || "";
    document.getElementById("uName").value =
      savedData.username || savedData.fullName || "";
  }

  const showMessage = (msg, isSuccess) => {
    formMessage.textContent = msg;
    formMessage.className = `text-center my-4 text-sm font-semibold p-4 rounded-lg ${
      isSuccess
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`;
     const selectedDateValue = deliveryDateInput.value;
        if (!selectedDateValue) {
             showMessage("❌ Please select a delivery date.", false);
            return;
        }

         const selectedDate = new Date(selectedDateValue);
         const today = new Date();
         today.setHours(0, 0, 0, 0); 

         if (selectedDate <= today) {
             showMessage("❌ Please select a future date. Today or past dates are not allowed.", false);
           return;
         }
    formMessage.classList.remove("hidden");
  };

  // --- !!! திருத்தப்பட்ட queryAPI Function !!! ---
  // இது இப்போது Hugging Face-ஐ அழைக்காது. இது உங்கள் Java Backend-ஐ அழைக்கும்.
  async function queryAPI(prompt) {
    const response = await fetch(GENERATE_API_URL, { // <-- Java Servlet URL
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // நாம் prompt-ஐ JSON ஆக சர்வருக்கு அனுப்புகிறோம்
      body: JSON.stringify({
        inputs: prompt,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API request to *your server* failed: ${response.statusText} - Details: ${errorText}`
      );
    }
    // உங்கள் சர்வரில் இருந்து படம் blob ஆகத் திரும்ப வரும்
    return response.blob();
  }

  generateBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) {
      showMessage("Please fill in all required fields (*).", false);
      return;
    }

    modal.classList.remove("hidden");
    modalLoader.style.display = "block";
    imageOptionsContainer.innerHTML = "";
    confirmSelectionBtn.classList.add("hidden");
    generateBtn.disabled = true;
    generateBtn.innerText = "Generating...";

    const prompt = `A professional high-resolution photograph of a covering jewelry: ${descriptionInput.value.trim()}, intricate details, studio lighting.`;
    
    // இந்த லாஜிக் மாறாது. இது இப்போது உங்கள் சர்வரை 4 முறை அழைக்கும்.
    const promises = [
      queryAPI(prompt),
      queryAPI(prompt),
      queryAPI(prompt),
      queryAPI(prompt),
    ];

    try {
      const imageBlobs = await Promise.all(promises);
      imageBlobs.forEach((blob) => {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(blob);
        imageOptionsContainer.appendChild(img);
      });
    } catch (error) {
      console.error("Error generating images:", error);
      let detailedError =
        "Failed to contact your server. Please check the backend logs.";
      if (error.message.includes("503")) {
        detailedError =
          "The AI model (via backend) is loading, please try again.";
      }
      showMessage(`❌ Failed to generate designs. ${detailedError}`, false);
      modal.classList.add("hidden");
    } finally {
      modalLoader.style.display = "none";
      confirmSelectionBtn.classList.remove("hidden");
      generateBtn.disabled = false;
      generateBtn.innerText = "Generate AI Designs";
    }
  });

  // --- மீதமுள்ள கோட் எதுவும் மாறவில்லை ---

  imageOptionsContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG") {
      document
        .querySelectorAll("#image-options img")
        .forEach((img) => img.classList.remove("selected"));
      e.target.classList.add("selected");
    }
  });

  confirmSelectionBtn.addEventListener("click", async () => {
    const selectedImg = document.querySelector("#image-options img.selected");
    if (!selectedImg) {
      alert("Please select a design.");
      return;
    }
    const response = await fetch(selectedImg.src);
    const blob = await response.blob();
    const file = new File([blob], "ai-generated-design.png", {
      type: "image/png",
    });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;

    aiSelectedImage.src = selectedImg.src;
    aiImagePreviewContainer.classList.remove("hidden");

    modal.classList.add("hidden");

    finalSubmitBtn.classList.remove("hidden");
    generateBtn.classList.add('hidden');
  });

  closeBtn.addEventListener("click", () => modal.classList.add("hidden"));

  // --- !!! திருத்தப்பட்ட Form Submit !!! ---
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    finalSubmitBtn.disabled = true;
    finalSubmitBtn.innerText = "Submitting...";
    const formData = new FormData(form);

    try {
      // Vercel-ல் வேலை செய்ய, 'localhost' URL-ஐப் பயன்படுத்த வேண்டாம்.
      const res = await fetch(SUBMIT_FORM_URL, { // <-- Java Servlet URL
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Your custom request has been submitted!", true);
        form.reset();
        aiImagePreviewContainer.classList.add("hidden");
        finalSubmitBtn.classList.add("hidden");
        generateBtn.classList.remove("hidden");
      } else {
        showMessage(`❌ Submission failed: ${data.message}`, false);
      }
    } catch (err) {
      console.error(err);
      showMessage("❌ Server error. Please try again later.", false);
    } finally {
      finalSubmitBtn.disabled = false;
      finalSubmitBtn.innerText = "Final Submit Request";
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
const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
paymentRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        const proceedBtn = document.getElementById('proceedToPaymentBtn');
        if (this.value === 'cod') {
            proceedBtn.textContent = "Proceed to Order";
        } else {
            proceedBtn.textContent = "Proceed to Payment";
        }
    });
});
// document.getElementById('proceedToPaymentBtn').addEventListener('click', async function() {
//     try {
//         const userData = JSON.parse(localStorage.getItem('userData'));
//         if (!userData || !userData.name) {
//             throw new Error("User not logged in");
//         }

//         // --- Step 0: Payment Method select check ---
//         const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked');
//         if (!selectedMethod) {
//             alert("Please select a payment method!");
//             return;
//         }
//         finalOrderData.paymentMethod = selectedMethod.value; // "cod" or "online"

//         // --- Step 1: Fetch cart items ---
//         const cartResponse = await fetch(`http://localhost:8081/MainProjectApis/viewCart?userName=${userData.name}`);
//         if (!cartResponse.ok) throw new Error("Failed to fetch cart from API.");
//         const cartItems = await cartResponse.json();
//         if (!cartItems || cartItems.length === 0) throw new Error("Cannot proceed with an empty cart.");
//         finalOrderData.cartItems = cartItems;

//         // Save order data locally (success page use)
//         localStorage.setItem('finalOrderDataForFulfillment', JSON.stringify(finalOrderData));

//         // --- Step 2: Payment Method Flow ---
//         if (finalOrderData.paymentMethod === "cod") {
//             // ✅ COD Flow with loader only
//             document.getElementById("loading").style.display = "block"; // show loader


//             const codResponse = await fetch("http://localhost:8081/MainProjectApis/placeOrder", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(finalOrderData) 
//             });

//             const result = await codResponse.json();

//             document.getElementById("loading").style.display = "none"; // hide loader

//             if (!codResponse.ok) {
//                 throw new Error(result.message || "Failed to place COD order.");
//             }

//             if (result.status === 'success' && result.redirectUrl) {
//                 // direct redirect to success page
//                 window.location.href = result.redirectUrl;
//             } else {
//                 throw new Error('Order placed, but redirect failed.');
//             }

//         } else {
//             // ✅ Online Payment (Cashfree)
//             const response = await fetch('http://localhost:8081/MainProjectApis/create-cashfree-session', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(finalOrderData)
//             });

//             const sessionData = await response.json();
//             if (sessionData.error) throw new Error(sessionData.error);
//             const paymentSessionId = sessionData.payment_session_id;
//             if (!paymentSessionId) throw new Error("Failed to get payment_session_id from the server.");

//             const cashfree = new Cashfree({ mode: "sandbox" });
//             cashfree.checkout({
//                 paymentSessionId: paymentSessionId,
//                 redirectTarget: "_self"
//             });
//         }

//     } catch (error) {
//         console.error(error);
//         document.getElementById("loading").style.display = "none"; // hide loader on error
//         alert(`Payment Error: ${error.message}`);
//     }
// });



// order page
// 🟢 START: UPI Modal Elements (புதியதாக சேர்க்கவும்)
const upiModal = document.getElementById('upi-qr-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const finalUpiSubmitBtn = document.getElementById('final-upi-submit-btn');
const upiTransactionIdInput = document.getElementById('upi-transaction-id');
const upiPayableAmount = document.getElementById('upi-payable-amount');


// 🟢 START: Listener to close the UPI modal (புதியதாக சேர்க்கவும்)
closeModalBtn.addEventListener('click', () => {
    upiModal.style.display = 'none';
});


// 🔴 உங்கள் பழைய 'showCheckOutPage' ஃபங்ஷனை இதைக் கொண்டு மாற்றவும்
async function showCheckOutPage() {
    hideAllContentSections();
    const CheckOutSection = document.getElementById('checkout-section');
    CheckOutSection.classList.remove("hidden");
    window.scrollTo({ top: CheckOutSection.offsetTop, behavior: "smooth" });
    localStorage.setItem("lastSection", "checkout");

    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData || !userData.name) {
        alert("Please login to proceed to checkout.");
        showHomePage(); // Redirect if not logged in
        return;
    }

    const savedData = JSON.parse(localStorage.getItem('checkoutData'));
    if (savedData) {
        document.getElementById("checkoutCustomerName").value = savedData.customerName || '';
        document.getElementById("checkoutAddress").value = savedData.address || '';
        document.getElementById("checkoutCity").value = savedData.city || '';
        document.getElementById("checkoutPincode").value = savedData.pincode || '';
        document.getElementById("checkoutMobile").value = savedData.mobileNumber || '';

        if (savedData.paymentMethod) {
            const paymentRadio = document.querySelector(`input[name="paymentMethod"][value="${savedData.paymentMethod}"]`);
            if (paymentRadio) paymentRadio.checked = true;
        }
    } else {
        document.getElementById("checkoutForm").reset();
        document.querySelector('input[name="paymentMethod"][value="cod"]').checked = true; // Default to COD
    }

    try {
        const VIEW_CART_API_URL = 'https://mainprojectapi.onrender.com/viewCart';
        const response = await fetch(`${VIEW_CART_API_URL}?userName=${userData.name}`);
        if (!response.ok) throw new Error("Failed to load cart for summary.");
        const cartItems = await response.json();

        let subtotal = 0; // Renamed variable for clarity
        const summaryContainer = document.getElementById("checkoutOrderSummary");
        summaryContainer.innerHTML = "";

        cartItems.forEach((item) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            const summaryItemHtml = `
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-600">${item.name} (x${item.quantity})</span>
                <span class="font-medium text-gray-800">₹${itemTotal.toFixed(2)}</span>
              </div>
            `;
            summaryContainer.insertAdjacentHTML("beforeend", summaryItemHtml);
        });
        
        // --- 🟢 GST Calculation Added Here 🟢 ---

        // 1. Define the GST rate (3%)
        const gstRate = 0.03;

        // 2. Calculate the GST amount
        const gstAmount = subtotal * gstRate;

        // 3. Calculate the final grand total
        const grandTotal = subtotal + gstAmount;

        // 4. Display all three values in the HTML
        document.getElementById("checkoutSubtotal").textContent = `₹${subtotal.toFixed(2)}`;
        document.getElementById("checkoutGst").textContent = `₹${gstAmount.toFixed(2)}`;
        document.getElementById("checkoutTotalPrice").textContent = `₹${grandTotal.toFixed(2)}`;

    } catch (error) {
        console.error("Checkout summary error:", error);
        document.getElementById("checkoutOrderSummary").innerHTML =
            '<p class="text-red-500">Could not load order summary.</p>';
    }
}


// 🔴 உங்கள் பழைய 'showConfirmationPage' ஃபங்ஷனை இதைக் கொண்டு மாற்றவும்
function showConfirmationPage() {
    hideAllContentSections();
    confirmationSection.classList.remove('hidden');
    window.scrollTo({ top: confirmationSection.offsetTop, behavior: 'smooth' });
    localStorage.setItem('lastSection', 'confirmation');

    const customerName = document.getElementById('checkoutCustomerName').value;
    const address = document.getElementById('checkoutAddress').value;
    const city = document.getElementById('checkoutCity').value;
    const pincode = document.getElementById('checkoutPincode').value;
    const mobileNumber = document.getElementById('checkoutMobile').value;
    const totalText = document.getElementById('checkoutTotalPrice').textContent;
    const subtotalText = document.getElementById('checkoutSubtotal').textContent;

    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked');
    let paymentText = "Not Selected";
    if (selectedMethod) {
        if (selectedMethod.value === "cod") {
            paymentText = "Cash on Delivery";
        } else if (selectedMethod.value === "online") {
            paymentText = "Online Payment";
        } else if (selectedMethod.value === "upi") { // 🟢 UPIக்கு டெக்ஸ்ட் சேர்க்கவும்
            paymentText = "UPI (QR Code)";
        }
    }

    document.getElementById('confirm-name').textContent = customerName;
    document.getElementById('confirm-address').textContent = address;
    document.getElementById('confirm-city-pincode').textContent = `${city} - ${pincode}`;
    document.getElementById('confirm-mobile').textContent = `Mobile: ${mobileNumber}`;
    document.getElementById('confirm-subtotal1').textContent =subtotalText;
    document.getElementById('confirm-payment').textContent = paymentText;
     document.getElementById('confirm-total').textContent = totalText;

    finalOrderData = {
        customerName, address, city, pincode, mobileNumber,
        totalAmount: parseFloat(totalText.replace('₹', '')),
        paymentMethod: selectedMethod ? selectedMethod.value : null
    };

    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.name) {
        finalOrderData.userName = userData.name;
    }
    
    const checkoutData = {
        customerName, address, city, pincode, mobileNumber,
        paymentMethod: selectedMethod ? selectedMethod.value : null
    };
    localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
}


// 🔴 உங்கள் பழைய 'proceedToPaymentBtn' லிஸனரை நீக்கிவிட்டு, இதை முழுவதுமாக சேர்க்கவும்.
// document.getElementById('proceedToPaymentBtn').addEventListener('click', async function() {
//     try {
//         const userData = JSON.parse(localStorage.getItem('userData'));
//         if (!userData || !userData.name) throw new Error("User not logged in");

//         const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked');
//         if (!selectedMethod) {
//             alert("Please select a payment method!");
//             return;
//         }
//         finalOrderData.paymentMethod = selectedMethod.value;

//         const cartResponse = await fetch(`http://localhost:8081/MainProjectApis/viewCart?userName=${userData.name}`);
//         if (!cartResponse.ok) throw new Error("Failed to fetch cart from API.");
//         const cartItems = await cartResponse.json();
//         if (!cartItems || cartItems.length === 0) throw new Error("Cannot proceed with an empty cart.");
//         finalOrderData.cartItems = cartItems;

//         localStorage.setItem('finalOrderDataForFulfillment', JSON.stringify(finalOrderData));
        
//         // --- Payment Flow ---
//         if (finalOrderData.paymentMethod === "cod") {
//             document.getElementById("loading").style.display = "block";
//             const codResponse = await fetch("http://localhost:8081/MainProjectApis/placeOrder", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(finalOrderData)
//             });
//             const result = await codResponse.json();
//             document.getElementById("loading").style.display = "none";
//             if (!codResponse.ok) throw new Error(result.message || "Failed to place COD order.");
//             if (result.status === 'success' && result.redirectUrl) {
//                 window.location.href = result.redirectUrl;
//             } else {
//                 throw new Error('Order placed, but redirect failed.');
//             }
//         } 
//         else if (finalOrderData.paymentMethod === "online") {
//              // Online Payment (Cashfree)
//             const response = await fetch('http://localhost:8081/MainProjectApis/create-cashfree-session', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(finalOrderData)
//             });
//             const sessionData = await response.json();
//             if (sessionData.error) throw new Error(sessionData.error);
//             const paymentSessionId = sessionData.payment_session_id;
//             if (!paymentSessionId) throw new Error("Failed to get payment_session_id from the server.");

//             const cashfree = new Cashfree({ mode: "sandbox" });
//             cashfree.checkout({
//                 paymentSessionId: paymentSessionId,
//                 redirectTarget: "_self"
//             });
//         } 
//         else if (finalOrderData.paymentMethod === "upi") {
//             // 🟢 UPI Flow: Open the modal
//             upiPayableAmount.textContent = `Amount: ₹${finalOrderData.totalAmount.toFixed(2)}`;
//             upiModal.style.display = 'flex'; // Use flex to center it
//         }

//     } catch (error) {
//         console.error(error);
//         document.getElementById("loading").style.display = "none";
//         alert(`Payment Error: ${error.message}`);
//     }
// });
// 🔴 உங்கள் பழைய 'proceedToPaymentBtn' லிஸனரை நீக்கிவிட்டு, இதை முழுவதுமாக சேர்க்கவும்.
// 🟢 ஒரு குளோபல் வேரியபிளைச் சேர்க்கவும் (டைமரை நிறுத்த)
let upiTimer = null; 
let finalOrderData = {}; // finalOrderData-ஐ இங்கே வரையறுப்பது நல்லது

// --- மற்ற ஃபங்ஷன்கள் (showCheckOutPage, showConfirmationPage போன்றவை அப்படியே இருக்கும்) ---
// ...
// ...


// 🔴 உங்கள் பழைய 'proceedToPaymentBtn' லிஸனரை நீக்கிவிட்டு, இதை முழுவதுமாக சேர்க்கவும்.
document.addEventListener("DOMContentLoaded", function() {

    // ===================================================================
    // 1. Configuration
    // ===================================================================
    // !! MUKKIYAM: Intha values-a ungalodathukku maathunga !!
    const MERCHANT_UPI_ID = "padmakumar745@okicici"; // Unga code-la irunthu eduthathu
    const MERCHANT_NAME = "Padmakumar"; // Unga code-la irunthu eduthathu

    // ===================================================================
    // 2. Element Selections
    // ===================================================================
    const checkoutForm = document.getElementById('checkoutForm');
    const reviewOrderBtn = document.getElementById('reviewOrderBtn');
    const proceedToPaymentBtn = document.getElementById('proceedToPaymentBtn');
    const loadingSpinner = document.getElementById('loading');
    const CheckOutSection = document.getElementById('checkout-section');
    const confirmationSection = document.getElementById('confirmation-section');

    // --- Modal Elements (Unga + Enoda selections serthu) ---
    const upiModal = document.getElementById('upi-qr-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const finalUpiSubmitBtn = document.getElementById('final-upi-submit-btn');
    const upiTransactionIdInput = document.getElementById('upi-transaction-id');
    const upiPayableAmount = document.getElementById('upi-payable-amount');
    const amountInstructionText = document.getElementById('upi-amount-instruction');
    const qrCanvas = document.getElementById('upi-qr-code');

    // Tab elements
    const tabBtnQr = document.getElementById('tab-btn-qr');
    const tabBtnUpi = document.getElementById('tab-btn-upi');
    const tabPanelQr = document.getElementById('tab-panel-qr');
    const tabPanelUpi = document.getElementById('tab-panel-upi');

    // UPI ID elements
    const merchantUpiIdText = document.getElementById('merchant-upi-id');
    const merchantUpiIdInstruction = document.getElementById('merchant-upi-id-instruction');
    const copyUpiBtn = document.getElementById('copy-upi-btn');
    const copySuccessMsg = document.getElementById('copy-success-msg');
    const upiTxnError = document.getElementById('upi-txn-error');

    // Global variable to hold order data
    let finalOrderData = {};


    // ===================================================================
    // 3. Main Event Listeners (Unga code)
    // ===================================================================

    // "Review Your Order" button
    if (reviewOrderBtn) {
        reviewOrderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (checkoutForm && checkoutForm.checkValidity()) {
                showConfirmationPage();
            } else if (checkoutForm) {
                checkoutForm.reportValidity();
            }
        });
    }

    // "Proceed to Payment" button
    if (proceedToPaymentBtn) {
        proceedToPaymentBtn.addEventListener('click', async function() {
            try {
                const userData = JSON.parse(localStorage.getItem('userData'));
                if (!userData || !userData.name) throw new Error("User not logged in");

                const cartResponse = await fetch(`https://mainprojectapi.onrender.com/viewCart?userName=${userData.name}`);
                if (!cartResponse.ok) throw new Error("Failed to fetch cart from API.");
                const cartItems = await cartResponse.json();
                if (!cartItems || cartItems.length === 0) throw new Error("Cannot proceed with an empty cart.");

                finalOrderData.userName = userData.name;
                finalOrderData.cartItems = cartItems;
                localStorage.setItem('finalOrderDataForFulfillment', JSON.stringify(finalOrderData));

                // --- Payment Flow Logic ---
                if (finalOrderData.paymentMethod === "cod") {
                    await placeOrder(finalOrderData);
                } else if (finalOrderData.paymentMethod === "online") {
                    // initiateCashfreePayment(finalOrderData); // Your Cashfree logic
                } else if (finalOrderData.paymentMethod === "upi") {
                    // **MODIFIED:** Unga 'initiateUpiPayment' pathila 'showUpiModal' call pannurom
                    showUpiModal(finalOrderData.totalAmount);
                }
            } catch (error) {
                // 'alert' pathila console error use pannalam
                console.error(`An error occurred: ${error.message}`);
                // Inga oru custom error message UI kaattalam
            }
        });
    }

    // ===================================================================
    // 4. Modal Event Listeners (Merged)
    // ===================================================================

    // "Confirm & Place Order" button inside the UPI Modal
    if (finalUpiSubmitBtn) {
        finalUpiSubmitBtn.addEventListener('click', async () => {
            const transactionId = upiTransactionIdInput ? upiTransactionIdInput.value.trim() : '';
            
            // **MODIFIED:** Better validation + Error message UI (alert pathila)
            if (transactionId && transactionId.length >= 12 && /^\d+$/.test(transactionId)) {
                // Validation success
                if(upiTxnError) upiTxnError.classList.add('hidden');
                if(upiTransactionIdInput) upiTransactionIdInput.classList.remove('border-red-500');

                finalUpiSubmitBtn.textContent = 'Verifying...';
                finalUpiSubmitBtn.disabled = true;

                finalOrderData.transactionId = transactionId;
                await placeOrder(finalOrderData); // Unga function-a call pannurom
                
                // placeOrder success aagala-na, button-a reset pannurom
                // (placeOrder 'finally' block la ithu iruntha nallathu)
                finalUpiSubmitBtn.textContent = 'Confirm & Place Order';
                finalUpiSubmitBtn.disabled = false;

            } else {
                // Validation failed
                console.error("Invalid UPI ID");
                if (upiTxnError) {
                    upiTxnError.textContent = "Please enter a valid 12-digit UPI reference number.";
                    upiTxnError.classList.remove('hidden');
                }
                if (upiTransactionIdInput) upiTransactionIdInput.classList.add('border-red-500');
            }
        });
    }

    // "Cancel" button in the UPI Modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            // **MODIFIED:** 'style.display' pathila 'hideUpiModal' function use pannurom
            hideUpiModal();
        });
    }
    
    // --- New Listeners from Base Script ---
    
    // Tab switching
    if (tabBtnQr && tabBtnUpi) {
        tabBtnQr.addEventListener('click', () => switchTab('qr'));
        tabBtnUpi.addEventListener('click', () => switchTab('upi'));
    }

    // Copy UPI ID
    if (copyUpiBtn) {
        copyUpiBtn.addEventListener('click', () => {
            const tempTextarea = document.createElement('textarea');
            tempTextarea.value = MERCHANT_UPI_ID;
            document.body.appendChild(tempTextarea);
            tempTextarea.select();
            try {
                document.execCommand('copy');
                if (copySuccessMsg) {
                    copySuccessMsg.classList.remove('hidden');
                    setTimeout(() => {
                        copySuccessMsg.classList.add('hidden');
                    }, 2000);
                }
            } catch (err) {
                console.error('Failed to copy UPI ID: ', err);
            }
            document.body.removeChild(tempTextarea);
        });
    }
    
    // Remove error border on input
    if (upiTransactionIdInput) {
        upiTransactionIdInput.addEventListener('input', () => {
            if (upiTxnError) upiTxnError.classList.add('hidden');
            upiTransactionIdInput.classList.remove('border-red-500');
        });
    }

    // ===================================================================
    // 5. Helper and Page Display Functions (Merged)
    // ===================================================================

    // --- New Modal Functions ---
    
    // Intha function-a unga 'Pay' button-oda call pannanum
    function showUpiModal(amount) {
        if (typeof amount !== 'number' || amount <= 0) {
            console.error("Invalid amount pass pannirukeenga:", amount);
            return;
        }
        updatePaymentDetails(amount); // QR code & amount update pannum
        switchTab('qr'); // Default-a QR tab-ku reset pannurom
        if (upiTransactionIdInput) upiTransactionIdInput.value = '';
        if (upiTxnError) upiTxnError.classList.add('hidden');
        if (upiTransactionIdInput) upiTransactionIdInput.classList.remove('border-red-500');
        
        if (upiModal) {
            upiModal.classList.remove('hidden');
            upiModal.classList.add('flex');
        }
    }

    function hideUpiModal() {
        if (upiModal) {
            upiModal.classList.add('hidden');
            upiModal.classList.remove('flex');
        }
    }

    function generateQRCode(amount) {
        const upiString = `upi://pay?pa=${MERCHANT_UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${amount.toFixed(2)}&cu=INR&tn=OrderPayment`;
        
        if (typeof QRious !== 'undefined' && qrCanvas) {
            new QRious({
                element: qrCanvas,
                value: upiString,
                size: 200,
                padding: 12,
                level: 'M'
            });
        } else if (!qrCanvas) {
            console.error("QR Canvas element ('upi-qr-code') kedaikala.");
        } else {
            console.error("QRious library load aagala. QR code generate panna mudiyathu.");
        }
    }

    function updatePaymentDetails(amount) {
        const formattedAmount = `₹${amount.toFixed(2)}`;
        if(upiPayableAmount) upiPayableAmount.textContent = `Amount: ${formattedAmount}`;
        if(amountInstructionText) amountInstructionText.textContent = formattedAmount;
        if(merchantUpiIdText) merchantUpiIdText.textContent = MERCHANT_UPI_ID;
        if(merchantUpiIdInstruction) merchantUpiIdInstruction.textContent = MERCHANT_UPI_ID;
        generateQRCode(amount); // QR code generate pannurom
    }

    function switchTab(tab) {
        if (tab === 'qr') {
            if(tabPanelQr) tabPanelQr.classList.remove('hidden');
            if(tabPanelUpi) tabPanelUpi.classList.add('hidden');
            if(tabBtnQr) tabBtnQr.classList.add('active');
            if(tabBtnUpi) {
                tabBtnUpi.classList.remove('active');
                tabBtnUpi.classList.add('text-gray-500', 'hover:text-gray-700');
            }
        } else if (tab === 'upi') {
            if(tabPanelUpi) tabPanelUpi.classList.remove('hidden');
            if(tabPanelQr) tabPanelQr.classList.add('hidden');
            if(tabBtnUpi) tabBtnUpi.classList.add('active');
            if(tabBtnQr) {
                tabBtnQr.classList.remove('active');
                tabBtnQr.classList.add('text-gray-500', 'hover:text-gray-700');
            }
        }
    }
    
    // --- Unga Helper Functions (Keep as is) ---

    // A general function to send the final order to your backend
    async function placeOrder(orderData) {
        // **MODIFIED:** 'style.display' pathila 'hideUpiModal' call pannurom
        hideUpiModal();
        if (loadingSpinner) loadingSpinner.style.display = "block";

        try {
            const response = await fetch("https://mainprojectapi.onrender.com/placeOrder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData)
            });
            const result = await response.json();
            if (response.ok && result.status === 'success' && result.redirectUrl) {
                window.location.href = result.redirectUrl;
            } else {
                throw new Error(result.message || 'Order placement failed.');
            }
        } catch (err) {
            // 'alert' pathila console error use pannalam
            console.error(`Order Error: ${err.message}`);
            // Inga oru custom error message UI kaattalam
        } finally {
            if (loadingSpinner) loadingSpinner.style.display = "none";
        }
    }
    
    // Function to show the confirmation page and gather data into finalOrderData
    window.showConfirmationPage = function() {
        if(CheckOutSection) CheckOutSection.classList.add('hidden');
        if(confirmationSection) confirmationSection.classList.remove('hidden');
        
        const customerName = document.getElementById('checkoutCustomerName').value;
        const address = document.getElementById('checkoutAddress').value;
        const city = document.getElementById('checkoutCity').value;
        const pincode = document.getElementById('checkoutPincode').value;
        const mobileNumber = document.getElementById('checkoutMobile').value;
        const totalText = document.getElementById('checkoutTotalPrice').textContent;
        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked');
        
        finalOrderData = {
            customerName, address, city, pincode, mobileNumber,
            totalAmount: parseFloat(totalText.replace('₹', '')),
            paymentMethod: selectedMethod ? selectedMethod.value : null,
        };
        
        document.getElementById('confirm-name').textContent = customerName;
        document.getElementById('confirm-address').textContent = address;
        document.getElementById('confirm-city-pincode').textContent = `${city} - ${pincode}`;
        document.getElementById('confirm-mobile').textContent = `Mobile: ${mobileNumber}`;
        document.getElementById('confirm-total').textContent = totalText;
    };

});

// 🔴 உங்கள் பழைய 'close-modal-btn' லிஸனரை நீக்கிவிட்டு, இதைச் சேர்க்கவும்.
closeModalBtn.addEventListener('click', () => {
    // டைமர் ஓடிக்கொண்டிருந்தால், அதை நிறுத்தவும்
    if(upiTimer) {
        clearTimeout(upiTimer);
        console.log("Timer cancelled by user.");
    }
    upiModal.style.display = 'none';
});


// order page
async function showMyOrdersPage() {
  hideAllContentSections();
  myOrdersSection.classList.remove('hidden');
  window.scrollTo({ top: myOrdersSection.offsetTop, behavior: 'smooth' });
  localStorage.setItem('lastSection', 'order');
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
    // 🔄 Always fetch fresh data
    const response = await fetch(`https://mainprojectapi.onrender.com/viewOrders?userName=${userData.name}`);
    const orders = await response.json();

    loadingMessage.classList.add('hidden');

    if (orders.length === 0) {
      noOrdersMessage.classList.remove('hidden');
    } else {
      ordersContainer.innerHTML = ''; 
      orders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'bg-white border border-gray-200 rounded-lg p-6 shadow-sm';

        let statusColorClasses = 'bg-yellow-100 text-yellow-800'; 
        if (order.status.toLowerCase() === 'shipped') {
          statusColorClasses = 'bg-blue-100 text-blue-800';
        } else if (order.status.toLowerCase() === 'delivered') {
          statusColorClasses = 'bg-green-100 text-green-800';
        } else if (order.status.toLowerCase() === 'cancelled') {
          statusColorClasses = 'bg-red-100 text-red-800';
        }

        // Cancel button only for pending orders
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
            </div>`;
        });
        itemsHtml += '</div>';

        orderCard.innerHTML = `
          <div class="flex flex-col md:flex-row justify-between md:items-center">
            <div>
              <p class="text-lg font-bold text-gray-800">Order #${order.orderIdtext}</p>
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

// ✅ Clear orders only in UI + cache (not DB)
function clearOrdersUI() {
  if (confirm("Are you sure you want to clear your order history view?")) {
    const ordersContainer = document.getElementById('orders-list-container');
    ordersContainer.innerHTML = '';
    document.getElementById('no-orders-message').classList.remove('hidden');
    localStorage.removeItem('cachedOrders'); // clear cache
  }
}

//cancel order page

window.cancelOrder = async (orderId, userName) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
       const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData || !userData.name) {
            throw new Error("You must be logged in to cancel an order.");
        }
        let response = await fetch("https://mainprojectapi.onrender.com/cancelOrder", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                orderId: orderId,
                userName: userData.name   // ✅ userName backendல தேவையிருக்கு
            })
        });

        let data = await response.json();

        if (data.status === "success") {
            // UI update
            let orderRow = document.getElementById(`order-${orderId}`);
            if (orderRow) {
                orderRow.querySelector(".order-status").textContent = "Cancelled";
                let btn = orderRow.querySelector(".cancel-btn");
                if (btn) {
                    btn.disabled = true;
                    btn.textContent = "Cancelled";
                }
            }
            alert(data.message);
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to cancel order");
    }
};

window.onload = function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const userData = JSON.parse(localStorage.getItem('userData'));
  if (isLoggedIn === 'true' && userData) {
    updateUIForLogin(userData);
  } else {
    updateUIForLogout();
  }

  // Restore last visited section
  const lastSection = localStorage.getItem('lastSection');
  switch(lastSection) {
    case 'about': showAboutPage(); break;
    case 'contact': showContactPage(); break;
    case 'customDesign': showCustomDesigntPage(); break;
    case 'checkout': showCheckOutPage(); break;
    //case 'confirmation': showConfirmationPage(); break;
    case 'cart': showCartPage(); break;
    case 'userProfile': showUserProfile(); break;
    case 'products': showProductsPage(); break;
    //case 'productDetail':showProductDetail(); break;
    case 'order': showMyOrdersPage() ; break;
    default: showHomePage();
  }

  fetchProducts();
};
