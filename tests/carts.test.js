/** @format */

import request from "supertest";
import app from "../index.js";

describe("Carts API", () => {
    it("should create a new cart", async () => {
        const response = await request(app).post("/api/carts");
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("_id");
        expect(response.body.products).toBeInstanceOf(Array);
    });

    it("should get products of a cart by id", async () => {
        const postResponse = await request(app).post("/api/carts");
        const cartId = postResponse.body._id;

        if (!cartId) {
            throw new Error("No se obtuvo un ID de carrito válido");
        }

        const response = await request(app).get(`/api/carts/${cartId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("products");
        expect(response.body.products).toBeInstanceOf(Array);
    });
});
