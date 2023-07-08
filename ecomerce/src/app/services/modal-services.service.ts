import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalServicesService {

  constructor() { }

  $modal = new EventEmitter<any>();
  
}
