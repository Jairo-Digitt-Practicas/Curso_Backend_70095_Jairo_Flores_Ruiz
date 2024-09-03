/** @format */

import express from "express";
import {
    getAllProducts,
    getProductById,
} from "../controllers/products.controller.js";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/products", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

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

        const filter = query
            ? { $or: [{ category: query }, { status: query }] }
            : {};

        const products = await getAllProducts(filter, options);

        res.render("index", {
            title: "Products",
            products: products.docs,
            totalPages: products.totalPages,
            currentPage: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.hasPrevPage
                ? `/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}`
                : null,
            nextPage: products.hasNextPage
                ? `/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}`
                : null,
        });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

router.get("/realtimeproducts", async (req, res) => {
    try {
        const options = {
            limit: 10,
            page: 1,
            sort: { createdAt: -1 },
        };

        const products = await getAllProducts({}, options);
        res.render("realtimeproducts", { products: products.docs });
    } catch (error) {
        console.error("Error al cargar productos en tiempo real:", error);
        res.status(500).send("Error al cargar productos en tiempo real");
    }
});

router.get("/products/:pid", async (req, res) => {
    try {
        const product = await getProductById(req.params.pid);
        if (!product) {
            return res
                .status(404)
                .render("error", { message: "Producto no encontrado" });
        }
        res.render("productDetail", { title: product.title, product });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto" });
    }
});

export default router;
