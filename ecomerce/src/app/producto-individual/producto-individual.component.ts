import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIService } from '../services/api.service';
import { CarritoItem } from '../models/carrito';
import { CarritoService } from '../services/carrito.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto-individual',
  templateUrl: './producto-individual.component.html',
  styleUrls: ['./producto-individual.component.css'],
})

export class ProductoIndividualComponent implements OnInit {
  idred = 0;
  idprod = 0;
  indexCalcularPrecio= 0;
  usuario:string = '';
  

  producto: CarritoItem = {
    id:1,
    redSocial: 'instagram',
    producto: 'Likes',
    productoimg: 'asd',
    precio: 111,
    cantidad: 1,
    divisa:"ARS",
    usuario:''
  };
  
  variablePrecio = "precio_ars"
  monedaAcual = "ARS"
/*       monedaAcual = "USD"  */
/*   monedaAcual = "EUR"  */

  // IMPORTO ANGULARROUTE Y ME SUSCRIBO ESPECIFICAMENTE AL ID QUE ESOTOY PASANDO EN LA URL.
  constructor(private ActivatedRoute: ActivatedRoute, private APIService:APIService,private CarritoService: CarritoService) {
    this.ActivatedRoute.params.subscribe((params) => {
      this.idred = params['idr'];
    });
    this.ActivatedRoute.params.subscribe((params) => {
      this.idprod = params['idp'];
    });
  }

  redes: any[] | null = null;

  crearProducto(
    redSocial: string,
    producto: string,
    productoimg: string,
    precio: number,
    cantidad: number): any {

      if(this.usuario === ''){
        return Swal.fire({
          icon: 'error',
          title: 'No Ingresaste Usuario',
        });
      }

    this.producto.id = this.generarIDRandom();
    this.producto.redSocial = redSocial;
    this.producto.producto = producto;
    this.producto.productoimg = productoimg;
    this.producto.precio = precio;
    this.producto.cantidad = cantidad;
    this.producto.divisa = this.monedaAcual;
    this.producto.usuario = this.usuario

    console.log("producto añadido")
    console.log(this.producto)

    this.CarritoService.agregarAlCarrito(this.producto);
    this.usuario = '';

  }

  generarIDRandom(): number {
    const min = 10; // Valor mínimo (inclusive)
    const max = 99; // Valor máximo (inclusive)
  
    const numeroRandom = Math.floor(Math.random() * (max - min + 1)) + min;
    return numeroRandom;
  }

  
  calcularPrecio(producto:any){
    if(this.monedaAcual == "ARS"){
      var precio = producto.productos_cantidad[this.indexCalcularPrecio].precio_ars
      return precio
    }

    if(this.monedaAcual == "USD"){
      var precio = producto.productos_cantidad[this.indexCalcularPrecio].precio_usd
      return precio
    }

    if(this.monedaAcual == "EUR"){
      var precio = producto.productos_cantidad[this.indexCalcularPrecio].precio_eur
      return precio
    }
  }
  
  calcularIndex(event: any): void {
    var index = event.target.value;
    this.indexCalcularPrecio = index;
  }

  getProductos(): void {
    this.APIService.getProductos().subscribe((data) => {
      (this.redes = data), console.log(this.redes);
    });
    console.log(this.redes)
  }

  ngOnInit(): void {
    this.getProductos()
  }
}
