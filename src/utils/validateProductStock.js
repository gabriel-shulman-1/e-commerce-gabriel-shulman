function validateProductStock(product, quantityRequested, currentQuantityInCart = 0) {
  if (!product) {
    return {
      ok: false,
      error: "El producto no existe"
    };
  }
  if (quantityRequested <= 0) {
    return {
      ok: false,
      error: "La cantidad debe ser mayor a 0"
    };
  }
  if (currentQuantityInCart + quantityRequested > product.stock) {
    return {
      ok: false,
      error: `Stock insuficiente. Stock disponible: ${product.stock}, cantidad pedida: ${currentQuantityInCart + quantityRequested}`
    };
  }
  return {
    ok: true
  };
};

module.exports = validateProductStock;