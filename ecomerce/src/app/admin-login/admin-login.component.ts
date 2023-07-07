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

  validarCodigo(){
    console.log( "code: ", this.code)
    if(this.code == 1){
      Swal.fire({
        title: 'Good job!',
        text: 'You clicked the button!',
        icon: 'success'
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
     this.validarUsuario(this.nombre, this.contra) 
  }
}
