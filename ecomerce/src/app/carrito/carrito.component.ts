import { Component, OnInit } from '@angular/core';
import { CarritoItem, Carrito } from '../models/carrito';
import { CarritoService } from '../services/carrito.service';
import { APIService } from '../services/api.service';
import { MercadoPagoService } from '../services/mercadopago.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
})
export class CarritoComponent implements OnInit {
  constructor(
    private CarritoService: CarritoService,
    private APIService: APIService,
    private MercadoPagoService: MercadoPagoService
  ) {}


  carrito: Carrito = { productos: [] };

  carritoFinal: Carrito = { productos: [] };

  datosEntrada: Array<CarritoItem> = [];

  displayColumnas: Array<string> = [
    'redsocialimg',
    'producto',
    'precio',
    'cantidad',
    'total',
    'accion',
  ];

  async iniciarPago() {
    // Calcular el monto total de la compra sumando los precios de los productos en el carrito
    const montoTotal = this.carrito.productos.reduce((total, producto) => total + producto.precio, 0);

    // Crear la preferencia de pago
    const preferenceData = {
      items: this.carrito.productos.map(producto => ({
        id: producto.id,
        title: producto.producto + " " + producto.redSocial + " x " + producto.cantidad,
        quantity: 1,
        currency_id: 'ARS', // Cambiar según la moneda que deseas utilizar
        unit_price: producto.precio
      })),
      payer: {
        name: 'Nombre del cliente',
        email: 'correo@ejemplo.com'
      },
      back_urls: {
        success: 'http://localhost:3000/pago-exitoso', // URL a la que redirigir en caso de pago exitoso
        failure: 'http://localhost:3000/pago-fallido', // URL a la que redirigir en caso de pago fallido
        pending: 'http://localhost:3000/pago-pendiente' // URL a la que redirigir en caso de pago pendiente o en proceso
      },
      auto_return: 'approved', // Redirigir automáticamente al cliente a la URL de success
    };

    try {
      const preference = await this.MercadoPagoService.crearPreferenciaPago(preferenceData);

      // Redireccionar al formulario de pago de MercadoPago
      window.location.href = preference.init_point;
    } catch (error) {
      console.error('Error al crear la preferencia de pago:', error);
    }
  }

  getTotal(productos: Array<CarritoItem>): number {
    return this.CarritoService.getTotal(productos);
  }

  limpiarCarrito(): void {
    this.CarritoService.limpiarCarrito();
  }

  eliminarProducto(elemento: CarritoItem): void {
    this.CarritoService.eliminarDelCarrito(elemento);
  }

 

  realizarPago(): void {
    for (let i = 0; i < this.datosEntrada.length; i++) {
      this.carritoFinal.productos.push(this.datosEntrada[i])
    }
    this.APIService.realizarPago(this.carrito).subscribe(
      (response) => {
        console.log("Respuesta del servidor:", response);
      },
      (error) => {
        console.error("Error en la petición:", error);
      }
    );
  }

  ngOnInit(): void {
    this.CarritoService.carrito.subscribe((carrito: Carrito) => {
      this.carrito = carrito;
      this.datosEntrada = this.carrito.productos;
      console.log(this.datosEntrada)
    });
  }
}
