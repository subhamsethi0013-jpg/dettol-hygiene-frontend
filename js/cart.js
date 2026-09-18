function renderCart() {
  const target = document.getElementById("cart-items");
  const summary = document.getElementById("cart-summary");
  if (!target || !summary) return;
  const cart = getCart();
  if (!cart.length) { target.innerHTML = '<p class="empty">Your cart is empty. <a href="products.html">Browse products</a></p>'; summary.innerHTML = ""; return; }
  target.innerHTML = cart.map(item => `<div class="cart-item"><img src="${item.image}" alt="${item.name}"><div><h3>${item.name}</h3><p>₹${item.price} × ${item.quantity}</p><label>Quantity <input class="cart-quantity" data-id="${item.id}" type="number" min="1" value="${item.quantity}"></label></div><div><strong>₹${item.price * item.quantity}</strong><br><button class="remove" data-id="${item.id}">Remove</button></div></div>`).join("");
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  summary.innerHTML = `<h2>Order Summary</h2><div class="summary-row"><span>Items</span><span>${cart.reduce((sum, item) => sum + item.quantity, 0)}</span></div><div class="summary-row total"><span>Total</span><span>₹${total}</span></div><button id="checkout" class="button" style="width:100%; margin-top:1rem">Checkout</button><p id="order-status" class="form-status"></p>`;
  target.querySelectorAll(".remove").forEach(button => button.onclick = () => { saveCart(cart.filter(item => item.id !== Number(button.dataset.id))); renderCart(); });
  target.querySelectorAll(".cart-quantity").forEach(input => input.onchange = () => { const item = cart.find(entry => entry.id === Number(input.dataset.id)); item.quantity = Math.max(1, Number(input.value) || 1); saveCart(cart); renderCart(); });
  document.getElementById("checkout").onclick = () => checkout(cart, total);
}
async function checkout(items, total) {
  const status = document.getElementById("order-status");
  try { const response = await fetch(`${API_URL}/orders`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items, total }) }); const data = await response.json(); if (!response.ok) throw new Error(data.message); localStorage.removeItem("dettolCart"); status.className = "form-status success"; status.textContent = `${data.message} Confirmation: ${data.orderNumber}`; updateCartCount(); setTimeout(renderCart, 1500); } catch (error) { status.className = "form-status error"; status.textContent = error.message; }
}
document.addEventListener("DOMContentLoaded", renderCart);
