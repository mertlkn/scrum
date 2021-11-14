import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScrumVotingComponent } from './components/scrum-voting/scrum-voting.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';

const routes: Routes = [
  {
    path: '',
    component: ScrumVotingComponent,
  },
  {
    path: 'side',
    component: SideBarComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SessionRoutingModule { }
