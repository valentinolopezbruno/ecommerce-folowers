import { Component, OnInit } from '@angular/core';
import { CarritoItem, Carrito } from '../models/carrito';
import { CarritoService } from '../services/carrito.service';
import { APIService } from '../services/api.service';
import { MercadoPagoService } from '../services/mercadopago.service';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';

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

  public payPalConfig?: IPayPalConfig;

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

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'EUR',
      clientId:
        'AVi6dcUcYVO7O4a5qQQ9v9E438LF9IpF-hI4qKkifA-gLXQ1iZNIBeKGeM22pcSVKOUGSczImBysdHvX',
      createOrderOnClient: (data) =>
        <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'EUR',
                value: '9.99',
                breakdown: {
                  item_total: {
                    currency_code: 'EUR',
                    value: '9.99',
                  },
                },
              },
              items: [
                {
                  name: 'Enterprise Subscription',
                  quantity: '1',
                  category: 'DIGITAL_GOODS',
                  unit_amount: {
                    currency_code: 'EUR',
                    value: '9.99',
                  },
                },
              ],
            },
          ],
        },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: (data, actions) => {
        console.log(
          'onApprove - transaction was approved, but not authorized',
          data,
          actions
        );
        actions.order.get().then((details: any) => {
          console.log(
            'onApprove - you can get full order details inside onApprove: ',
            details
          );
        });
      },
      onClientAuthorization: (data) => {
        console.log(
          'onClientAuthorization - you should probably inform your server about completed transaction at this point',
          data
        );
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: (err) => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }

  async iniciarPago() {
    // Calcular el monto total de la compra sumando los precios de los productos en el carrito
    const montoTotal = this.carrito.productos.reduce(
      (total, producto) => total + producto.precio,
      0
    );

    // Crear la preferencia de pago
    const preferenceData = {
      items: this.carrito.productos.map((producto) => ({
        id: producto.id,
        title:
          producto.producto +
          ' ' +
          producto.redSocial +
          ' x ' +
          producto.cantidad,
        quantity: 1,
        currency_id: 'ARS', // Cambiar según la moneda que deseas utilizar
        unit_price: producto.precio,
      })),
      payer: {
        name: 'Nombre del cliente',
        email: 'correo@ejemplo.com',
      },
      back_urls: {
        success: 'http://localhost:3000/pago-exitoso', // URL a la que redirigir en caso de pago exitoso
        failure: 'http://localhost:3000/pago-fallido', // URL a la que redirigir en caso de pago fallido
        pending: 'http://localhost:3000/pago-pendiente', // URL a la que redirigir en caso de pago pendiente o en proceso
      },
      auto_return: 'approved', // Redirigir automáticamente al cliente a la URL de success
    };

    try {
      const preference = await this.MercadoPagoService.crearPreferenciaPago(
        preferenceData
      );

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
      this.carritoFinal.productos.push(this.datosEntrada[i]);
    }
    this.APIService.realizarPago(this.carrito).subscribe(
      (response) => {
        console.log('Respuesta del servidor:', response);
      },
      (error) => {
        console.error('Error en la petición:', error);
      }
    );
  }

  ngOnInit(): void {
    this.initConfig();
    this.CarritoService.carrito.subscribe((carrito: Carrito) => {
      this.carrito = carrito;
      this.datosEntrada = this.carrito.productos;
      console.log(this.datosEntrada);
    });
  }
}
