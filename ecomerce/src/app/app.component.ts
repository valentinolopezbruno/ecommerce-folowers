import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
 <!--  <app-header style="position: fixed;  width: 100%;"></app-header> -->
  <router-outlet></router-outlet>
  <app-footer style="position: fixed;  width: 100%;"></app-footer>
  `, 
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Ecomerce';
}
