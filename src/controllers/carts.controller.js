/** @format */

import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getAllCarts = async () => {
    return await Cart.find().populate("products.product");
};

export const createCart = async (cartData) => {
    try {
        const newCart = new Cart(cartData);
        return await newCart.save();
    } catch (error) {
        throw new Error("Error al crear el carrito: " + error.message);
    }
};

export const getCartById = async (cartId) => {
    console.log("ID recibido:", cartId);
    if (!isValidObjectId(cartId)) {
        console.error("ID del carrito no es válido:", cartId);
        throw new Error("ID del carrito no es válido");
    }
    try {
        const cart = await Cart.findById(cartId);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }
        return cart;
    } catch (error) {
        throw new Error(`Error al obtener el carrito: ${error.message}`);
    }
};

export const addProductToCart = async (cid, pid) => {
    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
        return { error: "ID del carrito o del producto no es válido" };
    }

    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return { error: "Carrito no encontrado" };
        }

        const product = await Product.findById(pid);
        if (!product) {
            return { error: "Producto no encontrado" };
        }

        const productIndex = cart.products.findIndex(
            (p) => p.product.toString() === pid
        );

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();
        return cart;
    } catch (error) {
        throw new Error(
            "Error al agregar el producto al carrito: " + error.message
        );
    }
};

export const updateCartProducts = async (cid, products) => {
    if (!isValidObjectId(cid)) {
        return { error: "ID del carrito no es válido" };
    }

    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return { error: "Carrito no encontrado" };
        }

        cart.products = products;
        await cart.save();

        return cart;
    } catch (error) {
        throw new Error(
            "Error al actualizar los productos del carrito: " + error.message
        );
    }
};

export const updateProductQuantityInCart = async (cid, pid, quantity) => {
    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
        return { error: "ID del carrito o del producto no es válido" };
    }

    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return { error: "Carrito no encontrado" };
        }

        const productIndex = cart.products.findIndex(
            (p) => p.product.toString() === pid
        );

        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
        } else {
            return { error: "Producto no encontrado en el carrito" };
        }

        await cart.save();
        return cart;
    } catch (error) {
        throw new Error(
            "Error al actualizar la cantidad del producto en el carrito: " +
                error.message
        );
    }
};

export const deleteProductFromCart = async (cid, pid) => {
    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
        return { error: "ID del carrito o del producto no es válido" };
    }

    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return { error: "Carrito no encontrado" };
        }

        cart.products = cart.products.filter(
            (p) => p.product.toString() !== pid
        );

        await cart.save();
        return cart;
    } catch (error) {
        throw new Error(
            "Error al eliminar el producto del carrito: " + error.message
        );
    }
};

export const deleteAllProductsFromCart = async (cid) => {
    if (!isValidObjectId(cid)) {
        return { error: "ID del carrito no es válido" };
    }

    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return { error: "Carrito no encontrado" };
        }

        cart.products = [];
        await cart.save();
        return cart;
    } catch (error) {
        throw new Error(
            "Error al eliminar todos los productos del carrito: " +
                error.message
        );
    }
};

export const removeProductFromCart = async (cid, pid) => {
    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
        return { error: "ID del carrito o del producto no es válido" };
    }

    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }

        const productIndex = cart.products.findIndex(
            (p) => p.product.toString() === pid
        );
        if (productIndex === -1) {
            throw new Error("Producto no encontrado en el carrito");
        }

        cart.products.splice(productIndex, 1);
        await cart.save();

        return cart;
    } catch (error) {
        throw new Error(
            "Error al eliminar el producto del carrito: " + error.message
        );
    }
};
