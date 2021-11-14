import { NgModule } from '@angular/core';

import { SetupRoutingModule } from './setup-routing.module';
import { CreateSessionComponent } from './components/create-session/create-session.component';
import { SetupComponent } from './setup.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {MatSelectModule} from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { DashboardBackgroundComponent } from './components/dashboard-background/dashboard-background.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    CreateSessionComponent,
    SetupComponent,
    DashboardComponent,
    DashboardBackgroundComponent
  ],
  imports: [
    SharedModule,
    SetupRoutingModule,
    MatStepperModule,
    MatExpansionModule,
    MatSelectModule,
    FontAwesomeModule
  ]
})
export class SetupModule { }
