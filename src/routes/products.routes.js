const express = require("express");
const router = express.Router();
const ProductController = require("../controller/product.controller.js");
const {
  authMiddleware,
  authLevel,
} = require("../middlewares/auth.middleware.js"); 

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Rutas de administracion de productos
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Listar productos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de productos
 *       400:
 *         description: Error al obtener productos
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin permisos de administrador
 */
router.get("/", authMiddleware, authLevel("admin"), ProductController.list);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtener producto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       400:
 *         description: ID invalido o error de consulta
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin permisos de administrador
 *       404:
 *         description: Producto no encontrado
 */
router.get("/:id", authMiddleware, authLevel("admin"), ProductController.getById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear producto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, price, stock, category]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               category:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *     responses:
 *       201:
 *         description: Producto creado
 *       400:
 *         description: Datos invalidos
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin permisos de administrador
 */
router.post("/", authMiddleware, authLevel("admin"), ProductController.create);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Actualizar producto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
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
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               category:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin permisos de administrador
 *       404:
 *         description: Producto no encontrado
 */
router.put("/:id", authMiddleware, authLevel("admin"), ProductController.update);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Eliminar producto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin permisos de administrador
 *       404:
 *         description: Producto no encontrado
 */
router.delete("/:id", authMiddleware, authLevel("admin"), ProductController.delete);

/**
 * @swagger
 * /api/products/purchase:
 *   post:
 *     summary: Procesar compra de productos
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items]
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Resultado de la compra
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin permisos de administrador
 */
router.post("/purchase", authMiddleware, authLevel("admin"), ProductController.purchase);

/**
 * @swagger
 * /api/products/products/edit/{id}:
 *   get:
 *     summary: Obtener datos de producto para editar
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin permisos de administrador
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get("/products/edit/:id", authMiddleware, authLevel("admin"), ProductController.editProduct);
module.exports = router;
