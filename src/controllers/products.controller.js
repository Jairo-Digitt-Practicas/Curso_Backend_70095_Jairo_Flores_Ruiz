/** @format */

import { v4 as uuidv4 } from "uuid";

let products = [];

export const getAllProducts = () => {
    return products;
};

export const getProductById = (id) => {
    return products.find((p) => p.id === id);
};

export const createProduct = (productData) => {
    const {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
    } = productData;
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
    return newProduct;
};

export const updateProduct = (id, productData) => {
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
        return null;
    }
    const updatedProduct = {
        ...products[productIndex],
        ...productData,
        id: products[productIndex].id,
    };
    products[productIndex] = updatedProduct;
    return updatedProduct;
};

export const deleteProduct = (id) => {
    const initialLength = products.length;
    products = products.filter((p) => p.id !== id);
    return products.length < initialLength;
};
