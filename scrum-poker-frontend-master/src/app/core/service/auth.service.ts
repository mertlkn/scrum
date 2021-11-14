import { Injectable } from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {GapiService} from './gapi.service';
import {filter, take} from 'rxjs/operators';
import BasicProfile = gapi.auth2.BasicProfile;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // @ts-ignore
  private basicProfile: BasicProfile = null;
  private idToken = '';

  public loggedIn$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1); // Logged in with GAPI
  private authenticated$: ReplaySubject<boolean> = new ReplaySubject<boolean>(
    1
  ); // Logged in with GAPI & Endpoints Profile retrieved
  constructor(private gapiService: GapiService) {
    this.gapiService.signInStatus$.subscribe(loggedInStatus => {
      this.onSignStatusChange(loggedInStatus);
    });
  }

  public login(): Promise<boolean> {
    const loginPromise: Promise<boolean> = this.authenticated$.pipe(
      filter((status) => status),
      take(1)
    ).toPromise();
    this.gapiService.login();
    return loginPromise;
  }

  public getIdToken(): string {
    return this.idToken;
  }

  public getBasicProfile(): BasicProfile {
    return this.basicProfile;
  }

  public async logout(): Promise<boolean> {
    const logoutPromise: Promise<boolean> = this.authenticated$
      .pipe(
        filter((status) => !status),
        take(1)
      )
      .toPromise();
    this.gapiService.logout();
    return logoutPromise;
  }

  private onSignStatusChange(loggedInStatus: boolean): void {
    if (loggedInStatus) {
      const currentUser: gapi.auth2.CurrentUser = this.gapiService.getCurrentUser();
      this.idToken = currentUser.get().getAuthResponse().id_token;
      this.basicProfile = currentUser.get().getBasicProfile();
    } else {
      // @ts-ignore
      this.basicProfile = null;
    }
    this.loggedIn$.next(loggedInStatus);
  }
}
