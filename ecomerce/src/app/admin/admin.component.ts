import { Component, OnInit } from '@angular/core';
import { ModalServicesService } from '../services/modal-services.service';
import { APIService } from '../services/api.service';
import { NuevoProducto } from '../models/nuevoProducto';
import Swal from 'sweetalert2';
import { Social } from '../models/social.model';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  constructor(private APIService: APIService) {}


  redes: any[] | null = null;
  valorIDRed: number = 0;
  valorIDRedRestado: number = 0;
  valorIDProducto: number = 0;
  valorIDProductoRestado: number | undefined = 0;

  verModal = false;
  verModalAdmin = false;
  verModalAdminRedSocial = false;
  agregarPrecios = false;

  nuevaRedSocial: string = '';
  nuevaRedSocialIMG: File | null = null;

  nombreInput: string = '';
  cantidadInput: number = 0;
  precioInput: number = 0;
  datos = {
    cantidad: this.cantidadInput,
    precio: this.precioInput,
  }; 

  cantidadNuevoProductoCantidad = "";
  precioNuevoProductoCantidad = "";

  nombreProducto: string = '';
  urlImagen: string = '';
  imgFile: File | null = null;
  cantidad: string = '';
  precio: string = '';

  nuevoProducto: NuevoProducto = {
    nombre: this.nombreProducto,
    imagen: this.imgFile,
    idSocial: this.valorIDRed,
    productos_cantidad: [],
  };

  habilitarModalAdminRedSocial():void{
    this.verModalAdminRedSocial = true;
  }

  cerrarModalAdminRedSocial():void{
    this.verModalAdminRedSocial = false;
  }

  confirmarRedSocial():void{
    if(this.nuevaRedSocial == ''){
      Swal.fire({
        icon: 'error',
        title: 'No Ingresaste "Nombre"'
      })
    }
    if(this.nuevaRedSocialIMG == null){
      Swal.fire({
        icon: 'error',
        title: 'No seleccionaste "Imagen"'
      })
    }
    if(this.nuevaRedSocialIMG !=null && this.nuevaRedSocial != ''){
      this.agregarRedSocial()
    }
    
  }

  agregarRedSocial():void{
    if(this.nuevaRedSocialIMG !=null && this.nuevaRedSocial != '')
    this.APIService.agregarRedSocial(this.nuevaRedSocial, this.nuevaRedSocialIMG).subscribe((data) => {
      
    });

    Swal.fire({
      icon: 'success',
      title: 'Red Agregada Correctamente'
    });
    this.recargarPagina();
  }

  habilitarModal(id: number, nombre: string) {
    this.verModal = true;
    this.valorIDProducto = id;
    this.valorIDProductoRestado = this.valorIDProducto - 1;
    this.nombreProducto = nombre;
  }

  cerrarModal(): void {
    this.verModal = false;
  }

  agregarProductoCantidad():void{
    Swal.fire({
      title: 'Desea agregar Cantidad: ' + this.cantidadNuevoProductoCantidad + 'y Precio: $'+ this.precioNuevoProductoCantidad,
       showCancelButton: true,
      confirmButtonText: 'Confirmar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.APIService.agregarProductoCantidad(this.valorIDProducto,parseInt(this.cantidadNuevoProductoCantidad),parseFloat(this.precioNuevoProductoCantidad)).subscribe(data => {console.log(data)});
        Swal.fire('Cantidad Agregada!', '', 'success')
        this.recargarPagina();
      }
    })
  }


  editarProductoCantidad(id: number, cantidad: string, precio:string): void {

    // SI NO SE MODIFICO LA CANTIDAD LE PREGUNTO SI QUIERE QUE SIGA SIENDO LA MISMA ONO
    if(this.cantidadInput == 0){
      Swal.fire({
        title: 'No se modifico la cantidad, desea que siga siendo: ' + cantidad,
         showCancelButton: true,
        confirmButtonText: 'Confirmar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.datos.cantidad = parseInt(cantidad);
          this.datos.precio = this.precioInput
          this.confirmarEdicion(id,this.datos)
          Swal.fire('Producto Modificado!', '', 'success')
          this.recargarPagina();
        }
      })
    } 

    // SI NO SE MODIFICO EL PRECIO LE PREGUNTO SI QUIERE QUE SIGA SIENDO EL MISMO ONO
    if(this.precioInput == 0){
      Swal.fire({
        title: 'No se modifico el precio, desea que siga siendo: $' + precio,
         showCancelButton: true,
        confirmButtonText: 'Confirmar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.datos.precio = parseFloat(precio);
          this.datos.cantidad = this.cantidadInput
          console.log(precio)
          this.confirmarEdicion(id,this.datos)
          Swal.fire('Producto Modificado!', '', 'success')
          this.recargarPagina();
        }
      })
    }

    // SI NO SE MODIFICO LA CANTIDAD Y EL PRECIO GUARDO TODO
    if(this.precioInput != 0 && this.cantidadInput != 0){
      Swal.fire({
        title: 'Deseas editar los cambios?',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.datos.cantidad = this.cantidadInput
          this.datos.precio = this.precioInput
          this.confirmarEdicion(id,this.datos)
          Swal.fire('Producto Modificado!', '', 'success')
          this.recargarPagina();
        }
      })
    } 
    
  }

  confirmarEdicion(id:number, datos:{}):void{
    this.APIService.editarProductosCantidad(id, datos).subscribe(data => {console.log(data)});
  }

  eliminarProductoCantidad(id: number, cantidad: string, precio: string):void{

    Swal.fire({
      title: 'Desea eliminar esta Cantidad: '+ cantidad + " y Precio: $" + precio + " ?",
       showCancelButton: true,
      confirmButtonText: 'Confirmar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.APIService.eliminarProductoCantidad(id).subscribe(data => {console.log(data)});
        Swal.fire('Eliminado Correctamente!', '', 'success')
        this.recargarPagina();
      }
    })
  }

  cambioNombre(event: Event): void {
    this.nombreInput = (event.target as HTMLInputElement).value;
  }

  cambioCantidad(event: Event): void {
    this.cantidadInput = parseFloat((event.target as HTMLInputElement).value);
  }

  cambioPrecio(event: Event): void {
    this.precioInput = parseFloat((event.target as HTMLInputElement).value);
  }

  habilitarModalAdmin() {
    this.verModalAdmin = true;
  }

  cerrarModalAdmin(): void {
    this.verModalAdmin = false;
  }

  habilitarAgregarPrecios() {
    this.agregarPrecios = true;
    this.precio = '';
    this.nuevoProducto.productos_cantidad.push({
      cantidad: 1,
      precio: 1,
    });
    console.log(this.nuevoProducto);
  }

  guardarPrecio(i: number, event: any): void {
    this.precio = event.target.value;
    this.nuevoProducto.productos_cantidad[i].precio = parseInt(this.precio);
  }

  guardarCantidad(i: number, event: any): void {
    this.cantidad = event.target.value;
    this.nuevoProducto.productos_cantidad[i].cantidad = parseInt(this.cantidad);
  }

  getProductos(): void {
    this.APIService.getProductos().subscribe((data) => {
      (this.redes = data), console.log(this.redes);
    });
  }

  agregarProductos(): void {
    if (this.nuevoProducto.imagen != null) {
      this.APIService.agregarProductos(
        this.nuevoProducto,
        this.nuevoProducto.imagen
      ).subscribe((data) => {
        console.log(data);
      });
    }
  }

  eliminarProducto(id: number): void {
    Swal.fire({
      title: 'Deseas eliminar el producto?',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.APIService.eliminarProducto(id).subscribe((data) => {
          console.log(data);
        });
        Swal.fire('Producto Eliminado!', '', 'success')
        this.recargarPagina();
      }
    })
  }

  recargarPagina() {
    setTimeout(() => {
      location.reload();
    }, 1000); // 1000 milisegundos (1 segundo)
  }

  cambiarValorIDRed(event: Event) {
    const valorSeleccionado = (event.target as HTMLSelectElement).value;
    this.valorIDRed = parseInt(valorSeleccionado);
    this.valorIDRedRestado = this.valorIDRed - 1;
  }

  compararClavesPrimarias(clave1: number, clave2: number): boolean {
    return clave1 === clave2;
  }

  cargarImagen(event: any) {
    const archivo = event.target.files[0];
    this.nuevoProducto.imagen = archivo;
    const lector = new FileReader();
    lector.onload = (e: any) => {
      this.urlImagen = e.target.result;
    };
    lector.readAsDataURL(archivo);
  }

  cargarImagenSocial(event: any) {
    const archivo = event.target.files[0];
    this.nuevaRedSocialIMG = archivo;
    const lector = new FileReader();
    lector.onload = (e: any) => {
      this.urlImagen = e.target.result;
    };
    lector.readAsDataURL(archivo);
  }

  confirmarProducto() {
    this.nuevoProducto.nombre = this.nombreProducto;
    this.nuevoProducto.idSocial = this.valorIDRed;
    //SI NO SELECCIONA RED SOCIAL
    if(this.valorIDRed == 0){
      Swal.fire({
        icon: 'error',
        title: 'No seleccionaste "Red Social"'
      })
    }
    //SI NO PONE NOMBRE DEL PRODUCTO
    if(this.nombreProducto == ''){
      Swal.fire({
        icon: 'error',
        title: 'No agregaste "Nombre del Producto"'
      })
    }
    // SI NO AGREGA PRECIOS Y CANTIDADES
    if(this.nuevoProducto.productos_cantidad.length == 0){
      Swal.fire({
        icon: 'error',
        title: 'No agregaste Cantidades y Precios'
      })
    }
    // SI PRESIONA"AGREGAR PRECIOS Y CANTIDADES" PERO NO PONE VALORES
    if(this.nuevoProducto.productos_cantidad[0].cantidad == 1){
      Swal.fire({
        icon: 'error',
        title: 'No agregaste Cantidades y Precios'
      })
    }
    // CAMINO CORRECTO
    this.agregarProductos();
    Swal.fire({
      icon: 'success',
      title: 'Producto Agregado Correctamente'
    });
    this.recargarPagina();
  }

  ngOnInit(): void {
    this.getProductos();
  }
}


