    const IVA = 0.21;

    // Productos con stock y stock inicial
    const productos = [
    { id: 1, nombre: "Buzos", precio: 15000, stock: 15, stockInicial: 15 },
    { id: 2, nombre: "Calzados", precio: 30000, stock: 10, stockInicial: 10 },
    { id: 3, nombre: "Pantalones", precio: 40000, stock: 13, stockInicial: 13 },
    { id: 4, nombre: "Remeras", precio: 12000, stock: 20, stockInicial: 20 }
    ];

    let carrito = [];

    const carritoLista = document.getElementById("carrito");
    const totalSpan = document.getElementById("total");
    const botonesComprar = document.querySelectorAll(".comprar-btn");
    const btnVaciar = document.getElementById("vaciar-carrito");


    const calcularPrecioConIVA = (precio) => precio * (1 + IVA)
    function actualizarCarrito() {
    carritoLista.innerHTML = "";
    carrito.forEach(item => {
        const li = document.createElement("li");
        li.classList.add("li");
        li.textContent = `${item.cantidad} x ${item.nombre} = $${item.total.toFixed(2)}`;
        carritoLista.appendChild(li);
    });

    const total = carrito.reduce((acc, item) => acc + item.total, 0);
    totalSpan.textContent = total.toFixed(2);
    }

    function actualizarStock() {
    productos.forEach(producto => {
        const precioSpan = document.getElementById(`precio${producto.id}`);
        precioSpan.textContent = `$${producto.precio} (Stock: ${producto.stock})`;
    });
    }

    botonesComprar.forEach(btn => {
    btn.addEventListener("click", () => {
        const id = parseInt(btn.dataset.id);
        const producto = productos.find(p => p.id === id);

        if (producto.stock > 0) {
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

        const mensajeSpan = document.getElementById(`mensaje${id}`);
        mensajeSpan.textContent = `✅ ${producto.nombre} agregado al carrito`;
        mensajeSpan.style.color = "green";

        setTimeout(() => {
            mensajeSpan.textContent = "";
        }, 2000);

        } else {
        alert("Sin stock disponible para este producto.");
        }
    });
    });

    // Vaciar carrito y restaurar stock
    btnVaciar.addEventListener("click", () => {
    carrito = [];
    productos.forEach(producto => {
        producto.stock = producto.stockInicial;
    });
    actualizarCarrito();
    actualizarStock();
    });

    // Inicializa stock al cargar la página
    actualizarStock();