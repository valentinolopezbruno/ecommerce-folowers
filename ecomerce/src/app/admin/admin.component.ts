import { Component, OnInit } from '@angular/core';
import { ModalServicesService } from '../services/modal-services.service';
import { APIService } from '../services/api.service';
import { Social } from '../models/producto.model';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit{

  redes: any[] | null = null;
  valorIDRed: number = 0;
  valorIDRedRestado:number = 0;

  nombreProducto: string ='Likes';
  valorIDProducto: number = 0 ;
  valorIDProductoRestado: number = 0 ;

  constructor(private APIService : APIService){}

  public verModal = false;


  editarProducto(){

  }

  eliminarProducto(){

  }

  habilitarModal(id:number, nombre:string){
    this.verModal = true;
    this.valorIDProducto = id;
    this.valorIDProductoRestado = this.valorIDProducto - 1;
    this.nombreProducto = nombre;
    console.log("valorIDProductoRestado"+this.valorIDProductoRestado)
  }

  cerrarModal():void{
    this.verModal = false;
  }

  getProductos():void{
    this.APIService.getProductos().subscribe(data => {this.redes = data , console.log(this.redes)});
  }

 
  cambiarValorIDRed(event: Event) {
    const valorSeleccionado = (event.target as HTMLSelectElement).value;
    this.valorIDRed =  parseInt(valorSeleccionado);
    this.valorIDRedRestado = this.valorIDRed - 1;
    console.log("valorIDRedRestado: "+this.valorIDRedRestado)
  }

  compararClavesPrimarias(clave1:number, clave2:number): boolean {
    return clave1 === clave2;
  }

  ngOnInit(): void {
    this.getProductos();
  }
}
