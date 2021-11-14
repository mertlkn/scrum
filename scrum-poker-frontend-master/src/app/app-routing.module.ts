import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/components/login/login.component';
import { CallbackJiraComponent } from './core/components/callback-jira/callback-jira.component';
import { LoadingComponent } from './components/loading/loading.component';

const routes: Routes = [
  { path: 'loading',
component: LoadingComponent},
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'callbackjira',
    component: CallbackJiraComponent
  },
  {
    path: '',
    loadChildren: () => import('./modules/setup/setup.module').then(m => m.SetupModule)
  },
  {
		path: 'poker',
		loadChildren: () => import('./modules/session/session.module').then(m => m.SessionModule),
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
