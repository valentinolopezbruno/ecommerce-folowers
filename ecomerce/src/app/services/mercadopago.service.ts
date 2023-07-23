import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

const API_URL = 'http://localhost:3000'

@Injectable({
  providedIn: 'root'
})
export class MercadoPagoService {
  private mercadoPagoUrl = 'https://api.mercadopago.com';

  constructor(private http: HttpClient) {}

  crearPreferenciaPago(preferenceData: any): Promise<any> {
    const url = `${this.mercadoPagoUrl}/checkout/preferences`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer TEST-1790631385670646-071709-e8884300ac14cc95ce394ddc5534b9f6-1425228965`
    });

    return this.http.post<any>(url, preferenceData, { headers }).toPromise();
  }

  pagar(carrito: any): Observable<string> { // Cambiar el tipo de retorno a Observable<string>
    return this.http.post(`${API_URL}/pagar`, carrito, { responseType: 'text' });
  }


}