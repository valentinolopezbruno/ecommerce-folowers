import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { CarritoComponent } from './carrito/carrito.component';
import { ProductoIndividualComponent } from './producto-individual/producto-individual.component';
import { SuccessComponent } from './success/success.component';
import { FailureComponent } from './failure/failure.component';
import { PendingComponent } from './pending/pending.component';
import { VigilanteGuard } from './vigilante.guard';
import { CredencialesComponent } from './credenciales/credenciales.component';
const routes: Routes = [
  { path: 'home', component: HomeComponent },

  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'login', component: AdminLoginComponent },

  { path: 'admin', component: AdminComponent, canActivate: [VigilanteGuard] },

  { path: 'admin/credenciales', component: CredencialesComponent, canActivate: [VigilanteGuard] },

  { path: 'cart', component: CarritoComponent },

  { path: 'success', component: SuccessComponent },

  { path: 'failure', component: FailureComponent },

  { path: 'pending', component: PendingComponent },

  { path: 'service/:idr/:idp', component: ProductoIndividualComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
