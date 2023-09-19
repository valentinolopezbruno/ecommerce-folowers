import { Component, OnInit } from '@angular/core';
import { APIService } from '../services/api.service';
import { Usuario } from '../models/usuario.model';
import Swal from 'sweetalert2';
import { APP_URL } from '../app.config';



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

   guardarEnLocalStorage(token:string) {
    try {
      localStorage.setItem("token", JSON.stringify(token));
    } catch (error) {
      console.error('Error al guardar en el localStorage:', error);
    }
  }

  validarCodigo(data:any):any{
    if(data.code === 1){
      var {token, code} = data;
      this.guardarEnLocalStorage(token);
       Swal.fire({
        title: 'Ingresaste Correctamente',
        icon: 'success'
      });

      window.location.href = `https://misseguidores.com/admin`
    } else{
      return Swal.fire({
        title: 'Datos Incorrectos',
        icon: 'error'
      });
    }

  }

  validarUsuario(nombre: string, contra: string){
     this.APIService.validarUsuario(nombre, contra).subscribe((data) => {
     this.validarCodigo(data)})
  }

  iniciarSesion(){
    this.validarUsuario(this.nombre, this.contra) 
    console.log(this.nombre , this.contra )
  }

  ngOnInit(): void {
     
  }
}
