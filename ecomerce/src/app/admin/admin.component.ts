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

  productos = Array<Social> 

  constructor(private APIService : APIService){}

  public verModal = false;


  editarProducto(){

  }

  eliminarProducto(){

  }

  habilitarModal(){
    this.verModal = true;
  }

  cerrarModal():void{
    this.verModal = false;
  }

  getProductos():void{
    this.APIService.getProductos.subscribe((_valor: Array<Social> ) => {this.productos = _valor})
  }

  ngOnInit(): void {
    
  }
}
