// ELEMENTOS
const contenedor = document.getElementById("productos");
const buscador = document.getElementById("busqueda");
const categoria = document.getElementById("categoria");

const carritoIcono = document.getElementById("carrito-icono");
const modal = document.getElementById("modal-carrito");

const carritoItems = document.getElementById("carrito-items");
const totalElemento = document.getElementById("carrito-total");
const contador = document.getElementById("contador-carrito");

const btnVaciar = document.getElementById("vaciar-carrito");
const btnPagar = document.getElementById("pagar");
const btnCerrar = document.getElementById("cerrar-carrito");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


// =======================
// CARGAR PRODUCTOS
// =======================
function cargar(){
    contenedor.innerHTML = "";

    let filtrados = libros.filter(l =>
        (categoria.value === "todas" || l.categoria === categoria.value) &&
        l.titulo.toLowerCase().includes(buscador.value.toLowerCase())
    );

    if(filtrados.length === 0){
        document.getElementById("sin-resultados").classList.remove("oculto");
    } else {
        document.getElementById("sin-resultados").classList.add("oculto");
    }

    filtrados.forEach(l => {
        const div = document.createElement("div");
        div.classList.add("producto");

        div.innerHTML = `
            <img src="${l.imagen}">
            <h3>${l.titulo}</h3>
            <p>$${l.precio}</p>
            <button data-id="${l.id}">Agregar</button>
        `;

        div.querySelector("button").addEventListener("click", () => agregar(l.id));

        contenedor.appendChild(div);
    });
}


// =======================
// AGREGAR AL CARRITO
// =======================
function agregar(id){
    let item = carrito.find(x => x.id === id);

    if(item){
        item.cantidad++;
    } else {
        let libro = libros.find(x => x.id === id);
        // Asegurarse de que el precio sea un número
        carrito.push({ ...libro, cantidad:1, precio: Number(libro.precio) });
    }

    guardar();
    actualizarCarrito();
}


// =======================
// GUARDAR LOCALSTORAGE
// =======================
function guardar(){
    localStorage.setItem("carrito", JSON.stringify(carrito));
}


// =======================
// ACTUALIZAR UI CARRITO (CORREGIDO)
// =======================
function actualizarCarrito(){
    carritoItems.innerHTML = "";
    let total = 0;
    let totalItems = 0;

    if(carrito.length === 0){
        carritoItems.innerHTML = "<p>Carrito vacío</p>";
        totalElemento.textContent = "0.00";
        contador.textContent = "0";
        return;
    }

    carrito.forEach((item, index) => {
        // Asegurar que cantidad y precio son números
        let cantidad = Number(item.cantidad);
        let precio = Number(item.precio);
        let subtotal = precio * cantidad;
        
        total += subtotal;
        totalItems += cantidad;

        const div = document.createElement("div");
        div.classList.add("carrito-item");
        div.innerHTML = `
            <p><strong>${item.titulo}</strong></p>
            <p>Cantidad: 
                <button class="btn-cantidad menos" data-id="${item.id}">-</button>
                ${cantidad}
                <button class="btn-cantidad mas" data-id="${item.id}">+</button>
            </p>
            <p>Subtotal: $${subtotal.toFixed(2)}</p>
            <button class="btn-eliminar" data-id="${item.id}">Eliminar</button>
            <hr>
        `;

        carritoItems.appendChild(div);
    });

    // Agregar event listeners para los botones de cantidad y eliminar
    document.querySelectorAll('.btn-cantidad.menos').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = Number(btn.dataset.id);
            cambiarCantidad(id, -1);
        });
    });

    document.querySelectorAll('.btn-cantidad.mas').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = Number(btn.dataset.id);
            cambiarCantidad(id, 1);
        });
    });

    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = Number(btn.dataset.id);
            eliminarItem(id);
        });
    });

    totalElemento.textContent = total.toFixed(2);
    contador.textContent = totalItems;
}

// Función para cambiar cantidad de un item
function cambiarCantidad(id, delta) {
    const item = carrito.find(x => x.id === id);
    if (item) {
        const nuevaCantidad = item.cantidad + delta;
        if (nuevaCantidad <= 0) {
            // Si la cantidad llega a 0, eliminar el item
            carrito = carrito.filter(x => x.id !== id);
        } else {
            item.cantidad = nuevaCantidad;
        }
        guardar();
        actualizarCarrito();
    }
}

// Función para eliminar un item completamente
function eliminarItem(id) {
    carrito = carrito.filter(x => x.id !== id);
    guardar();
    actualizarCarrito();
}


// =======================
// VACIAR CARRITO (CORREGIDO)
// =======================
btnVaciar.addEventListener("click", () => {
    if(carrito.length > 0){
        if(confirm("¿Estás seguro de que quieres vaciar el carrito?")){
            carrito = [];
            guardar();
            actualizarCarrito();
        }
    } else {
        alert("El carrito ya está vacío");
    }
});


// =======================
// PAGAR (CORREGIDO)
// =======================
btnPagar.addEventListener("click", () => {

    if(carrito.length === 0){
        alert("El carrito está vacío. Agrega productos para continuar.");
        return;
    }

    let total = carrito.reduce((sum, item) => sum + (Number(item.precio) * Number(item.cantidad)), 0);
    
    if(confirm(`Total a pagar: $${total.toFixed(2)}\n¿Confirmar compra?`)){
        alert("¡Compra realizada correctamente! Gracias por tu compra.");
        
        carrito = [];
        guardar();
        actualizarCarrito();
        modal.classList.add("oculto");
    }
});


// =======================
// MODAL
// =======================
carritoIcono.addEventListener("click", () => {
    actualizarCarrito(); // Asegurar que el modal muestra datos actualizados
    modal.classList.remove("oculto");
});

btnCerrar.addEventListener("click", () => {
    modal.classList.add("oculto");
});

// Cerrar modal si se hace clic fuera del contenido
modal.addEventListener("click", (e) => {
    if(e.target === modal){
        modal.classList.add("oculto");
    }
});


// =======================
// EVENTOS BUSQUEDA
// =======================
document.getElementById("btn-buscar").addEventListener("click", cargar);
categoria.addEventListener("change", cargar);
buscador.addEventListener("keypress", (e) => {
    if(e.key === "Enter"){
        cargar();
    }
});


// =======================
// INIT
// =======================
cargar();
actualizarCarrito();