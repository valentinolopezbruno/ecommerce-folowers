import { Component, OnInit } from '@angular/core';
import { APIService } from '../services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-credenciales',
  templateUrl: './credenciales.component.html',
  styleUrls: ['./credenciales.component.css']
})



export class CredencialesComponent implements OnInit{
  constructor(
    private apiService: APIService
  ) {}

  credenciales:any = [];
  
   cliente_id_paypal: string = '';
   cliente_id_mercadopago: string =  '';

   cliente_secret_paypal: string = '';
   cliente_secret_mercadopago: string = '';
  

  getProductos(): void {
    this.apiService.getCredenciales().subscribe((data) => {
      this.credenciales = data;
      console.log(this.credenciales);
    });
  }

  cargarCredenciales(){
    this.cliente_id_paypal = this.credenciales[1].cliente_id
    this.cliente_id_mercadopago =  this.credenciales[0].cliente_id;
    this.cliente_secret_paypal = this.credenciales[1].cliente_secret;
    this.cliente_secret_mercadopago = this.credenciales[0].cliente_secret;
  }

  actualizarClienteIdPaypal(nuevoValor: string) {
    this.cliente_id_paypal = nuevoValor;
  }
  actualizarClienteSecretPaypal(nuevoValor: string) {
    this.cliente_secret_paypal = nuevoValor;
  }
  actualizarClienteIdMP(nuevoValor: string) {
    this.cliente_id_mercadopago = nuevoValor;
  }
  actualizarClienteSecretMP(nuevoValor: string) {
    this.cliente_secret_mercadopago = nuevoValor;
  }

  editarCredenciales(id:number, datos:{}){
    this.apiService.editarCredenciales(id, datos).subscribe((data) => {
      this.credenciales = data;
      console.log(this.credenciales);
    });
  }


  actualizarCredencial(id:number){
    var idRestado = id - 1
    Swal.fire({
      text: `Seguro que desea cambiar las credenciales de ${this.credenciales[idRestado].pasarela}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Cambiar'
    }).then((result) => {
      if (result.isConfirmed) {
        if(id === 1){
          var datos = {
            cliente_id: this.cliente_id_mercadopago,
            cliente_secret: this.cliente_secret_mercadopago
          }
        } else {
          var datos = {
            cliente_id: this.cliente_id_paypal,
            cliente_secret: this.cliente_secret_paypal
          }
        }

        this.editarCredenciales(id, datos)

        Swal.fire(
          'Listo!',
          `Credenciales de ${this.credenciales[idRestado].pasarela} cambiadas`,
          'success'
        )
      }
    })
  }

  ngOnInit(): void {
      this.getProductos()
      setTimeout(() => {
      // Aquí coloca el código que deseas ejecutar después de un segundo
      this.cargarCredenciales()
    }, 1000); // 1000 milisegundos = 1 segundo
  
  }
}
