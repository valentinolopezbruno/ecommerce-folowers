import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { APIService } from '../services/api.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css'],
})
export class SuccessComponent implements OnInit {
  constructor(private APIService: APIService, private route: ActivatedRoute) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    console.log('Valor del query param: ', token);
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
