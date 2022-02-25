import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FuncionesDisponiblesComponent } from './funciones-disponibles/funciones-disponibles.component';
import { ReservarComponent } from './reservar/reservar.component';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [
    AppComponent,
    FuncionesDisponiblesComponent,
    ReservarComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    RouterModule.forRoot([
      {
        path: 'funciones-disponibles', component: FuncionesDisponiblesComponent
      },{
        path: 'reservar/:id', component: ReservarComponent, pathMatch: 'full'
      },{
        path:'', redirectTo:'/funciones-disponibles', pathMatch: 'full'
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
