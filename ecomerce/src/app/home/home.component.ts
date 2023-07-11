import { Component, OnInit } from '@angular/core';
import { APIService } from '../services/api.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  constructor( private APIService: APIService){}

  redes: any[] | null = null;
  indexCalcularPrecio = 0;
  usuario: string = '';

  getProductos():void{
      this.APIService.getProductos().subscribe(data => {this.redes = data , console.log(this.redes)});
  }

  calcularPrecio(event:any):void{
    var index = event.target.value;
    this.indexCalcularPrecio = index;
  }

  agregarCarrito():void{
    console.log(this.usuario);
  }

  ngOnInit(){
      this.getProductos();
      console.log(this.redes)
  }
}
