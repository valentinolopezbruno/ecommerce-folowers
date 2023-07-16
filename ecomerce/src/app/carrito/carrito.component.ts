import { Component, OnInit } from '@angular/core';
import { CarritoItem, Carrito } from '../models/carrito';
import { CarritoService } from '../services/carrito.service';
import { APIService } from '../services/api.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
})
export class CarritoComponent implements OnInit {
  constructor(
    private CarritoService: CarritoService,
    private APIService: APIService
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
