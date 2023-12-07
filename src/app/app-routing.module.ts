import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forRoot([
          { path: '', loadChildren: () => import('./private/private.module').then(m => m.PrivateModule) }

    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
