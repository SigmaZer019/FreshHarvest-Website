document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");

  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = searchInput.value.trim().toLowerCase();
      if (query === "") return;

      // Load products.json
      fetch("data/products.json")
        .then(res => res.json())
        .then(products => {
          // Find a matching product by name
          const foundProduct = products.find(p =>
            p.name.toLowerCase().includes(query)
          );

          if (foundProduct) {
            // ✅ Product exists somewhere
            const matchedPage = foundProduct.page;
            const currentPage = window.location.pathname.split("/").pop();

            localStorage.setItem("searchQuery", query);

            // If user is not on the right page → move there
            if (currentPage !== matchedPage) {
              window.location.href = matchedPage;
              return;
            } else {
              // Already on that page → filter directly
              filterProducts(query);
            }
          } else {
            // ❌ Only show alert if product not in JSON at all
            alert("No product found matching your search.");
          }
        })
        .catch(err => console.error("Error loading products:", err));
    });

    // 🔹 Reset when input cleared
    searchInput.addEventListener("input", () => {
      if (searchInput.value.trim() === "") {
        const products = document.querySelectorAll(".cards");
        products.forEach(product => {
          product.style.display = "block";
        });
      }
    });

    // 🔹 When redirected, auto-filter
    const storedQuery = localStorage.getItem("searchQuery");
    if (storedQuery && window.location.pathname.includes("product")) {
      filterProducts(storedQuery);
      searchInput.value = storedQuery;
      localStorage.removeItem("searchQuery");
    }
  }

  // 🔹 Filter function (only runs in product.html)
  function filterProducts(query) {
    const products = document.querySelectorAll(".cards");
    let found = false;

    products.forEach(product => {
      const name = product.querySelector("h3").textContent.toLowerCase();
      if (name.includes(query)) {
        product.style.display = "block";
        found = true;
      } else {
        product.style.display = "none";
      }
    });

    // Show alert only if product doesn't exist on this page
    if (!found) {
      alert("No product found matching your search.");
    }
  }
});