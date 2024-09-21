/** @format */

import Product from "../models/Product.js";

export const getAllProducts = async (filter = {}, options = {}) => {
    try {
        const products = await Product.paginate(filter, options);
        return products;
    } catch (error) {
        throw new Error("Error al obtener los productos: " + error.message);
    }
};

export const getProductById = async (id) => {
    try {
        if (!id) {
            throw new Error("ID del producto no proporcionado");
        }
        const product = await Product.findById(id);
        if (!product) {
            throw new Error("Producto no encontrado");
        }
        return product;
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        throw new Error("Error al obtener el producto: " + error.message);
    }
};

export const createProduct = async (productData) => {
    const { title, price } = productData;
    if (!title || !price) {
        throw new Error("Faltan datos obligatorios");
    }
    try {
        const newProduct = new Product(productData);
        const savedProduct = await newProduct.save();
        return savedProduct;
    } catch (error) {
        throw new Error("Error al crear el producto");
    }
};

export const updateProduct = async (id, productData) => {
    try {
        if (
            productData.status !== undefined &&
            typeof productData.status === "string"
        ) {
            productData.status = productData.status.toLowerCase() === "true";
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            productData,
            {
                new: true,
                runValidators: true,
            }
        );
        return updatedProduct ? updatedProduct : null;
    } catch (error) {
        throw new Error("Error al actualizar el producto: " + error.message);
    }
};

export const deleteProduct = async (productId) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return null;
        }

        const updatedProducts = await Product.find();
        return updatedProducts;
    } catch (error) {
        throw new Error("Error al eliminar el producto: " + error.message);
    }
};
