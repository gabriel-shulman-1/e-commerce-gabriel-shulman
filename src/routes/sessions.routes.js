const express = require("express");
const router = express.Router();
const passport = require("passport");
const sessionController = require("../controller/session.controller");

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Rutas de sesiones con JWT
 */

/**
 * @swagger
 * /api/sessions/login:
 *   post:
 *     summary: Iniciar sesion y obtener token JWT
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login correcto
 *       401:
 *         description: Credenciales invalidas
 */
router.post("/login", sessionController.login);

/**
 * @swagger
 * /api/sessions/current:
 *   get:
 *     summary: Obtener usuario actual desde JWT
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: Usuario autenticado
 *       401:
 *         description: Token ausente o invalido
 */
router.get("/current",passport.authenticate("jwt", { session: false }),sessionController.current);

module.exports = router;
