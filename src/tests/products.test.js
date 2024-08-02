/** @format */

// tests/products.test.js
import request from "supertest";
import app from "../../index.js";

describe("Products API", () => {
    it("should list all products", async () => {
        const response = await request(app).get("/api/products");
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    it("should get a product by id", async () => {
        const newProduct = {
            title: "Test Product",
            description: "Description of test product",
            code: "TP001",
            price: 100,
            status: true,
            stock: 10,
            category: "Test Category",
            thumbnails: ["http://example.com/image1.jpg"],
        };

        const postResponse = await request(app)
            .post("/api/products")
            .send(newProduct);
        const productId = postResponse.body.id;

        const response = await request(app).get(`/api/products/${productId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id", productId);
    });

    // Add more tests for POST, PUT and DELETE routes...
});
