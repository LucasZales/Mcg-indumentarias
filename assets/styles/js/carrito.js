const IVA = 0.21;

let productos = [
    { id: 1, nombre: "Buzos", precio: 15000, stock: 15, stockInicial: 15, img: "../img/buzos.jpeg" },
    { id: 2, nombre: "Calzados", precio: 30000, stock: 10, stockInicial: 10, img: "../img/calzado.jpeg" },
    { id: 3, nombre: "Pantalones", precio: 40000, stock: 13, stockInicial: 13, img: "../img/pantalones.jpg" },
    { id: 4, nombre: "Remeras", precio: 12000, stock: 20, stockInicial: 20, img: "../img/remera.jpeg" },
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const contenedorProductos = document.getElementById("productos");
const carritoLista = document.getElementById("carrito");
const totalSpan = document.getElementById("total");
const btnVaciar = document.getElementById("vaciar-carrito");

function pintarProductos() {
    contenedorProductos.innerHTML = "";

    productos.forEach(producto => {
        const li = document.createElement("li");
        li.innerHTML = `
            <img src="${producto.img}" alt="${producto.nombre}" title="${producto.nombre}" class="logo">
            <p id="id">${producto.nombre}</p>
            <span class="precio" id="precio${producto.id}">$${producto.precio} (Stock: ${producto.stock})</span>
            <button class="comprar-btn" data-id="${producto.id}">Comprar</button>
            <span class="mensaje" id="mensaje${producto.id}"></span>
        `;
        contenedorProductos.appendChild(li);

        li.querySelector(".comprar-btn").addEventListener("click", () => agregarAlCarrito(producto.id));
    });
}

function calcularPrecioConIVA(precio) {
    return precio * (1 + IVA);
}

function actualizarCarrito() {
    carritoLista.innerHTML = "";

    carrito.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.cantidad} x ${item.nombre} = $${item.total.toFixed(2)}`;
        carritoLista.appendChild(li);
    });

    const total = carrito.reduce((acc, item) => acc + item.total, 0);
    totalSpan.textContent = total.toFixed(2);

    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function actualizarStock() {
    productos.forEach(producto => {
        const span = document.getElementById(`precio${producto.id}`);
        if (span) {
            span.textContent = `$${producto.precio} (Stock: ${producto.stock})`;
        }
    });

    localStorage.setItem("stock", JSON.stringify(productos));
}

function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);

    if (!producto || producto.stock <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'Sin stock',
            text: `No hay stock disponible de ${producto?.nombre || ""}`,
            timer: 1500,
            showConfirmButton: false
        });
        return;
    }

    producto.stock--;

    const totalProducto = calcularPrecioConIVA(producto.precio);
    const existente = carrito.find(item => item.nombre === producto.nombre);

    if (existente) {
        existente.cantidad++;
        existente.total += totalProducto;
    } else {
        carrito.push({ nombre: producto.nombre, cantidad: 1, total: totalProducto });
    }

    actualizarCarrito();
    actualizarStock();

    Swal.fire({
        icon: 'success',
        title: 'Producto agregado',
        text: `${producto.nombre} se agregó al carrito`,
        timer: 1500,
        showConfirmButton: false
    });
}

// -----------------------------
btnVaciar.addEventListener("click", () => {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Se eliminarán todos los productos del carrito",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, vaciar'
    }).then((result) => {
        if (result.isConfirmed) {
            carrito = [];
            productos.forEach(p => p.stock = p.stockInicial);

            localStorage.removeItem("carrito");
            localStorage.removeItem("stock");

            actualizarCarrito();
            actualizarStock();

            Swal.fire({
                icon: 'success',
                title: 'Carrito vaciado',
                timer: 1500,
                showConfirmButton: false
            });
        }
    });
});


const stockGuardado = JSON.parse(localStorage.getItem("stock"));
if (stockGuardado) {
    productos.forEach((p, i) => {
        p.stock = stockGuardado[i].stock;
    });
}

pintarProductos(); 
actualizarCarrito();
actualizarStock();
