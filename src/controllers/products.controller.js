/** @format */

import Product from "../models/Product.js";

export const getAllProducts = async (filter = {}, options = {}) => {
    try {
        const products = await Product.paginate(filter, options);
        return {
            ...products,
            page: products.page || 1,
        };
    } catch (error) {
        throw new Error("Error al obtener productos: " + error.message);
    }
};

export const getProductById = async (id) => {
    try {
        const product = await Product.findById(id);
        return product ? product : null;
    } catch (error) {
        console.error("Error al obtener el producto:", error.message);
        throw new Error("Error al obtener el producto: " + error.message);
    }
};

export const createProduct = async (productData) => {
    try {
        const newProduct = new Product(productData);
        return await newProduct.save();
    } catch (error) {
        throw new Error("Error al crear el producto: " + error.message);
    }
};

export const updateProduct = async (id, productData) => {
    try {
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

export const deleteProduct = async (id) => {
    try {
        const result = await Product.findByIdAndDelete(id);
        return result ? true : false;
    } catch (error) {
        throw new Error("Error al eliminar el producto: " + error.message);
    }
};
