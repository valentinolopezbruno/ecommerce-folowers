import { Component, Input, OnInit } from '@angular/core';
import { APIService } from '../services/api.service';
import { CarritoService } from '../services/carrito.service';
import { Carrito, CarritoItem } from '../models/carrito';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit{
  constructor( private APIService: APIService, private CarritoService: CarritoService){}
  
  private _carrito:Carrito = {productos:[]};
  
  redes: any[] | null = null;
  indexCalcularPrecio = 0;
  usuario: string = '';
  cantidadProductosCarrito = 0;
  datosEntrada: Array<CarritoItem> = [];


  get carrito():Carrito{
    return this._carrito
  }

  getTotal(productos: Array<CarritoItem>):number{
    return this.CarritoService.getTotal(productos);
  }

  set carrito(carrito: Carrito){
    this._carrito = carrito;

    this.cantidadProductosCarrito = carrito.productos.length
  }

  getProductos():void{
      this.APIService.getProductos().subscribe(data => {this.redes = data , console.log(this.redes)});
  }

  limpiarCarrito(): void{
    this.CarritoService.limpiarCarrito();
  }

  ngOnInit(){
      this.getProductos();
      console.log(this.redes)
      this.CarritoService.carrito.subscribe((_carrito:Carrito) => {
        this.carrito = _carrito;
        this.datosEntrada = this.carrito.productos;
      })
      console.log("this.datosEntrada")
      console.log(this.datosEntrada)
  }
}
