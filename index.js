/** @format */

import express from "express";
import { create } from "express-handlebars";
import productsRouter from "./src/routes/products.router.js";
import cartsRouter from "./src/routes/carts.router.js";
import viewsRouter from "./src/routes/views.router.js";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import {
    getAllProducts,
    createProduct,
    deleteProduct,
} from "./src/controllers/products.controller.js";
import {
    getCartById,
    addProductToCart,
} from "./src/controllers/carts.controller.js";

const app = express();
const PORT = 8080;

const hbs = create({
    extname: ".handlebars",
    defaultLayout: "main",
    layoutsDir: path.join(process.cwd(), "views", "layouts"),
    partialsDir: path.join(process.cwd(), "views", "partials"),
});

app.engine(".handlebars", hbs.engine);
app.set("view engine", ".handlebars");
app.set("views", path.join(process.cwd(), "views"));

app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

app.get("/products", (req, res) => {
    res.render("index", { title: "Products", products: getAllProducts() });
});

app.get("/realtimeproducts", (req, res) => {
    const products = getAllProducts();
    res.render("realTimeProducts", {
        title: "Real-Time Products",
        products,
    });
});

app.post("/realtimeproducts", (req, res) => {
    const { title, description, code, price, status, stock, category } =
        req.body;
    if (!title || !description || !code || !price || !stock || !category) {
        return res
            .status(400)
            .json({ error: "Datos del producto incompletos" });
    }
    try {
        const newProduct = createProduct({
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
        });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: "Error al crear producto" });
    }
});

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
    console.log("A user connected");
    socket.emit("updateProducts", getAllProducts());
    socket.emit("updateCarts", getCartById());

    socket.on("newProduct", (product) => {
        if (!product || !product.title || !product.price) {
            socket.emit("error", "Datos del producto incompletos");
            return;
        }
        try {
            createProduct(product);
            io.emit("updateProducts", getAllProducts());
        } catch (error) {
            socket.emit("error", "Error al crear producto");
        }
    });

    socket.on("deleteProduct", (id) => {
        try {
            deleteProduct(id);
            io.emit("updateProducts", getAllProducts());
        } catch (error) {
            socket.emit("error", "Error al eliminar producto");
        }
    });

    socket.on("addProductToCart", ({ cid, pid }) => {
        const updatedCart = addProductToCart(cid, pid);
        if (updatedCart.error) {
            socket.emit("error", updatedCart.error);
        } else {
            io.emit("updateCarts", getCartById(cid));
        }
    });

    socket.on("updateProducts", (products) => {
        console.log("Received updateProducts event with data:", products);
        productList.innerHTML = "";
        products.forEach((product) => {
            const li = document.createElement("li");
            li.textContent = `${product.title} - ${product.description}`;
            const button = document.createElement("button");
            button.textContent = "Eliminar";
            button.dataset.id = product.id;
            li.appendChild(button);
            productList.appendChild(li);
        });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

export default app;
