async function loadProducts(targetId, limit) {
  const target = document.getElementById(targetId);
  if (!target) return;
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error("Could not load products.");
    let products = await response.json();
    if (limit) products = products.slice(0, limit);
    target.innerHTML = products.map(product => `
      <article class="card">
        <img src="${product.image}" alt="${product.name}">
        <div class="card-body"><h3>${product.name}</h3><span class="price">₹${product.price}</span>
        <p>${product.description}</p><div class="card-actions">
          <a class="button secondary" href="product.html?id=${product.id}">View Details</a>
          <button class="button add-product" data-id="${product.id}">Add to Cart</button>
        </div></div>
      </article>`).join("");
    target.querySelectorAll(".add-product").forEach(button => button.addEventListener("click", () => {
      const product = products.find(item => item.id === Number(button.dataset.id));
      addToCart(product);
    }));
  } catch (error) { target.innerHTML = `<p class="empty">${error.message} Please make sure the backend is running.</p>`; }
}

async function loadProductDetails() {
  const target = document.getElementById("product-details");
  if (!target) return;
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) { target.innerHTML = '<p class="empty">Please select a product first.</p>'; return; }
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) throw new Error("Product not found.");
    const product = await response.json();
    target.innerHTML = `<div class="details"><img class="details-image" src="${product.image}" alt="${product.name}"><div>
      <p class="eyebrow">Everyday hygiene</p><h1>${product.name}</h1><p class="price">₹${product.price}</p><p>${product.description}</p>
      <div class="quantity-control"><label for="quantity">Quantity</label><input id="quantity" type="number" min="1" value="1"></div>
      <button id="detail-add" class="button">Add to Cart</button></div></div>`;
    document.getElementById("detail-add").addEventListener("click", () => addToCart(product, Number(document.getElementById("quantity").value)));
  } catch (error) { target.innerHTML = `<p class="empty">${error.message}</p>`; }
}
document.addEventListener("DOMContentLoaded", () => { loadProducts("product-list"); loadProducts("featured-products", 4); loadProductDetails(); });
