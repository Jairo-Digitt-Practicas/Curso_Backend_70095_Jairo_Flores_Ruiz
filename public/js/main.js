// public/js/main.js
const socket = io();

const form = document.getElementById("product-form");
const productList = document.getElementById("product-list");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const code = document.getElementById("code").value;
    const price = document.getElementById("price").value;
    const status = document.getElementById("status").checked;
    const stock = document.getElementById("stock").value;
    const category = document.getElementById("category").value;

    const product = { title, description, code, price, status, stock, category };
    socket.emit("newProduct", product);
});

socket.on("updateProducts", (products) => {
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

productList.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
        const id = e.target.dataset.id;
        socket.emit("deleteProduct", id);
    }
});
