const socket = io();

window.updateQty = (id, diff) => {
  const input = document.getElementById(`qty-${id}`);
  if (!input) return;
  let value = parseInt(input.value, 10) || 1;
  value += diff;
  const min = parseInt(input.min, 10) || 1;
  const max = parseInt(input.max, 10) || Infinity;
  if (value < min) value = min;
  if (value > max) value = max;
  input.value = value;
};

window.addToCart = (id) => {
  const input = document.getElementById(`qty-${id}`);
  const quantity = parseInt(input.value, 10) || 1;
  socket.emit("cart:add", { productId: id, quantity });
  socket.emit("cart:count");
};

socket.emit("cart:count");
socket.on("cart:count", (count) => {
  const btn = document.getElementById("cartCount");
  if (btn) btn.innerText = `Cart (${count})`;
});

socket.on("products:updated", () => {
  location.reload();
});

// CRUD MODAL (si usas el CRUD admin desde realtime)
const form = document.getElementById("productForm");
let editingId = null;

window.editProduct = (id) => {
  editingId = id;
  socket.emit("products:request");
  socket.once("products:list", (products) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    document.getElementById("offcanvasTitle").innerText = "Editar producto";
    title.value = product.title;
    description.value = product.description;
    code.value = product.code;
    price.value = product.price;
    stock.value = product.stock;
    category.value = product.category;
    new bootstrap.Offcanvas("#productOffcanvas").show();
  });
};

window.openCreateForm = () => {
  editingId = null;
  form.reset();
  document.getElementById("offcanvasTitle").innerText = "Nuevo producto";
  new bootstrap.Offcanvas("#productOffcanvas").show();
};

window.deleteProduct = (id) => {
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
    }
  });
};

if (form) {
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
      socket.emit("products:update", { id: editingId, data });
    } else {
      socket.emit("products:create", data);
    }
    editingId = null;
    bootstrap.Offcanvas.getInstance(productOffcanvas).hide();
  });
}
