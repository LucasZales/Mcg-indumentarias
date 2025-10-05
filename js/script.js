// - Variables y arrays -
const iva = 0.21;
let productos = [
    "Buzos", "Calzado", "Pantalones",      
    "Remeras",                       
];

let precios = [
    15000, 30000, 40000,
    12000
];

let stock = [
    15, 10 , 13,
    20
];

function mostrarProductos() {
    console.log("lista de productos en Mcg indumentarias");
    for (let i = 0; i < productos.length; i++) {
    console.log(`${i + 1}. ${productos[i]} - $${precios[i]} (Stock: ${stock[i]})`);
    }
}

function seleccionarProducto() {
    let lista = "";
    for (let i = 0; i < productos.length; i++) {
    lista += `${i + 1}. ${productos[i]} - $${precios[i]} (Stock: ${stock[i]})\n`;
    }
    let indice = prompt("seleccione un producto:\n" + lista);
    indice = parseInt(indice) - 1;
    if (indice >= 0 && indice < productos.length) {
    return indice;
    } else {
    alert("Opción inválida.");
    return 0;
    }
}

function calcularTotal(indiceProducto, cantidad) {
  let subtotal = precios[indiceProducto] * cantidad;
  return subtotal * (1 + iva);
}

alert("MCG Indumentarias catalogo");

let totalGeneral = 0;
let carrito = [];

let continuar = true;
while (continuar) {
    mostrarProductos();
    let indice = seleccionarProducto();
    let cantidad = prompt(`¿Cuántas unidades de ${productos[indice]} desea comprar?`);
    cantidad = parseInt(cantidad);

    if (cantidad > 0 && cantidad <= stock[indice]) {
    let total = calcularTotal(indice, cantidad);
    totalGeneral += total;
    stock[indice] -= cantidad;
    carrito.push(`${cantidad} x ${productos[indice]} = $${total}`);
    alert(`Has agregado ${cantidad} ${productos[indice]}.\nSubtotal con IVA: $${total}`);
    console.log(`Stock restante de ${productos[indice]}: ${stock[indice]}`);
    } else {
    alert("Cantidad inválida o sin stock disponible.");
    }

    continuar = confirm("¿Desea continuar comprando?");
}

// total
let resumen = "Resumen de la compra:\n";
for (let item of carrito) {
    resumen += item + "\n";
}
resumen += `\nTOTAL : $${totalGeneral}`;
alert(resumen);
console.log(resumen);



