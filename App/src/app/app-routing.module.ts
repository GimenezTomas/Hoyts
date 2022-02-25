import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuncionesDisponiblesComponent } from './funciones-disponibles/funciones-disponibles.component';

const routes: Routes = [
  {
    path:'funciones-disponibles',
    component:FuncionesDisponiblesComponent
  },
  {
    path: '',
    redirectTo: '/funciones-disponibles',
    pathMatch: 'full' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
