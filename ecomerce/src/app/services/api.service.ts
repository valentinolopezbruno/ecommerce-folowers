import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Social } from '../models/social.model';
import { Carrito } from '../models/carrito';
import { API_URL } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class APIService {

constructor(private httpClient: HttpClient) { }

private ipInfoUrl = 'https://ipinfo.io?token=3f08b36a7b1f53';

getGeoLocation() {
  return this.httpClient.get(this.ipInfoUrl);
}

  validarUsuario(nombre: string, contra: string):Observable<{}> {
    return this.httpClient.post<{}>(`${API_URL}/usuarios`, {nombre, contra})
  }

  consultarToken(token:string, date: string):Observable<{}>{
    return this.httpClient.post<{}>(`${API_URL}/usuarios-token`, {token,date});
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

  /* - - - - - - - - - -- - - - - - - - - - - - - - - - - -  PRODUCTOS CANTIDAD */

  editarProductosCantidad(id:number, datos:{}): Observable<{}>{
    return this.httpClient.post<{}>(`${API_URL}/productos_cantidad`, {id, datos});
  }

  eliminarProductoCantidad(id: number): Observable<any> {
    const requestData = { id: id }; // Envuelve el ID en un objeto
    return this.httpClient.post<any>(`${API_URL}/producto_cantidad_borrar`, requestData);
  }

  agregarProductoCantidad(id:number, datos:{}){
    return this.httpClient.post<any>(`${API_URL}/producto_cantidad_agregar`, {id,datos});
  }

  /* - - - - - - - - - -- - - - - - - - - - - - - - - - - -  COMPRA MERCADOPAGO */
  realizarPago(carrito: any): Observable<{}> {
    return this.httpClient.post<{}>(`${API_URL}/pay`, carrito)
  }

  /* - - - - - - - - - -- - - - - - - - - - - - - - - - - -  COMPRA PAYPAL */
  pagoPaypal(carrito: any): Observable<any>{
    return this.httpClient.post<any>(`${API_URL}/create-order-paypal`, carrito)
  }

  validarPagoPaypal(token: string): Observable<any> {
    return this.httpClient.get<any>(`${API_URL}/capture-order?token=${token}`);
  }

  /* - - - - - - - - - -- - - - - - - - - - - - - - - - - -  RED SOCIAL */
  agregarRedSocial(nombre: string, file: File): Observable<{}> {
    console.log("service");
    console.log(file);
    console.log(nombre);
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('nombre', nombre);
  
    // Convertir formData en un objeto imprimible
    const formDataObject: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });
  
    console.log(formDataObject);
  
    return this.httpClient.post<{}>(`${API_URL}/social`, formData);
  }  
  
  /* - - - - - - - - - -- - - - - - - - - - - - - - - - - -  CREDENCIALES */

  getCredenciales():Observable<any[]> {
    return this.httpClient.get<any[]>(`${API_URL}/credenciales`)
  }

  editarCredenciales(id:number, datos:{}): Observable<{}>{
    return this.httpClient.post<{}>(`${API_URL}/credenciales`, {id, datos});
  }



}
