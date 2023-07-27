import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_URL } from '../app.config';


@Injectable({
  providedIn: 'root'
})
export class MercadoPagoService {
  private mercadoPagoUrl = 'https://api.mercadopago.com';

  constructor(private http: HttpClient) {}


  pagar(carrito: any): Observable<string> { // Cambiar el tipo de retorno a Observable<string>
    return this.http.post(`${API_URL}/pagar`, carrito, { responseType: 'text' });
  }


}