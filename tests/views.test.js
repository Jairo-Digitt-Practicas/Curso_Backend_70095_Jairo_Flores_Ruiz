/** @format */

import request from "supertest";
import app from "../index.js";
import mongoose from "mongoose";
import Product from "../src/models/Product.js";

let validProductId;

beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/mi_base_de_datos", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

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
        const getProductResponse = await request(app).get(
            `/api/products/${validProductId}`
        );
        expect(getProductResponse.status).toBe(200);

        const deleteResponse = await request(app).delete(
            `/api/products/${validProductId}`
        );
        expect(deleteResponse.status).toBe(204);

        const secondGetProductResponse = await request(app).get(
            `/api/products/${validProductId}`
        );
        expect(secondGetProductResponse.status).toBe(404);
    });
});
