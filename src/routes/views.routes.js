const express = require("express");
const router = express.Router();
const viewController = require("../controller/view.controller.js");
const {
  authMiddleware,
  authLevel,
} = require("../middlewares/auth.middleware.js");

/**
 * @swagger
 * tags:
 *   name: Views
 *   description: Rutas que renderizan vistas Handlebars
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Renderizar vista de inicio
 *     tags: [Views]
 *     responses:
 *       200:
 *         description: Vista home renderizada
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin permisos
 *       500:
 *         description: Error al cargar la vista
 */
router.get("/", authMiddleware, authLevel("user","admin"), viewController.inicio);

/**
 * @swagger
 * /products-rt:
 *   get:
 *     summary: Renderizar productos en tiempo real
 *     tags: [Views]
 *     responses:
 *       200:
 *         description: Vista de productos en tiempo real
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin permisos
 *       500:
 *         description: Error al cargar datos de productos
 */
router.get(
  "/products-rt",
  authMiddleware,
  authLevel("user","admin"),
  viewController.products_rt,
);

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Renderizar vista del carrito
 *     tags: [Views]
 *     responses:
 *       200:
 *         description: Vista del carrito renderizada
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin permisos
 *       500:
 *         description: Error al cargar datos de productos
 */
router.get("/cart", authMiddleware, authLevel("user"), viewController.cart);

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Renderizar detalle de producto
 *     tags: [Views]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Vista de producto renderizada
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin permisos
 *       500:
 *         description: Error al cargar datos de productos
 */
router.get(
  "/product/:id",
  authMiddleware,
  authLevel("user","admin"),
  viewController.product_id,
);

/**
 * @swagger
 * /products-filtered:
 *   get:
 *     summary: Renderizar listado de productos filtrados
 *     tags: [Views]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *       - in: query
 *         name: priceMin
 *         schema:
 *           type: number
 *       - in: query
 *         name: priceMax
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Vista de productos filtrados renderizada
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin permisos
 *       500:
 *         description: Error al obtener productos
 */
router.get(
  "/products-filtered",
  authMiddleware,
  authLevel("user","admin"),
  viewController.products_filtered,
);

/**
 * @swagger
 * /createProduct:
 *   get:
 *     summary: Renderizar vista de gestion de productos
 *     tags: [Views]
 *     responses:
 *       200:
 *         description: Vista de gestion de productos renderizada
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       401:
 *         description: Usuario no autenticado
 *       403:
 *         description: Usuario sin permisos de administrador
 *       500:
 *         description: Error al cargar la vista
 */
router.get(
  "/createProduct",
  authMiddleware,
  authLevel("admin"),
  viewController.createProduct,
);

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Renderizar vista de login
 *     tags: [Views]
 *     responses:
 *       200:
 *         description: Vista de login renderizada
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Error al cargar la vista
 */
router.get("/login", viewController.login);

/**
 * @swagger
 * /register:
 *   get:
 *     summary: Renderizar vista de registro
 *     tags: [Views]
 *     responses:
 *       200:
 *         description: Vista de registro renderizada
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Error al cargar la vista
 */
router.get("/register", viewController.register);

/**
 * @swagger
 * /forgot-password:
 *   get:
 *     summary: Renderizar vista para solicitar recuperacion de password
 *     tags: [Views]
 *     responses:
 *       200:
 *         description: Vista de recuperacion renderizada
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Error al cargar la vista
 */
router.get("/forgot-password", viewController.forgotPassword);

/**
 * @swagger
 * /reset-password:
 *   get:
 *     summary: Renderizar vista para restablecer password
 *     tags: [Views]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de recuperacion
 *     responses:
 *       200:
 *         description: Vista de reset renderizada o mensaje de token invalido
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Error al cargar la vista
 */
router.get("/reset-password", viewController.resetPassword);
module.exports = router;
