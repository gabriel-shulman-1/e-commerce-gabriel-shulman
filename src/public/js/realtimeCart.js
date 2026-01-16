const socket = io();

socket.emit("cart:getAll");

socket.emit("cart:getCount");

socket.on("cart:count", (count) => {
  const btn = document.getElementById("cartCount");
  if (btn) btn.innerText = String(count);
});

socket.on("cart:all", (cart) => {
  renderCart(cart);
});

window.clearCart = () =>{
  socket.emit("cart:clear")
}

window.addToCart = (id) => {
  const value = parseInt(document.getElementById(`qty-${id}`).value, 10);
  const quantity = isNaN(value) ? 1 : value;
  socket.emit("cart:add", { productId: id, quantity });
};

window.updateQty = (id, delta) => {
  const input = document.getElementById(`qty-${id}`);
  if (!input) return;
  const value = parseInt(input.value, 10) + delta;
  socket.emit("cart:updateQty", { productId: id, quantity: value });
};

window.removeFromCart = (id) => {
  socket.emit("cart:remove", { productId: id });
};

function renderCart(cart) {
  const tbody = document.getElementById("cartBody");
  const totalDiv = document.getElementById("cartTotal");
  if (!cart || !cart.products || cart.products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center">Carrito vacío</td></tr>`;
    totalDiv.innerText = "No hay elementos en el carrito";
    return;
  }
  tbody.innerHTML = "";
  let total = 0;
  cart.products.forEach((item) => {
    const subtotal = item.quantity * item.product.price;
    total += subtotal;
    tbody.innerHTML += `
      <tr>
        <td>${item.product.title}</td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="updateQty('${item.product._id}', -1)">-</button>
          <input id="qty-${item.product._id}" value="${item.quantity}" type="number" min="1" class="mx-2" style="width:60px;">
          <button class="btn btn-sm btn-secondary" onclick="updateQty('${item.product._id}', 1)">+</button>
        </td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="removeFromCart('${item.product._id}')">Eliminar</button>
        </td>
        <td>$${subtotal}</td>
      </tr>
    `;
  });
  totalDiv.innerText = `Total: $${total}`;
};

document.getElementById("purchaseBtn").addEventListener("click", () => {
  socket.emit("cart:purchase");
});

socket.on("cart:purchase:done", () => {
  alert("Compra realizada con éxito");
  window.location.href = "/products-filtered";
});

socket.on("cart:purchase:error", msg => {
  alert("Error: " + msg);
});
