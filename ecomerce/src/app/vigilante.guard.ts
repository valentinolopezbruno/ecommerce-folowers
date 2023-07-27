import { Injectable } from '@angular/core';

import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { APIService } from './services/api.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class VigilanteGuard implements CanActivate {
  constructor(private apiService: APIService, private router: Router) {
    console.log('AdminLoginComponent constructor');
  }

  private agregarCeros(numero: number): string {
    return numero < 10 ? '0' + numero : numero.toString();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    var tokenParseado = localStorage.getItem('token');
    var token = JSON.parse(tokenParseado ?? 'null');
    const fecha = new Date();
    const anio = fecha.getFullYear();
    const mes = this.agregarCeros(fecha.getMonth() + 1);
    const dia = this.agregarCeros(fecha.getDate());
    var date = `${anio}-${mes}-${dia}`;

    if (token) {
      return this.apiService.consultarToken(token, date).pipe(
        map((data: any) => {
          if (data.code == 1) {
            console.log(data.code);
            return true;
          } else {
            this.router.navigate(['../login']);
            return false;
          }
        })
      );
    } else {
     return false;
      
    }
  }
}