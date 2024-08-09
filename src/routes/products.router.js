/** @format */

import express from "express";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/products.controller.js";

const router = express.Router();

router.get("/", (req, res) => {
    try {
        const products = getAllProducts(); // Aquí debería devolverse una promesa si es asíncrono
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener productos" });
    }
});

router.get("/:pid", (req, res) => {
    try {
        const product = getProductById(req.params.pid); // Aquí también debería devolverse una promesa si es asíncrono
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto" });
    }
});

router.post("/", (req, res) => {
    try {
        const newProduct = createProduct(req.body); // Aquí también debería devolverse una promesa si es asíncrono
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: "Error al crear el producto" });
    }
});

router.put("/:pid", (req, res) => {
    try {
        const updatedProduct = updateProduct(req.params.pid, req.body); // Aquí también debería devolverse una promesa si es asíncrono
        if (!updatedProduct) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: "Error al actualizar el producto" });
    }
});

router.delete("/:pid", (req, res) => {
    try {
        const result = deleteProduct(req.params.pid); // Aquí también debería devolverse una promesa si es asíncrono
        if (!result) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
});

export default router;
