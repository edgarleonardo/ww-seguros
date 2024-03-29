import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LifeModule } from './life/life.module';
import { MajorExpensesModule } from './major-expenses/major-expenses.module';
import { DisabilityModule } from './disability/disability.module';


const routes: Routes = [
  {
    path: 'Vida',
    loadChildren: () => import('./life/life.module').then((m) => m.LifeModule)
  },
  {
    path: 'Salud',
    loadChildren: () => import('./major-expenses/major-expenses.module').then((m) => m.MajorExpensesModule)
  },
  {
    path: 'Disability',
    loadChildren: () => import('./disability/disability.module').then((m) => m.DisabilityModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvitationRoutingModule { }
