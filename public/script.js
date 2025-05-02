//1) loading books and displaying them
function loadBooks() {
    fetch("/books")
      .then(res => res.json())
      .then(books => {
        const container = document.getElementById("bookGrid");
        container.innerHTML = "";
  
        books.forEach(book => {
          const { title, author, cover, price } = book;
          const card = document.createElement("div");
          card.className = "col";
  
          card.innerHTML = `
            <div class="card h-100 shadow-sm" style="max-width: 180px; margin: auto;">
              <img src="${cover}" class="card-img-top" style="height: 200px; object-fit: cover;" alt="${title}">
              <div class="card-body p-2 text-center">
                <h6 class="card-title mb-1">${title}</h6>
                <small class="text-muted">${author}</small><br>
                <strong class="text-success">${price}</strong>
                <div class="mt-2 d-grid gap-2">
                  <button class="btn btn-sm btn-outline-success"
                          onclick="handleBuy('${title.replace(/'/g, "\\'")}', '${author.replace(/'/g, "\\'")}', '${cover}', '${price}')">
                    Buy
                  </button>
                  <button class="btn btn-sm btn-outline-primary"
                          onclick="handleBorrow('${title.replace(/'/g, "\\'")}', '${author.replace(/'/g, "\\'")}', '${cover}')">
                    Borrow
                  </button>
                </div>
              </div>
            </div>
          `;
  
          container.appendChild(card);
        });
      })
      .catch(err => console.error("Error fetching books:", err));
  }
  
  // ── 2) Show a temporary confirmation bar ──
  function showConfirm(message) {
    const bar = document.getElementById("actionConfirmBar");
    const msg = document.getElementById("confirmMessage");
    msg.innerHTML = message;
    bar.classList.remove("d-none");
    setTimeout(() => bar.classList.add("d-none"), 5000);
  }


// ── 3) Cart Action Handlers ──
function handleBuy(title, author, cover, price) {
  const cart = JSON.parse(localStorage.getItem("buyCart")) || [];

  if (!cart.find(book => book.title === title)) {
    cart.push({ title, author, cover, price }); // ✅ use correct 'cover' variable
    localStorage.setItem("buyCart", JSON.stringify(cart));
  }

  updateCartCounts();
  showConfirm(`${title} added to your <strong>Buy</strong> cart.`);
}

function handleBorrow(title, author, coverUrl) {
  const cart = JSON.parse(localStorage.getItem("borrowCart")) || [];

  if (!cart.find(book => book.title === title)) {
    cart.push({ title, author, cover: coverUrl }); // ✅ already correct
    localStorage.setItem("borrowCart", JSON.stringify(cart));
  }

  updateCartCounts();
  showConfirm(`${title} added to your <strong>Borrow</strong> list.`);
}

// ── 3.1) Updating Cart Counts ──
function updateCartCounts() {
  const borrowCart = JSON.parse(localStorage.getItem("borrowCart")) || [];
  const buyCart = JSON.parse(localStorage.getItem("buyCart")) || [];

  document.getElementById("borrowCount").textContent = borrowCart.length;
  document.getElementById("buyCount").textContent = buyCart.length;

  const borrowIcon = document.getElementById("borrowCartIcon");
  const buyIcon = document.getElementById("buyCartIcon");

  if (borrowIcon) borrowIcon.setAttribute("data-count", borrowCart.length);
  if (buyIcon) buyIcon.setAttribute("data-count", buyCart.length);

  updateCheckoutButton(buyCart, borrowCart); // ✅ pass both carts
}

// ── 3.2) Resetting Cart to Default ──
function resetCartToDefault() {
  // Clear the cart data in localStorage
  localStorage.setItem("borrowCart", JSON.stringify([]));
  localStorage.setItem("buyCart", JSON.stringify([]));

  // Update the cart counts to 0
  updateCartCounts();

  // Render the empty borrow and buy lists
  renderBorrowList([]);
  renderBuyList([]);
}

//here the remove code 

// ── 3.4) Load Cart Counts on Page Load WITHOUT Clearing Carts ──
window.addEventListener("load", function () {
  updateCartCounts(); // ✅ Only update counts — do not reset!
});





