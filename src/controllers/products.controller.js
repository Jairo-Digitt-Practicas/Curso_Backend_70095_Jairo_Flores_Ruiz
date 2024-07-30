/** @format */

import { v4 as uuidv4 } from "uuid";
import products from "../data/products.js";

export const getProducts = (req, res) => {
    res.json(products);
};

export const getProductById = (req, res) => {
    const product = products.find((p) => p.id === req.params.pid);
    if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(product);
};

export const createProduct = (req, res) => {
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
};

export const updateProduct = (req, res) => {
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
};

export const deleteProduct = (req, res) => {
    products = products.filter((p) => p.id !== req.params.pid);
    res.status(204).send();
};
