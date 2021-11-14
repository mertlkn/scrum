import { NgModule } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { SessionRoutingModule } from './session-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScrumVotingComponent } from './components/scrum-voting/scrum-voting.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatPaginatorModule} from '@angular/material/paginator';
import { SessionFooterComponent } from './components/session-footer/session-footer.component';
import { VotesPipe } from 'src/app/core/pipe/votesPipe.pipe';
import { SessionCardsComponent } from './components/session-cards/session-cards.component';
import {OverlayModule} from '@angular/cdk/overlay';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SideBarComponent } from './components/side-bar/side-bar.component';

@NgModule({
  declarations: [
    ScrumVotingComponent,
    SessionFooterComponent,
    VotesPipe,
    SessionCardsComponent,
    SideBarComponent
  ],
  imports: [
    SharedModule,
    SessionRoutingModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    OverlayModule,
    FontAwesomeModule
  ]
})
export class SessionModule { }
