import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Social } from '../models/social.model';
import { Carrito } from '../models/carrito';

const API_URL = 'http://localhost:3000'

@Injectable({
  providedIn: 'root'
})
export class APIService {

  constructor(private httpClient: HttpClient) { }

  /* validarUsuario(nombre: string, contra: string): Observable<{}> {
    return this.httpClient.get<{}>(`${API_URL}/usuarios`)
  } */

  validarUsuario(nombre: string, contra: string):Observable<{}> {
    return this.httpClient.post<{}>(`${API_URL}/usuarios`, {nombre, contra})
  }

  realizarPago(carrito: any): Observable<any> {
    console.log("canseri")
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(carrito),
      headers: { 'Content-Type': 'application/json' }
    };

    return new Observable<any>(observer => {
      fetch(`${API_URL}/pay`, requestOptions)
        .then(response => response.json())
        .then(data => {
          // Hacer algo con los datos de la respuesta
          observer.next(data);
          observer.complete();
        })
        .catch(error => {
          // Manejar cualquier error
          observer.error(error);
        });
    });
  }

  getProductos():Observable<any[]> {
    return this.httpClient.get<any[]>(`${API_URL}/productos`)
  }

  agregarProductos(data: any, file: File): Observable<{}> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('data', JSON.stringify(data));

    return this.httpClient.post<{}>(`${API_URL}/productos`, formData);
  }

  eliminarProducto(id: number): Observable<number> {
    const requestBody = { id: id }; // Enviar el ID dentro de un objeto JSON
    return this.httpClient.post<number>(`${API_URL}/producto`, requestBody);
  }


}
