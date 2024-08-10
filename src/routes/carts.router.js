/** @format */

import { Router } from "express";
import {
    getAllCarts,
    createCart,
    getCartById,
    addProductToCart,
} from "../controllers/carts.controller.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const carts = await getAllCarts();
        res.json(carts);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los carritos" });
    }
});

router.post("/", async (req, res) => {
    try {
        const newCart = createCart(req.body);
        res.status(201).json(newCart);
    } catch (error) {
        res.status(400).json({
            error: "Error al crear el carrito",
            details: error.message,
        });
    }
});

router.get("/:cid", async (req, res) => {
    try {
        const cart = await getCartById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        res.json(cart);
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).json({
            error: "Error al obtener el carrito",
            details: error.message,
        });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const updatedCart = await addProductToCart(
            req.params.cid,
            req.params.pid
        );
        res.status(201).json(updatedCart);
    } catch (error) {
        res.status(400).json({
            error: "Error al agregar el producto al carrito",
        });
    }
});

export default router;
