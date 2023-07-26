import { Component, OnInit } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { CarritoItem, Carrito } from '../models/carrito';
import { CarritoService } from '../services/carrito.service';
import { APIService } from '../services/api.service';
import { MercadoPagoService } from '../services/mercadopago.service';
/* import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal'; */

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

  monedaActual:boolean = true;
 
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

  pagarMP(): void {
    this.MercadoPagoService.pagar(this.carrito).subscribe(
      (initPoint) => {
        // Redireccionar al formulario de pago de MercadoPago
        window.location.href = initPoint;
      },
      (error) => {
        console.error(error);
        // Manejo de errores
      }
    );
  }

 pagarPaypal(): void {
  this.APIService.pagoPaypal().subscribe({
    next:(initPoint) => {
      window.location.href = initPoint.link;
    },
    error: (error) => {
      console.error(error);
      // Manejo de errores
    }
  }
  );
}

  mercadopagoprueba() {
    this.MercadoPagoService.pagar(this.carrito).subscribe((data) => {
      console.log(data);
    });
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

  obtenerDatosLocalStorage(key: string): any {
    const data = localStorage.getItem(key);
    console.log('data');
    console.log(data);
    return data ? JSON.parse(data) : null;
  }

  obtenerMoneda(carrito:Carrito):void{
    // VERIFICO QUE EL CARRITO NO ESTE VACIO
    if(carrito.productos.length >= 1){
    // LE DIGO QUE SETEE LA MONEDA DEL PRIMER PRODUCTO COMO MONEDA ACTUAL PARA DESPUES PROCESAR EL PAGO CON PAYPAL O MP
      if(carrito.productos[0].divisa === "ARS")
      this.monedaActual = false
    }
    console.log(this.monedaActual)
  }
  

  ngOnInit(): void {
    /* this.initConfig(); */

    this.CarritoService.carrito.subscribe((carrito: Carrito) => {
      this.carrito = carrito;
      this.datosEntrada = this.carrito.productos;
      this.obtenerMoneda(this.carrito);
      
      console.log('carrito');
      console.log(this.carrito);

      /*console.log('datosEntrada');
      console.log(this.datosEntrada); */
    });

    /*  this.datosEntrada = this.obtenerDatosLocalStorage("carrito")
      this.carrito = this.obtenerDatosLocalStorage("carrito")
    console.log(this.datosEntrada);  */

  
  }
}
