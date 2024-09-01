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

// Endpoint para obtener productos con paginación y filtros
router.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        let filter = {};
        if (query) {
            // Buscar por categoría o estado (status)
            filter = {
                $or: [
                    { category: new RegExp(query, "i") }, // Búsqueda por categoría (insensible a mayúsculas)
                    { status: query.toLowerCase() === "true" }, // Búsqueda por estado (disponibilidad)
                ],
            };
        }

        const options = {
            limit: parseInt(limit, 10),
            page: parseInt(page, 10),
            sort:
                sort === "asc"
                    ? { price: 1 }
                    : sort === "desc"
                    ? { price: -1 }
                    : {},
        };

        const products = await getAllProducts(filter, options);

        const response = {
            status: "success",
            payload: products.docs, // Asegúrate de que `products.docs` existe
            totalPages: products.totalPages, // Asegúrate de incluir totalPages
            prevPage: products.hasPrevPage ? products.prevPage : null,
            nextPage: products.hasNextPage ? products.nextPage : null,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage
                ? `/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}`
                : null,
            nextLink: products.hasNextPage
                ? `/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}`
                : null,
        };

        res.json(response);
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
        console.error("Error al obtener el producto:", error.message);
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

// Endpoint para actualizar un producto existente
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
        res.status(204).end(); // No content
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
});

export default router;
