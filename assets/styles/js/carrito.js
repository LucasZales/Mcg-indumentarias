const IVA = 0.21;

let productos = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// DOM
const carritoLista = document.getElementById("carrito");
const totalSpan = document.getElementById("total");
const btnVaciar = document.getElementById("vaciar-carrito");

// -----------------------------
//  Cargar productos con fetch
// -----------------------------
async function cargarProductos() {
    try {
        const res = await fetch("../../assets/data/productos.json");
        productos = await res.json();

        // Guardar stock inicial
        productos.forEach(p => p.stockInicial = p.stock);

        // Restaurar stock guardado
        const stockGuardado = JSON.parse(localStorage.getItem("stock"));
        if (stockGuardado) {
            productos.forEach((p, i) => {
                p.stock = stockGuardado[i].stock;
            });
        }

        pintarProductos();
        actualizarCarrito();
        actualizarStock();

    } catch (error) {
        console.error("Error cargando productos:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los productos',
        });
    }
}

// -----------------------------
//  Pintar productos y agregar eventos
// -----------------------------
function pintarProductos() {
    productos.forEach(producto => {
        const precioSpan = document.getElementById(`precio${producto.id}`);
        precioSpan.textContent = `$${producto.precio} (Stock: ${producto.stock})`;

        const btn = document.querySelector(`.comprar-btn[data-id="${producto.id}"]`);
        btn.addEventListener("click", () => agregarAlCarrito(producto.id));
    });
}

// -----------------------------
function calcularPrecioConIVA(precio) {
    return precio * (1 + IVA);
}

// -----------------------------
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

// -----------------------------
function actualizarStock() {
    productos.forEach(producto => {
        const span = document.getElementById(`precio${producto.id}`);
        span.textContent = `$${producto.precio} (Stock: ${producto.stock})`;
    });

    localStorage.setItem("stock", JSON.stringify(productos));
}

// -----------------------------
// Agregar al carrito
// -----------------------------
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);

    if (!producto || producto.stock <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'Sin stock',
            text: `No hay stock disponible de ${producto.nombre}`,
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
// Vaciar carrito con confirmación
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
            productos.forEach(p => p.stock = p.stockInicial ?? p.stock);

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

// -----------------------------
// Inicializar tienda
// -----------------------------
cargarProductos();
