import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { Carrito, CarritoItem } from '../models/carrito';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  /* BehaviorSubject LO UTILIZO PARA QUE CUANDO HAYA UN CAMBIO EN EL OBJETO CARRITO SE ACTUALICE EN TODOS MIS COMPONENTES */
  carrito = new BehaviorSubject<Carrito>({productos:[]})

  constructor(private _snackBar: MatSnackBar) {}

  agregarAlCarrito(producto: CarritoItem): void {
    const productos = [...this.carrito.value.productos];
    const nuevoProducto = { ...producto }; // Crear un nuevo objeto producto
  
    productos.push(nuevoProducto);
    this.carrito.next({ productos });
  
    this._snackBar.open('producto añadido al carrito.', 'Ok', { duration: 3000 });

  }
  

  getTotal(productos: Array<CarritoItem>): number {
    var precio = 0;
    productos.map((producto) => precio += producto.precio);
    return precio;
  }

  eliminarDelCarrito(producto: CarritoItem, update = true): Array<CarritoItem>{
    const productosFiltrados = this.carrito.value.productos.filter(
      (_producto) => _producto.id !==producto.id
    );

    if(update){
      
    this.carrito.next({productos:productosFiltrados})

    this._snackBar.open('1 Producto Eliminado', 'Ok',{duration:3000})
    }

    return productosFiltrados;
    
  }

  

  limpiarCarrito():void{
    this.carrito.next({productos : []})
    this._snackBar.open('Carrito Limpiado', 'ok', {duration: 3000})
  }

 /*  decrementarCarrito(producto: CarritoItem){
    let productoEliminado: CarritoItem | undefined;

    let productoFiltrado = this.carrito.value.productos.map((_producto) => {
      if(_producto.id === producto.id){
        _producto.cantidad--;
      }
      if(_producto.cantidad === 0){
        productoEliminado =_producto
      }
      return _producto;
    })

    if(productoEliminado){
      productoFiltrado = this.eliminarDelCarrito(productoEliminado, false);
    }

    this.carrito.next({productos: productoFiltrado})

    this._snackBar.open('Producto Decrementado', 'Ok', {duration:3000})
  } */
}
