/** @format */

import express from "express";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();
let carts = [];

router.post("/", (req, res) => {
    const newCart = {
        id: uuidv4(),
        products: [],
    };
    carts.push(newCart);
    res.status(201).json(newCart);
});

router.get("/:cid", (req, res) => {
    const cart = carts.find((c) => c.id === req.params.cid);
    if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.json(cart.products);
});

router.post("/:cid/product/:pid", (req, res) => {
    const cart = carts.find((c) => c.id === req.params.cid);
    if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
    }
    const productIndex = cart.products.findIndex(
        (p) => p.product === req.params.pid
    );
    if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
    } else {
        cart.products.push({ product: req.params.pid, quantity: 1 });
    }
    res.status(201).json(cart);
});

export default router;
