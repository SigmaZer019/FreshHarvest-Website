document.addEventListener("DOMContentLoaded", () => {
  // Load products from JSON
  fetch("data/products.json")
    .then(res => res.json())
    .then(products => {
      const container = document.getElementById("product-list");
      products.forEach(p => {
        const card = `
          <div class="cards">
            <img class="product-image" src="${p.image}" alt="${p.name}" />
            <h3>${p.name}</h3>
            <div class="price"><h4>₱${p.price}/kg</h4></div>
            <button class="add-to-cart-btn" style="cursor:pointer;">
              <span>Add to Cart</span>
              <img src="Images/icon-cart.png" alt="Cart Icon" class="icon-cart" />
            </button>
            <p class="add-wishlist" style="cursor:pointer; color:#009700; font-weight:600;">
              ❤︎ Add to Wishlist
            </p>
          </div>`;
        container.innerHTML += card;
      });
    })
    .then(() => {
      const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
      const addToWishlist = document.querySelectorAll(".add-wishlist");
      const wishlistSidebar = document.getElementById("wishlist-sidebar");
      const wishlistItemsContainer = document.getElementById("wishlist-items");
      const openWishlistBtn = document.getElementById("open-wishlist");
      const closeWishlistBtn = document.getElementById("close-wishlist");

      // Open/Close Wishlist Sidebar
      openWishlistBtn.addEventListener("click", (e) => {
        e.preventDefault();
        wishlistSidebar.classList.add("open");
        renderWishlist();
      });

      closeWishlistBtn.addEventListener("click", () => {
        wishlistSidebar.classList.remove("open");
      });

      // Add to Cart
      addToCartButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const card = button.closest(".cards");
          const name = card.querySelector("h3").textContent;
          const priceText = card.querySelector(".price h4").textContent;
          const image = card.querySelector(".product-image").src;
          const price = parseFloat(priceText.replace(/[^\d.]/g, ""));
          let cart = JSON.parse(localStorage.getItem("cart")) || [];
          const existingItem = cart.find((item) => item.name === name);
          if (existingItem) existingItem.quantity += 1;
          else cart.push({ name, price, quantity: 1, image });
          localStorage.setItem("cart", JSON.stringify(cart));
          alert(`${name} added to your cart! 🛒`);
        });
      });

      //Add to Wishlist
      addToWishlist.forEach((text) => {
        text.addEventListener("click", () => {
          const card = text.closest(".cards");
          const name = card.querySelector("h3").textContent;
          const image = card.querySelector(".product-image").src;
          const priceText = card.querySelector(".price h4").textContent;
          const price = parseFloat(priceText.replace(/[^\d.]/g, ""));

          let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
          const existing = wishlist.find(item => item.name === name);
          if (!existing) {
            wishlist.push({ name, price, image });
            localStorage.setItem("wishlist", JSON.stringify(wishlist));
            alert(`${name} added to your wishlist! ❤︎`);
          } else {
            alert(`${name} is already in your wishlist.`);
          }
        });
      });

      // Render Wishlist in Sidebar
      function renderWishlist() {
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        wishlistItemsContainer.innerHTML = "";

        if (wishlist.length === 0) {
          wishlistItemsContainer.innerHTML = "<p>Your wishlist is empty.</p>";
          return;
        }

        wishlist.forEach((item, index) => {
          const div = document.createElement("div");
          div.classList.add("wishlist-item");
          div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="wishlist-info">
              <h4>${item.name}</h4>
              <p>₱${item.price}</p>
              <div class="wishlist-actions">
                <button onclick="addToCartFromWishlist(${index})">Add to Cart</button>
                <button onclick="removeFromWishlist(${index})" style="background:#ff4d4d;">Remove</button>
              </div>
            </div>
          `;
          wishlistItemsContainer.appendChild(div);
        });
      }

      // Expose helper functions globally
      window.removeFromWishlist = function(index) {
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        wishlist.splice(index, 1);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        alert("Item removed from wishlist.");
        renderWishlist();
      };

      window.addToCartFromWishlist = function(index) {
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const item = wishlist[index];
        const existing = cart.find(c => c.name === item.name);
        if (existing) existing.quantity += 1;
        else cart.push({ ...item, quantity: 1 });
        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`${item.name} added to your cart from wishlist! 🛒`);
      };
    })
    .catch(err => console.error("Error loading products:", err));
});
