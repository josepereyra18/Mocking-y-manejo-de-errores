const socket = io();

const agregarAlCarritoBtn = document.getElementsByClassName('btn btn-primary AgregarAlCarrito');
let carritoId




  for (let btn of agregarAlCarritoBtn) {
    btn.addEventListener('click', async (e) => {
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
        icon: 'info',
        title: `bienvenid@! Inicio de sesion exitosa`,
        showConfirmButton: false,
        timer: 3000
    });
    carritoId = data;
})