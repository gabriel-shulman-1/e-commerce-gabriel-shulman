const socket = io();
const container = document.getElementById("products-container");
const form = document.getElementById("productForm");
const select = document.getElementById("productSelect");
const btnDelete = document.getElementById("btnDelete");
let editingId = null;
socket.emit("get-products");
socket.on("products-list", (products) => {
  container.innerHTML = "";
  products.forEach((p) => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-3";
    col.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h5>${p.title}</h5>
          <p>${p.description}</p>
          <p><strong>$${p.price}</strong> | Stock: ${p.stock}</p>
          <div class="d-flex align-items-center gap-2">
            <a href="/product/${p._id}" class="btn btn-primary btn-sm"><i class="bi bi-search"></i></a>
            <div class="input-group" style="width: 140px;">
              <button onclick="updateQty('${p._id}', -1)" class="btn btn-outline-secondary">-</button>
              <input id="qty-${p._id}" type="number" class="form-control text-center" value="1" min="1" max="${p.stock}">
              <button onclick="updateQty('${p._id}', +1)" class="btn btn-outline-secondary">+</button>
            </div>
            <button onclick="addToCart('${p._id}')" class="btn btn-success btn-sm"><i class="bi bi-cart-plus"></i></button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
});
window.updateQty = (id, diff) => {
  const input = document.getElementById(`qty-${id}`);
  if (!input) return;
  let value = parseInt(input.value, 10);
  if (isNaN(value)) value = 1;
  value += diff;
  const min = parseInt(input.min, 10) || 1;
  const max = parseInt(input.max, 10) || Infinity;
  if (value < min) value = min;
  if (value > max) value = max;
  input.value = value;
};
window.addToCart = (id) => {
  const value = parseInt(document.getElementById(`qty-${id}`).value, 10);
  const quantity = isNaN(value) ? 1 : value;
  socket.emit("cart:add", { productId: id, quantity });
  socket.emit("cart:getCount");
};
window.viewProduct = function (id) {
  window.location.href = `/product/${id}`;
};
socket.emit("cart:getCount");
socket.on("cart:count", (count) => {
  const btn = document.getElementById("cartCount");
  if (btn) {
    if (count === 0) {
      btn.innerHTML = '<i class="bi bi-cart"></i> Sin elementos';
    } else {
      btn.innerText = count + " elementos";
    }
  }
});
socket.on("product:data", (product) => {
  document.getElementById("productId").value = product._id;
  document.getElementById("title").value = product.title;
  document.getElementById("description").value = product.description;
  document.getElementById("code").value = product.code;
  document.getElementById("price").value = product.price;
  document.getElementById("stock").value = product.stock;
  document.getElementById("category").value = product.category;
});
function deleteProduct(id) {
  Swal.fire({
    title: "¿Eliminar producto?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      socket.emit("products:delete", id);
      Swal.fire({
        title: "Eliminado",
        text: "El producto fue eliminado correctamente",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  });
}
function editProduct(id) {
  editingId = id;
  socket.once("products:list", (products) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    document.getElementById("offcanvasTitle").innerText = "Editar producto";
    document.getElementById("productId").value = id;
    title.value = product.title;
    description.value = product.description;
    code.value = product.code;
    price.value = product.price;
    stock.value = product.stock;
    category.value = product.category;
    new bootstrap.Offcanvas("#productOffcanvas").show();
  });
  socket.emit("products:request");
}
function openCreateForm() {
  editingId = null;
  document.getElementById("offcanvasTitle").innerText = "Nuevo producto";
  document.getElementById("productForm").reset();
  new bootstrap.Offcanvas("#productOffcanvas").show();
}
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = {
    title: title.value,
    description: description.value,
    code: code.value,
    price: Number(price.value),
    stock: Number(stock.value),
    category: category.value,
  };
  if (editingId) {
    console.log(editingId, data);
    socket.emit("product:update", { id: editingId, data });
    Swal.fire("Producto actualizado", "", "success");
  } else {
    socket.emit("product:create", data);
    Swal.fire("Producto creado", "", "success");
  }
  form.reset();
});
select.addEventListener("change", async (e) => {
  btnDelete.disabled = false;
  const id = e.target.value;
  if (!id) return clearForm();
  const res = await fetch(`/api/products/${id}`);
  const product = await res.json();
  editingId = product._id;
  loadForm(product);
});
function loadForm(p) {
  document.getElementById("productId").value = p._id;
  document.getElementById("title").value = p.title || "";
  document.getElementById("description").value = p.description || "";
  document.getElementById("code").value = p.code || "";
  document.getElementById("price").value = p.price || "";
  document.getElementById("stock").value = p.stock || "";
  document.getElementById("category").value = p.category || "";
}
function clearForm() {
  document.getElementById("productForm").reset();
}
btnDelete.disabled = true;
btnDelete.onclick = () => {
  if (!editingId) return;
  if (confirm("¿Seguro que deseas eliminar este producto?")) {
    socket.emit("delete-product", editingId);
    alert("Producto eliminado");
    form.reset();
    editingId = null;
    btnDelete.disabled = true;
    socket.emit("products:get");
  }
};
