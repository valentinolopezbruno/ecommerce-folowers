import { Component, OnInit } from '@angular/core';
import { APIService } from '../services/api.service';
import { Usuario } from '../models/usuario.model';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})


export class AdminLoginComponent implements OnInit{

  code = {};
  nombre = '';
  contra = '';

  constructor(private APIService: APIService){}

  validarCodigo():any{
    console.log( "code: ", this.code)

    if(this.code = {code: 1}){
      return Swal.fire({
        title: 'Ingresaste Correctamente',
        icon: 'success'
      });
    } 

    if(this.code = {code: 0}){
      return Swal.fire({
        title: 'Datos Incorrectos',
        icon: 'error'
      });
    } 
  }

  validarUsuario(nombre: string, contra: string){
     this.APIService.validarUsuario(nombre, contra).subscribe((valor) => {this.code = valor})
     this.validarCodigo()
  }

  iniciarSesion(){
    this.validarUsuario(this.nombre, this.contra) 
    console.log(this.nombre , this.contra )
  }

  ngOnInit(): void {
     
  }
}
