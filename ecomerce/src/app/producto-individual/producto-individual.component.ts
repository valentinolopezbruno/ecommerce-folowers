import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIService } from '../services/api.service';

@Component({
  selector: 'app-producto-individual',
  templateUrl: './producto-individual.component.html',
  styleUrls: ['./producto-individual.component.css'],
})

export class ProductoIndividualComponent implements OnInit {
  idred = 0;
  idprod = 0;
  indexCalcularPrecio= 0;
  // IMPORTO ANGULARROUTE Y ME SUSCRIBO ESPECIFICAMENTE AL ID QUE ESOTOY PASANDO EN LA URL.
  constructor(private ActivatedRoute: ActivatedRoute, private APIService:APIService) {
    this.ActivatedRoute.params.subscribe((params) => {
      this.idred = params['idr'];
    });
    this.ActivatedRoute.params.subscribe((params) => {
      this.idprod = params['idp'];
    });
  }

  redes: any[] | null = null;


  
  calcularIndex(event: any): void {
    var index = event.target.value;
    this.indexCalcularPrecio = index;
  }

  getProductos(): void {
    this.APIService.getProductos().subscribe((data) => {
      (this.redes = data), console.log(this.redes);
    });
    console.log(this.redes)
  }

  ngOnInit(): void {
    this.getProductos()
  }
}
