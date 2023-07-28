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

  guardarDatosLocalStorage(carrito:{}): void {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }


  agregarAlCarrito(producto: CarritoItem): void {
    const productos = [...this.carrito.value.productos];
    const nuevoProducto = { ...producto }; // Crear un nuevo objeto producto
  
    productos.push(nuevoProducto);
    this.carrito.next({ productos });
    this.guardarDatosLocalStorage(this.carrito.value.productos)
  
    this._snackBar.open('Producto Añadido', 'Ok', { duration: 3000 });

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
    this.guardarDatosLocalStorage(this.carrito.value.productos)
    this._snackBar.open('Producto Eliminado', 'Ok',{duration:3000})
    }

    return productosFiltrados;
    
  }

  limpiarCarrito():void{
    this.carrito.next({productos : []});
    this.guardarDatosLocalStorage(this.carrito.value.productos);
    this._snackBar.open('Carrito Limpiado', 'ok', {duration: 3000})
 
  }
}
