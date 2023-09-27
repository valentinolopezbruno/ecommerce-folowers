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


  monedaActual: boolean = false;

  carrito: Carrito = { productos: [] };

  carritoFinal: Carrito = { productos: [] };

  datosEntrada: Array<CarritoItem> = [];

  displayColumnas: Array<string> = [
    'redsocialimg',
    'producto',
    'cantidad',
    'precio',
 /*    'total', */
    'accion',
  ];



  removeCartItem(button: HTMLElement): void {
    const cartItem = button.parentElement?.parentElement;
    if (cartItem) {
      cartItem.remove();
      this.updateTotal();
    }
  }

  updateTotal(): void {
    const cartItems = document.querySelectorAll(".mat-row");
    let total = 0;
  
    cartItems.forEach(cartItem => {
      const priceElement = cartItem.querySelector(".mat-cell:nth-child(3)");
      if (priceElement) {
        const quantityElement = cartItem.querySelector(".mat-cell:nth-child(4)");
        const price = parseFloat(priceElement.textContent!.replace("$", ""));
        const quantity = parseInt(quantityElement?.textContent!, 10) || 0;
        total += price * quantity;
      }
    });
  
    const totalAmountElement = document.querySelector(".order-total-amount");
    if (totalAmountElement) {
      totalAmountElement.textContent = "$" + total.toFixed(2);
    }
  }

  pagarMP(): void {
    this.MercadoPagoService.pagar(this.carrito).subscribe(
      (initPoint) => {
        window.location.href = initPoint;
      },
      (error) => {
        console.error(error);
      
      }
    );
  }

  pagarPaypal(): void {
    this.APIService.pagoPaypal(this.carrito).subscribe({
      next: (initPoint) => {
        window.location.href = initPoint.link;
      },
      error: (error) => {
        console.error(error);
        // Manejo de errores
      }
    });
  }

  mercadopagoprueba() {
    this.MercadoPagoService.pagar(this.carrito).subscribe((data) => {
      
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
    this.updateTotal();
  }

  obtenerDatosLocalStorage(key: string): any {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  obtenerMoneda(/* carrito: Carrito */): void {
   /*  if (carrito.productos.length >= 1) {
      if (carrito.productos[0].divisa === "ARS") {
        this.monedaActual = false;
      }
    } */
    this.APIService.getGeoLocation().subscribe(
      (data: any) => {
        const country = data.country;
        if (country === 'AR') {
          this.monedaActual = false;
          // El usuario está en Argentina, configura la moneda a pesos.
          // Puedes usar una variable global o algún servicio para almacenar la selección de moneda.
        } else {
          this.monedaActual = true;
          // El usuario no está en Argentina, configura la moneda a dólares.
          // Puedes usar una variable global o algún servicio para almacenar la selección de moneda.
        }
      },
      error => {
        console.error('Error al obtener la ubicación del usuario', error);
      }
    );
  }

  ngOnInit(): void {
    this.CarritoService.carrito.subscribe((carrito: Carrito) => {
      this.carrito = carrito;
      this.datosEntrada = this.carrito.productos;
      this.obtenerMoneda(/* this.carrito */);
      console.log(this.carrito)
    });
  }
}
