/** @format */

import request from "supertest";
import app from "../index.js";

describe("Products API", () => {
    it("should list all products", async () => {
        const response = await request(app).get("/api/products");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
        expect(response.body).toHaveProperty("prevPage");
        expect(response.body).toHaveProperty("nextPage");
        expect(response.body).toHaveProperty("page");
        expect(response.body).toHaveProperty("hasPrevPage");
        expect(response.body).toHaveProperty("hasNextPage");
        expect(response.body).toHaveProperty("prevLink");
        expect(response.body).toHaveProperty("nextLink");
        expect(response.body).toHaveProperty("payload");
    });
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
    const productId = postResponse.body._id; // Asegúrate de usar `_id` o `id` consistentemente

    const response = await request(app).get(`/api/products/${productId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", productId);
});

it("should create a new product", async () => {
    const newProduct = {
        title: "New Test Product",
        description: "New description",
        code: "NT001",
        price: 150,
        status: true,
        stock: 20,
        category: "New Category",
        thumbnails: ["http://example.com/newimage.jpg"],
    };

    const response = await request(app).post("/api/products").send(newProduct);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.title).toBe(newProduct.title);
});

it("should update a product", async () => {
    const newProduct = {
        title: "Product to Update",
        description: "Update description",
        code: "UP001",
        price: 200,
        status: true,
        stock: 30,
        category: "Update Category",
        thumbnails: ["http://example.com/updateimage.jpg"],
    };

    const postResponse = await request(app)
        .post("/api/products")
        .send(newProduct);
    const productId = postResponse.body._id;

    const updatedProduct = {
        title: "Updated Product",
        price: 250,
    };

    const putResponse = await request(app)
        .put(`/api/products/${productId}`)
        .send(updatedProduct);
    expect(putResponse.status).toBe(200);
    expect(putResponse.body.title).toBe(updatedProduct.title);
    expect(putResponse.body.price).toBe(updatedProduct.price);
});

it("should delete a product", async () => {
    const newProduct = {
        title: "Product to Delete",
        description: "Delete description",
        code: "DEL001",
        price: 300,
        status: true,
        stock: 40,
        category: "Delete Category",
        thumbnails: ["http://example.com/deleteimage.jpg"],
    };

    const postResponse = await request(app)
        .post("/api/products")
        .send(newProduct);
    const productId = postResponse.body._id;

    const deleteResponse = await request(app).delete(
        `/api/products/${productId}`
    );
    expect(deleteResponse.status).toBe(204);

    const getResponse = await request(app).get(`/api/products/${productId}`);
    expect(getResponse.status).toBe(404);
});
