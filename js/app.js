document.addEventListener("DOMContentLoaded", function () {
    updateLogin();
    setupLogin();
    setupCustomerForm();
    setupProductButton();
    closeForm();
    shoppingCart();
});
/* load cart from localstorage or initialize empty cart*/
let cart = JSON.parse(localStorage.getItem("cart"))||[]; 
/* calculate total item count and show it on the cart icon dot*/
let cartCount = cart.reduce((sum,item)=>sum+item.quantity,0);
let currentProductId = null;
/* get product name or price by ID (used for display the purposes)*/
function getProductNameById(id) {
    const names = {
        "01": "Chocolate Cake",
        "02": "Strawberry Cake",
        "03": "Cheese Cake",
        "04": "Vanilla Cake",
        "05": "Swiss Roll Cake",
    };
    return names[id] || "unknown";
}
function getProductPriceById(id) {
    const price = {
        "01": 15,
        "02": 20,
        "03": 22,
        "04": 18,
        "05": 10,
    };
    return price[id] ?? null;
}
/* add item to cart or update if it already exists*/
function addToCart(productId, quantity) {
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ id: productId, quantity: quantity });
    }
    localStorage.setItem("cart",JSON.stringify(cart));    
}
/*control popup visibility for product info and buttons*/
function closePop() {
    document.querySelector(".popupOverlay").style.display = "none";
    document.querySelector(".pop").style.display = "none";
}
function openPop() {
    document.querySelector(".popupOverlay").style.display = "block";
    document.querySelector(".pop").style.display = "block";
}
function showElement(idOrClass, display = "block") {
    document.querySelector(idOrClass).style.display = display;
}
function hideElement(idOrClass) {
    document.querySelector(idOrClass).style.display = "none";
}
function openForm() {
    document.getElementById("customerFormOverlay").style.display = "block";
    document.getElementById("customerForm").style.display = "block";
}
function closeForm() {
    document.getElementById("customerFormOverlay").style.display = "none";
    document.getElementById("customerForm").style.display = "none";
}
/*setup login/logout button functionality*/
function setupLogin() {
    const login = document.getElementById("login");
    if(!login) return;
    login.addEventListener("click", function (e) {
        e.preventDefault();
        const target = e.target;
        if (target.id === "logout") {
            localStorage.removeItem("currentUser");
            updateLogin();
        } else if (target.id === "login") {
            window.location.href = "login.html";
        }
    });
}
function updateLogin() {
    const login = document.getElementById("login");
    const username = localStorage.getItem("currentUser");
    if (username) {
        login.innerHTML = `<a href="#" id="logout">Logout, ${username}</a>`;
    } else {
        login.innerHTML = `<a href="#" id="login">Login</a>`;
    }
}
/*setup customer feedback form popup and validation*/
function setupCustomerForm() {
    const customerForm = document.getElementById("openCustomerForm");
    customerForm.addEventListener("click", function () {
        openForm();
    });

    document.getElementById("customerFormOverlay").addEventListener("click", function () {
        closeForm();
    });
    const customerReview = document.getElementById("customerReview");
    customerReview.addEventListener("click", function () {
        /*validate form inputs - all fields must be properly  filled*/
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const orderNumber = document.getElementById("orderNumber").value.trim();
        const comment = document.getElementById("feedBack").value.trim();
        const errorMessages = [];

        if (!name || !/^[a-zA-Z\s]+$/.test(name)) {
            errorMessages.push("Please enter a valid name(letters and spaces only).");
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errorMessages.push("Please enter a valid email address.");
        }
        if (!orderNumber || !/^\d{6,}$/.test(orderNumber)) {
            errorMessages.push("Order number must be at least 6 digits.");
        }
        if (!comment || comment.length < 10) {
            errorMessages.push("Comment should be at least 10 characters. ")
        }
        const errorContainer = document.getElementById("errorMessages");
        if (errorMessages.length > 0) {
            errorContainer.innerHTML = errorMessages.join("<br>");
        } else {
            errorContainer.innerHTML = "";
            alert("Thanks for your comments.");
            document.getElementById("formContent").reset();
            closeForm();
        }
    });
}
/* display products descriptions in popup on add button click*/
function setupProductButton() {
    document.querySelectorAll(".openPopupBtn").forEach(function (button) {
        button.addEventListener("click", function () {
            openPop();
            resetPopup();
            currentProductId = this.getAttribute("data-id");
            document.getElementById("checkOut").style.display = "none";
            document.getElementById("taxes").style.display = "none";
           
            const productDescriptions = {
                "01": "<strong>Chocolate Cake:</strong> A rich, moist chocolate cake with a decadent dark chocolate ganache frosting offers a delightful sensory experience. The deep, intense chocolate flavor is balanced by the subtle sweetness of the frosting, while the smooth, velvety texture melts in the mouth.",
                "02": "<strong>Strawberry Cake:</strong> Strawberry Cake: A light, fluffy strawberry cake layered with fresh strawberry puree and topped with a luscious whipped cream frosting creates a delightful sensory experience. ",
                "03": "<strong>Cheesecake:</strong> The rich, tangy flavor of cream cheese is beautifully complemented by the subtle sweetness of sugar, while the smooth texture melts effortlessly on the palate. ",
                "04": "<strong>Vanilla Cake:</strong> A light and airy vanilla cake with a delicate crumb provides a delightful sensory experience. The warm, aromatic flavor of pure vanilla extract infuses each bite, creating a comforting sweetness that is both familiar and inviting. ",
                "05": "<strong>Swiss Roll Cake:</strong> A soft, sponge cake rolled with a luscious filling creates a delightful sensory experience. The light and airy texture of the cake is complemented by the smooth, creamy filling, often made from whipped cream or fruit preserves. "
            };
            let message = productDescriptions[currentProductId] || "<p> Description not available.</p>";
            document.getElementById("productDetails").innerHTML = message;
        });
    });
/* handle the plus and minus bottons for product quantity*/
    const minusBtn = document.querySelector(".minus");
    const plusBtn = document.querySelector(".plus");
    const quantitySpan = document.querySelector(".quantity");

    plusBtn.addEventListener("click", function () {
        let currentAmount = parseInt(quantitySpan.textContent);
        quantitySpan.textContent = currentAmount + 1;
    });

    minusBtn.addEventListener("click", function () {
        let currentAmount = parseInt(quantitySpan.textContent);
        if (currentAmount > 1) {
            quantitySpan.textContent = currentAmount - 1;
        }
    });
/* add seleted product to cart and close popup*/
    document.getElementById("closePop").addEventListener("click", function () {
        closePop();
        const quantity = parseInt(document.querySelector(".quantity").textContent) || 1;

        if (currentProductId) {
            addToCart(currentProductId, quantity);
        }
        
        cartCount += quantity;
        const cartDot = document.getElementById("cartDot");
        cartDot.style.display = "inline-block";
        cartDot.textContent = cartCount;

    });
    document.querySelector(".popupOverlay").addEventListener("click", function () {
        closePop();
    });

}
/* reset popup to initial state for reuse*/
function resetPopup() {
    document.querySelector(".quantity").textContent = "1";
    document.querySelector(".quantityContainer").style.display = "inline-flex";
    showElement("#closePop", "inline-block");
    document.getElementById("productDetails").innerHTML = "";
    document.getElementById("estimatedTotal").innerHTML = "";
    document.getElementById("taxes").style.display = "none";
    document.getElementById("checkOut").style.display = "none";
}
/* showing cart item and calculate the total with the 0.08% tax when cart is clicked*/
function shoppingCart() {
    const shoppingCart = document.querySelector("#cart");

    shoppingCart.addEventListener("click", function () {
        openPop();
        document.querySelector(".quantityContainer").style.display = "none";
        hideElement("#closePop");

        const productDetails = document.getElementById("productDetails");
        const taxes = document.getElementById("taxes");
        const estimatedTotal = document.getElementById("estimatedTotal");
        let taxRate = 0.08;
        if (cart.length === 0) {
            productDetails.innerHTML = "<p> Your cart is empty.</p>"
        } else {
            document.getElementById("checkOut").style.display = "block";
            document.getElementById("taxes").style.display = "block";
            let estimated = 0;
            let cartListHTML = "<h4>Subtotal</h4><ul>";

            cart.forEach(item => {
                const itemTotal = getProductPriceById(item.id) * item.quantity;
                estimated += itemTotal;
                cartListHTML += `<li>${getProductNameById(item.id)} (${item.quantity} items) $${itemTotal.toFixed(2)}</li>`;
            });
            cartListHTML += "</ul>";
            productDetails.innerHTML = cartListHTML;
            if (estimatedTotal) {
                const taxTotal = estimated * taxRate;
                taxes.innerHTML = `<ul>Taxes: $${taxTotal.toFixed(2)}</ul>`;
                estimatedTotal.innerHTML = `<ul><strong>Estimated Total: $${(estimated + taxTotal).toFixed(2)}</strong></ul>`;
            }
        }
    });

    const checkOut = document.getElementById("checkOut");
    const username = localStorage.getItem("currentUser");
    checkOut.addEventListener("click", function () {
        if (username) {
            saveOrder();
        } else {
            window.location.href = "login.html";
        }
    });
    closeForm();
}
/*save order to localstorage, redirested to success page, and show order number*/
function saveOrder() {
    const username = localStorage.getItem("currentUser");
    const order = {
        orderNumber: Date.now(),
        item: cart
    };
    localStorage.setItem("order", JSON.stringify(order));
    alert(`Thanks for your order,${username}!`);
    window.location.href = "order-success.html";
}
