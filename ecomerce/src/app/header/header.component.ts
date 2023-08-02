import { Component, Input, OnInit } from '@angular/core';
import { APIService } from '../services/api.service';
import { CarritoService } from '../services/carrito.service';
import { Carrito, CarritoItem } from '../models/carrito';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(
    private apiService: APIService,
    private carritoService: CarritoService
  ) {}

  private _carrito: Carrito = { productos: [] };

  redes: any[] | null = null;
  indexCalcularPrecio = 0;
  usuario: string = '';
  cantidadProductosCarrito = 0;
  datosEntrada: Array<CarritoItem> = [];




  get carrito(): Carrito {
    return this._carrito;
  }

  getTotal(productos: Array<CarritoItem>): number {
    return this.carritoService.getTotal(productos);
  }

  set carrito(carrito: Carrito) {
    this._carrito = carrito;

    this.cantidadProductosCarrito = carrito.productos.length;
  }

  getProductos(): void {
    this.apiService.getProductos().subscribe((data) => {
      this.redes = data;
      console.log(this.redes);
    });
  }

  limpiarCarrito(): void {
    this.carritoService.limpiarCarrito();
  }

  ngOnInit() {
    this.getProductos();
    console.log(this.redes);
    this.carritoService.carrito.subscribe((_carrito: Carrito) => {
      this.carrito = _carrito;
      this.datosEntrada = this.carrito.productos;
    });
    console.log('this.datosEntrada');
    console.log(this.datosEntrada);
  }

  mobileMenuOpen = false;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }


  activeDropdown: number = -1;

toggleSubmenu(index: number) {
  if (this.activeDropdown === index) {
    this.activeDropdown = -1; // Si ya está abierto, lo cerramos
  } else {
    this.activeDropdown = index; // Si no está abierto, lo abrimos
  }
}

  
}