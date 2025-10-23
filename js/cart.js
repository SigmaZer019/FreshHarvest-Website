let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  cartItemsContainer.innerHTML = "";

  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <tr><td colspan="5" style="padding: 20px;">Your cart is empty.</td></tr>
    `;
    cartTotal.textContent = "₱0.00";
    return;
  }

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const row = `
      <tr>
        <td><img src="${item.image}" alt="${item.name}" width="50"> ${item.name}</td>
        <td>₱${item.price}</td>
        <td>
          <input type="number" min="1" value="${item.quantity}" class="quantity-input" onchange="updateQuantity(${index}, this.value)">
        </td>
        <td>₱${itemTotal.toFixed(2)}</td>
        <td><button class="remove-btn" onclick="removeItem(${index})">Remove</button></td>
      </tr>
    `;
    cartItemsContainer.innerHTML += row;
  });

  cartTotal.textContent = `₱${total.toFixed(2)}`;
  localStorage.setItem("cart", JSON.stringify(cart));
}

document.querySelector(".checkout-btn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("🛒 Your cart is empty. Add some products first.");
  } else {
    alert("✅ Checkout complete! Your products are being processed.");
    localStorage.removeItem("cart");
    location.reload();
  }
});

function updateQuantity(index, newQty) {
  cart[index].quantity = parseInt(newQty);
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
}

renderCart();
