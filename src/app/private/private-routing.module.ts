import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientesComponent } from './clientes/clientes.component';
import { PrestamosComponent } from './prestamos/prestamos.component';

const routes: Routes = [
    {path:'clientes',component:ClientesComponent},
    {path: 'prestamos', component: PrestamosComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
