/** @format */

// tests/setup.js
import mongoose from "mongoose";
import app from "../index.js"; // Asegúrate de exportar tu aplicación Express desde 'src/app'

beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/testdb", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    // Insertar un producto de prueba
    await Product.create({
        title: "Test Product",
        description: "Description for test product",
        code: "TEST001",
        price: 100,
        status: true,
        stock: 10,
        category: "Test Category",
        thumbnails: ["http://example.com/test.jpg"],
    });
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});
