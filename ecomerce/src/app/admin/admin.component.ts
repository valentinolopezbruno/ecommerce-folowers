import { Component, OnInit } from '@angular/core';
import { ModalServicesService } from '../services/modal-services.service';
import { APIService } from '../services/api.service';
import { NuevoProducto } from '../models/nuevoProducto';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';




@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit{

  redes: any[] | null = null;
  valorIDRed: number = 0;
  valorIDRedRestado:number = 0;
  valorIDProducto: number = 0 ;
  valorIDProductoRestado: number | undefined = 0 ;

  constructor(private APIService : APIService, private http: HttpClient){}

  verModal = false;
  verModalAdmin = false;
  agregarPrecios = false;

  nombreProducto: string ='';
  urlImagen: string = "";
  cantidad: string = '';
  precio: string = '';

  nuevoProducto: NuevoProducto = {
    nombre: this.nombreProducto,
    imagen: this.urlImagen,
    idSocial: this.valorIDRed,
    productos_cantidad:[]
  }



  editarProducto(){

  }

  habilitarModal(id:number, nombre:string){
    this.verModal = true;
    this.valorIDProducto = id;
    this.valorIDProductoRestado = this.valorIDProducto - 1;
    this.nombreProducto = nombre;
  }

  cerrarModal():void{
    this.verModal = false;
  }

  
  habilitarModalAdmin(){
    this.verModalAdmin = true;
  }

  cerrarModalAdmin():void{
    this.verModalAdmin = false;
  }

  habilitarAgregarPrecios(){
    this.agregarPrecios = true;
    this.precio = '';
    this.nuevoProducto.productos_cantidad.push({
      cantidad: 1,
      precio: 1
    })
    console.log(this.nuevoProducto)
  }

  guardarPrecio(i:number, event:any):void{
    this.precio = event.target.value;
    this.nuevoProducto.productos_cantidad[i].precio = parseInt(this.precio);
  }

  guardarCantidad(i:number, event:any):void{
    this.cantidad = event.target.value;
    this.nuevoProducto.productos_cantidad[i].cantidad = parseInt(this.cantidad);
  }

  getProductos():void{
    this.APIService.getProductos().subscribe(data => {this.redes = data , console.log(this.redes)});
  }

  agregarProductos():void{
    this.APIService.agregarProductos(this.nuevoProducto).subscribe(data => {console.log(data)});
  }

  eliminarProducto(id:number):void{
    this.APIService.eliminarProducto(id).subscribe(data => {console.log(data)});
  }

 
  cambiarValorIDRed(event: Event) {
    const valorSeleccionado = (event.target as HTMLSelectElement).value;
    this.valorIDRed =  parseInt(valorSeleccionado);
    this.valorIDRedRestado = this.valorIDRed - 1;
  }

  compararClavesPrimarias(clave1:number, clave2:number): boolean {
    return clave1 === clave2;
  }

  cargarImagen(event: any) {
    const archivo = event.target.files[0];
    const nombreImagen = archivo.name;
    this.nuevoProducto.imagen = nombreImagen; // Puedes usar el nombre de la imagen si lo necesitas
    console.log(nombreImagen);
    
    const lector = new FileReader();
    lector.onload = (e: any) => {
      this.urlImagen = e.target.result;
    };
    lector.readAsDataURL(archivo);
  }

  guardarImagen() {
    this.http.get(this.nuevoProducto.imagen, { responseType: 'blob' }).subscribe((blob: Blob) => {
      saveAs(blob, this.nuevoProducto.imagen); // Reemplaza 'nombre_imagen.png' con el nombre deseado para la imagen
    });
  }


  confirmarProducto(){
    this.nuevoProducto.nombre = this.nombreProducto;
    this.nuevoProducto.idSocial = this.valorIDRed;
    console.log(this.nuevoProducto);
    this.agregarProductos();
    this.guardarImagen();
  }
  

  ngOnInit(): void {
    this.getProductos();
  }
}
