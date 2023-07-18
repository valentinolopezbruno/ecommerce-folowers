import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { CarritoComponent } from './carrito/carrito.component';
import { ProductoIndividualComponent } from './producto-individual/producto-individual.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },

  { path: '', redirectTo: 'home',  pathMatch:'full' },

  { path: 'login', component: AdminLoginComponent },

  { path: 'admin', component: AdminComponent },

  { path: 'cart', component: CarritoComponent },

  { path: 'service/:idr/:idp', component: ProductoIndividualComponent },

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
