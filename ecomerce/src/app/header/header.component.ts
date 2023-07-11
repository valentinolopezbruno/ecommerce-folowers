import { Component, OnInit } from '@angular/core';
import { APIService } from '../services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  constructor( private APIService: APIService){}

  redes: any[] | null = null;
  indexCalcularPrecio = 0;
  usuario: string = '';

  getProductos():void{
      this.APIService.getProductos().subscribe(data => {this.redes = data , console.log(this.redes)});
  }

  ngOnInit(){
      this.getProductos();
      console.log(this.redes)
  }
}
