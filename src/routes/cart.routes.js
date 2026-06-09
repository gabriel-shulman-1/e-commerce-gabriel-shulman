const router = require("express").Router();
const CartController = require ("../controller/cart.controler.js");
const {
  authMiddleware,
  authLevel,
} = require("../middlewares/auth.middleware.js");

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Rutas del carrito de compras
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Obtener el carrito
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Carrito actual
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin permisos
 */
router.get("/", authMiddleware, authLevel("user"), CartController.getCart);

/**
 * @swagger
 * /api/cart/qty:
 *   get:
 *     summary: Obtener cantidad total de productos en el carrito
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cantidad total del carrito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin permisos
 */
router.get("/qty", authMiddleware, authLevel("user"), CartController.getQuantity);

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Agregar un producto al carrito
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId]
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       200:
 *         description: Carrito actualizado
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin permisos
 */
router.post("/", authMiddleware, authLevel("user"), CartController.addCart);

/**
 * @swagger
 * /api/cart/{productId}:
 *   put:
 *     summary: Actualizar cantidad de un producto del carrito
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Carrito actualizado
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin permisos
 */
router.put("/:productId", authMiddleware, authLevel("user"), CartController.updateElement);

/**
 * @swagger
 * /api/cart/{productId}:
 *   delete:
 *     summary: Eliminar un producto del carrito
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Carrito actualizado
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin permisos
 */
router.delete("/:productId", authMiddleware, authLevel("user"), CartController.deleteElement);

/**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: Vaciar el carrito
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Carrito vaciado
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin permisos
 */
router.delete("/", authMiddleware, authLevel("user"), CartController.deleteAll);

module.exports = router;
