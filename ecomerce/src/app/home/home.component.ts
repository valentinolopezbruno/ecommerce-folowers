import { Component, OnInit } from '@angular/core';
import { APIService } from '../services/api.service';
import { Carrito, CarritoItem } from '../models/carrito';
import { CarritoService } from '../services/carrito.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

export class HomeComponent implements OnInit {
  constructor(private APIService: APIService, private CarritoService: CarritoService) {}

  redes: any[] | null = null;
  indexCalcularPrecio = 0;
  usuario: string = '';

  producto: CarritoItem = {
    id:1,
    redSocial: 'instagram',
    producto: 'Likes',
    productoimg: 'asd',
    precio: 111,
    cantidad: 1,
  };

  crearProducto(
    redSocial: string,
    producto: string,
    productoimg: string,
    precio: number,
    cantidad: number): void {

    this.producto.id = this.generarIDRandom();
    this.producto.redSocial = redSocial;
    this.producto.producto = producto;
    this.producto.productoimg = productoimg;
    this.producto.precio = precio;
    this.producto.cantidad = cantidad;
    console.log(this.producto)

    this.CarritoService.agregarAlCarrito(this.producto);
  }

  generarIDRandom(): number {
    const min = 10; // Valor mínimo (inclusive)
    const max = 99; // Valor máximo (inclusive)
  
    const numeroRandom = Math.floor(Math.random() * (max - min + 1)) + min;
    return numeroRandom;
  }

  getProductos(): void {
    this.APIService.getProductos().subscribe((data) => {
      (this.redes = data), console.log(this.redes);
    });
  }

  calcularPrecio(event: any): void {
    var index = event.target.value;
    this.indexCalcularPrecio = index;
  }

 /*  agregarCarrito(): void {
    console.log(this.usuario);
  } */

  ngOnInit() {
    this.getProductos();
    console.log(this.redes);
  }
}
