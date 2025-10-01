document.addEventListener("DOMContentLoaded", function () {
  let products = [];

  fetch("../data/products.json")
    .then(response => response.json())
    .then(data => {
      products = data;
      initializeApp(); 
    });
/* delievery day*/
  function getEstimatedDay() {
    const today = new Date();
    const estimatedDelieveryDate = new Date(today);
    estimatedDelieveryDate.setDate(today.getDate() + 7);
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' }
    const formattedEstimatedDelivery = estimatedDelieveryDate.toLocaleDateString('en-US', options).replace(',', '');
    return formattedEstimatedDelivery;
  }
/* load the localstorage for chose items*/
  function initializeApp() {
    const order = JSON.parse(localStorage.getItem("order"));
    if (!order) return;
    const orderDetailsElement = document.getElementById("orderDetails");

    orderDetailsElement.innerHTML = `<h4> Your order has been placed successfully! We're processing your order now. </h4>`;
    let basicInfo = `<ul>Order Number: ${order.orderNumber}`;
    basicInfo += `<li>Estimated delivery date: ${getEstimatedDay()}</li>`;
    orderDetailsElement.innerHTML += basicInfo;
    let itemsList = `<ul> Order Details:`;
    order.item.forEach(item => {
      const product = getProductById(item.id);
      if (product) {
        itemsList += `<li> ${product.name} - ${item.quantity} items</li>`
      }
    });
    itemsList += "</ul>";
    orderDetailsElement.innerHTML += itemsList;
  }
/* go back index.html btn*/
  const continueShopping = document.getElementById("goBackHome");
  continueShopping.addEventListener("click", function () {
    window.location.href = "index.html";
  });

  function getProductById(id) {
    return products.find(p => p.id === id);
  }
/* Q&A expand btn for explaining the common question*/
  document.querySelectorAll('.expandBtn').forEach(button => {
    button.addEventListener('click', () => {
      const content = button.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  });
});
