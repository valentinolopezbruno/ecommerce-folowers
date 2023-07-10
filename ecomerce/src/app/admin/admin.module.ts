import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AdminComponent,
  ],
  imports: [
    CommonModule,
    FormsModule
  ], 
  exports: [ 
    AdminComponent,
  ]
})
export class AdminModule { }
