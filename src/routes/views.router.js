/** @format */

import express from "express";
import { getAllProducts } from "../controllers/products.controller.js";

const router = express.Router();

router.get("/products", (req, res) => {
    const products = getAllProducts();
    res.render("index", { title: "Products", products });
});

router.get("/realtimeproducts", (req, res) => {
    const products = getAllProducts();
    res.render("realTimeProducts", { title: "Real-Time Products", products });
});

export default router;
