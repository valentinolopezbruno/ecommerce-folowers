import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Social } from '../models/producto.model';

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

  getProductos():Observable<[Social]> {
    return this.httpClient.get<[Social]>(`${API_URL}/productos`)
  }
}
