/** @format */

import express from "express";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();
let products = [];

router.get("/", (req, res) => {
    res.json(products);
});

router.get("/:pid", (req, res) => {
    const product = products.find((p) => p.id === req.params.pid);
    if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(product);
});

router.post("/", (req, res) => {
    const {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
    } = req.body;
    const newProduct = {
        id: uuidv4(),
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

router.put("/:pid", (req, res) => {
    const productIndex = products.findIndex((p) => p.id === req.params.pid);
    if (productIndex === -1) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }
    const updatedProduct = {
        ...products[productIndex],
        ...req.body,
        id: products[productIndex].id,
    };
    products[productIndex] = updatedProduct;
    res.json(updatedProduct);
});

router.delete("/:pid", (req, res) => {
    products = products.filter((p) => p.id !== req.params.pid);
    res.status(204).send();
});

export default router;
