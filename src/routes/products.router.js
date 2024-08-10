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

router.get("/", async (req, res) => {
    try {
        const products = await getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener productos" });
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const product = await getProductById(req.params.pid);
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto" });
    }
});

router.post("/", async (req, res) => {
    try {
        const newProduct = await createProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: "Error al crear el producto" });
    }
});

router.put("/:pid", async (req, res) => {
    try {
        const updatedProduct = await updateProduct(req.params.pid, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: "Error al actualizar el producto" });
    }
});

router.delete("/:pid", async (req, res) => {
    try {
        const result = await deleteProduct(req.params.pid);
        if (!result) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
});

export default router;
