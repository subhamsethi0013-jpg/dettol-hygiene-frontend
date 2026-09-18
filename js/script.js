const API_URL = "http://localhost:5000/api";

function getCart() { return JSON.parse(localStorage.getItem("dettolCart") || "[]"); }
function saveCart(cart) { localStorage.setItem("dettolCart", JSON.stringify(cart)); updateCartCount(); }
function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll(".cart-count").forEach((badge) => badge.textContent = count);
}
function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);
  if (existing) existing.quantity += quantity;
  else cart.push({ ...product, quantity });
  saveCart(cart);
  alert(`${product.name} was added to your cart.`);
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  const menuButton = document.querySelector(".menu-button");
  const links = document.querySelector(".nav-links");
  if (menuButton) menuButton.addEventListener("click", () => links.classList.toggle("open"));
});
