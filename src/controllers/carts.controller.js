/** @format */

import { v4 as uuidv4 } from "uuid";

let carts = [];

export const getAllCarts = () => {
    return carts;
};

export const createCart = (cartData) => {
    const newCart = {
        id: uuidv4(),
        products: [],
    };
    carts.push(newCart);
    return newCart;
};

export const getCartById = (cid) => {
    const cart = carts.find((c) => c.id === cid);
    if (!cart) {
        return null;
    }
    return cart;
};

export const addProductToCart = (req, res) => {
    try {
        const cart = carts.find((c) => c.id === req.params.cid);
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        const productIndex = cart.products.findIndex(
            (p) => p.product === req.params.pid
        );
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: req.params.pid, quantity: 1 });
        }
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({
            error: "Error al agregar el producto al carrito",
        });
    }
};

export const getCarts = () => carts;

export const addCartProduct = (cid, pid) => {
    const cart = carts.find((c) => c.id === cid);
    if (!cart) {
        return { error: "Carrito no encontrado" };
    }
    const productIndex = cart.products.findIndex((p) => p.product === pid);
    if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
    } else {
        cart.products.push({ product: pid, quantity: 1 });
    }
    return cart;
};
