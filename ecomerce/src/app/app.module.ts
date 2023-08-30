import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { HomeComponent } from './home/home.component';
import { APIService } from './services/api.service';
import { FormsModule } from '@angular/forms';
import { AdminModule } from './admin/admin.module';
import { MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { CarritoComponent } from './carrito/carrito.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { ProductoIndividualComponent } from './producto-individual/producto-individual.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { NgxSpinnerModule } from "ngx-spinner";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { SuccessComponent } from './success/success.component';
import { FailureComponent } from './failure/failure.component';
import { PendingComponent } from './pending/pending.component';
import { CredencialesComponent } from './credenciales/credenciales.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    AdminLoginComponent,
    HomeComponent,
    CarritoComponent,
    ProductoIndividualComponent,
    SuccessComponent,
    FailureComponent,
    PendingComponent,
    CredencialesComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AdminModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatCardModule,
    MatTableModule,
    NgxPayPalModule,
    NgxSpinnerModule,
    
    
  ],
  providers: [APIService],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})

export class AppModule { }
