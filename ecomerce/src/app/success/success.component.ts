import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarritoService } from '../services/carrito.service';

import { APIService } from '../services/api.service';
import { Carrito, CarritoItem } from '../models/carrito';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css'],
})
export class SuccessComponent implements OnInit {
  constructor(private APIService: APIService, private route: ActivatedRoute, private CarritoService: CarritoService) {}

  carrito: Carrito = { productos: [] };

  carritoFinal: Carrito = { productos: [] };

  datosEntrada: Array<CarritoItem> = [];
  
  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    console.log('Valor del query param: ', token);

    this.CarritoService.carrito.subscribe((carrito: Carrito) => {
      this.carrito = carrito;

      this.datosEntrada = this.carrito.productos;

      
      console.log('carrito');
      console.log(this.carrito);

     
    });


    if (token != null) {
      this.APIService.validarPagoPaypal(token).subscribe({
        next: (res) => {
          console.log(res.estado);
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
  }
}
