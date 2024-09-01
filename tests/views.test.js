/** @format */

import request from "supertest";
import app from "../index.js"; // Ajusta la ruta según tu estructura de proyecto
import mongoose from "mongoose";
import Product from "../src/models/Product.js";

let validProductId;

beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/mi_base_de_datos", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    // Crear un producto de prueba
    const product = await Product.create({
        title: "Test Product",
        description: "Description for test product",
        code: "TEST001",
        price: 100,
        status: true,
        stock: 10,
        category: "Test Category",
        thumbnails: ["http://example.com/test.jpg"],
    });

    validProductId = product._id.toString();
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe("Product API", () => {
    it("should delete a product", async () => {
        // Verificar que el producto existe antes de eliminarlo
        const getProductResponse = await request(app).get(
            `/api/products/${validProductId}`
        );
        expect(getProductResponse.status).toBe(200);

        // Eliminar el producto
        const deleteResponse = await request(app).delete(
            `/api/products/${validProductId}`
        );
        expect(deleteResponse.status).toBe(204); // No content

        // Intentar obtener el producto eliminado debería devolver 404
        const secondGetProductResponse = await request(app).get(
            `/api/products/${validProductId}`
        );
        expect(secondGetProductResponse.status).toBe(404);
    });
});
