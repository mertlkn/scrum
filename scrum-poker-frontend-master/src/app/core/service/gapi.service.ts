import {Injectable, NgZone} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GapiService {

  public readonly initStatus$: ReplaySubject<boolean> = new ReplaySubject<boolean>(
    1
  );
  public readonly signInStatus$: ReplaySubject<boolean> = new ReplaySubject<boolean>(
    1
  );

  private auth2!: gapi.auth2.GoogleAuth;

  constructor(private ngZone: NgZone) {
    this.load().then(() => {
      this.initStatus$.next(true);
    });
  }

  public login(): void {
    this.auth2.signIn();
  }

  public getCurrentUser(): gapi.auth2.CurrentUser {
    return this.auth2.currentUser;
  }

  public logout(): void {
    this.auth2.signOut();
  }

  private async load(): Promise<boolean> {
    return new Promise((resolve) => {
      gapi.load('auth2', () => {
        gapi.auth2.init({
          client_id: environment.clientId,
          cookie_policy: 'single_host_origin'
        }).then((auth2) => {
          this.auth2 = auth2;
          this.signInStatus$.next(this.auth2.isSignedIn.get());
          this.auth2.isSignedIn.listen((val) => {
            this.ngZone.run(() => {
              this.signInStatus$.next(val);
            });
          });
          resolve(true);
        });
      });
    });
  }
}
