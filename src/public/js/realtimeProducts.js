const socket = io();
const container = document.getElementById("products-container");
const form = document.getElementById("productForm");

let editingId = null;

socket.on("products:list", (products) => {
  container.innerHTML = "";

  products.forEach(p => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-3";

    col.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h5>${p.title}</h5>
          <p>${p.description}</p>
          <p><strong>$${p.price}</strong> | Stock: ${p.stock}</p>

          <button class="btn btn-warning btn-sm me-2" onclick="editProduct(${p.id})">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id})">Eliminar</button>
        </div>
      </div>
    `;

    container.appendChild(col);
  });
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
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      socket.emit("products:delete", id);

      Swal.fire({
        title: "Eliminado",
        text: "El producto fue eliminado correctamente",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });
    }
  });
}

function editProduct(id) {
  editingId = id;

  socket.once("products:list", (products) => {
    const product = products.find(p => p.id === id);
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

form.addEventListener("submit", e => {
  e.preventDefault();

  const data = {
    title: title.value,
    description: description.value,
    code: code.value,
    price: Number(price.value),
    stock: Number(stock.value),
    category: category.value
  };

  if (editingId) {
    socket.emit("products:update", { id: editingId, data });
  } else {
    socket.emit("products:create", data);
  }

  form.reset();
  editingId = null;
  bootstrap.Offcanvas.getInstance(productOffcanvas).hide();
});
