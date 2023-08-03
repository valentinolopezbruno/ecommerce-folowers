import { Component, Input, OnInit } from '@angular/core';
import { APIService } from '../services/api.service';
import { CarritoService } from '../services/carrito.service';
import { Carrito, CarritoItem } from '../models/carrito';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(
    private apiService: APIService,
    private carritoService: CarritoService,private router: Router
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

  redirigirPaginaProducto(idRed: number):void{
    console.log(idRed)
    const nuevoID = idRed - 1
    this.router.navigate(['/service/',nuevoID,0]);
  }

  ngOnInit() {
    this.getProductos();
    this.carritoService.carrito.subscribe((_carrito: Carrito) => {
      this.carrito = _carrito;
      this.datosEntrada = this.carrito.productos;
    });
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