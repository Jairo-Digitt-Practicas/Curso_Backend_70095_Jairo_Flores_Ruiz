/** @format */

import express from "express";
import connectDB from "./src/database/database.js";
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
import mongoose from "mongoose";

const app = express();

connectDB();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const hbs = create({
    extname: ".handlebars",
    defaultLayout: "main",
    layoutsDir: path.join(process.cwd(), "views", "layouts"),
    partialsDir: path.join(process.cwd(), "views", "partials"),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
});

app.engine(".handlebars", hbs.engine);
app.set("view engine", ".handlebars");
app.set("views", path.join(process.cwd(), "views"));

app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

app.use("/carts", cartsRouter);

app.get("/products", async (req, res) => {
    try {
        const products = await getAllProducts();
        res.render("index", { title: "Products", products });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

app.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await getAllProducts(); // Asegúrate de que getAllProducts() devuelve un array
        res.render("index", { title: "Products", products });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

app.post("/realtimeproducts", async (req, res) => {
    const { title, description, code, price, status, stock, category } =
        req.body;
    if (!title || !description || !code || !price || !stock || !category) {
        return res
            .status(400)
            .json({ error: "Datos del producto incompletos" });
    }
    try {
        const newProduct = await createProduct({
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
// Crear el servidor HTTP y Socket.io
const server = http.createServer(app);
const io = new Server(server);

// Manejar la conexión de Socket.io
io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");

    socket.on("filterProducts", async (query) => {
        try {
            let filter = {};
            if (query.category) {
                filter.category = new RegExp(query.category, "i");
            }
            if (query.status) {
                filter.status = query.status === "true";
            }

            const options = {
                limit: 10,
                page: 1,
                sort: query.sort
                    ? { price: query.sort === "asc" ? 1 : -1 }
                    : {},
            };

            const products = await getAllProducts(filter, options);
            socket.emit("updateProducts", { products: products.docs });
        } catch (error) {
            console.error("Error al filtrar productos:", error.message);
            socket.emit("error", "Error al filtrar productos");
        }
    });

    // Evento para manejar la paginación
    socket.on("paginate", async ({ page }) => {
        try {
            const options = {
                limit: 10,
                page: page || 1, // Si no se proporciona página, utiliza la página 1 por defecto
                sort: { createdAt: -1 },
            };
            const products = await getAllProducts({}, options);

            console.log(
                "Productos enviados al cliente para la página",
                page,
                ":",
                products.docs
            ); // Verifica los productos enviados

            socket.emit("updateProducts", {
                products: products.docs, // Asegúrate de que `products.docs` es un array
                currentPage: page,
                hasNextPage: products.hasNextPage,
                hasPrevPage: products.hasPrevPage,
                nextPage: products.nextPage,
                prevPage: products.prevPage,
            });
        } catch (error) {
            console.error("Error al paginar productos:", error.message);
            socket.emit("error", "Error al paginar productos");
        }
    });

    // Evento para manejar la creación de un nuevo producto
    socket.on("newProduct", async (productData) => {
        try {
            const newProduct = await createProduct(productData);

            const options = {
                limit: 10,
                page: 1, // Mantenemos siempre en la primera página
                sort: { createdAt: -1 }, // Ordenamos por la fecha de creación
            };
            const updatedProducts = await getAllProducts({}, options);
            socket.emit("updateProducts", {
                products: updatedProducts.docs, // Usar products.docs si usas mongoose-paginate-v2
                currentPage: 1,
            });
        } catch (error) {
            console.error("Error al agregar nuevo producto:", error.message);
            socket.emit("error", "Error al agregar nuevo producto");
        }
    });

    // Evento para manejar la eliminación de un producto
    socket.on("deleteProduct", async (productId) => {
        try {
            await deleteProduct(productId);

            const options = {
                limit: 10,
                page: 1,
                sort: { createdAt: -1 },
            };
            const updatedProducts = await getAllProducts({}, options);
            socket.emit("updateProducts", {
                products: updatedProducts.docs,
                currentPage: 1,
            });
        } catch (error) {
            socket.emit(
                "error",
                "Error al eliminar producto: " + error.message
            );
        }
    });

    // Manejar la desconexión del cliente
    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
    });
});

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

hbs.handlebars.registerHelper("eq", function (a, b, options) {
    if (a === b) {
        return options.fn(this); // Renderiza el bloque 'if' si a y b son iguales
    } else {
        return options.inverse(this); // Renderiza el bloque 'else' si a y b no son iguales
    }
});

export default app;
