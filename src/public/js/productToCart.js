const socket = io();

const agregarAlCarritoBtn = document.getElementsByClassName('btn btn-primary AgregarAlCarrito');
const crearCarritoBtn = document.getElementsByClassName('btn btn-primary crearCarrito');
let carritoId

for (let btn of crearCarritoBtn) {
    btn.addEventListener('click', async (e) => {
        socket.emit('crearCarrito');
    });
  }


  for (let btn of agregarAlCarritoBtn) {
    btn.addEventListener('click', async (e) => {
      console.log(carritoId)
      if (!carritoId) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: `Primero debes crear un carrito`,
          showConfirmButton: false,
          timer: 3000
        });
      } else {
        productId = e.target.getAttribute('data-product-id');
        socket.emit('agregarProducto', productId, carritoId);
      }
    });
  }

socket.on('productoAgregado', (data) => {
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Producto ${data.title} agregado al carrito :D`,
        showConfirmButton: false,
        timer: 3000
    });
})

socket.on('cartId', (data) => {
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `carrito creado exitosamente :D`,
        showConfirmButton: false,
        timer: 3000
    });
    carritoId = data;
})