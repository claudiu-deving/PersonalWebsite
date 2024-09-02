import { Injectable, OnInit } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

const oAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: environment.clientUrl + '/landing',
  clientId: "789097994958-jscm33m60q64mrcggm388md7ijs8llm9.apps.googleusercontent.com",
  scope: "openid profile email",
}

export interface UserInfo {
  info: {
    sub: string,
    email: string,
    name: string,
    picture: string
  }
}

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {
  private userProfileSubject = new BehaviorSubject<UserInfo | null>(null);
  userProfile$ = this.userProfileSubject.asObservable();

  constructor(private readonly oAuth: OAuthService) {
    oAuth.configure(oAuthConfig);
    this.setupOAuth();
  }

  public setupOAuth(): void {
    console.log("Setting up the auth")
    this.oAuth.events.subscribe(event => {
      console.log('OAuth event:', event);
    });

    // Log any errors
    this.oAuth.events.subscribe(event => {
      if (event.type === 'discovery_document_load_error') {
        console.error('Error loading discovery document:', event);
      }
    });
  }

  public async logIn(): Promise<void> {
    console.log('Starting login process');
    try {
      await this.oAuth.loadDiscoveryDocument();
      console.log('Discovery document loaded');

      // Check current state
      console.log('Current state:', {
        hasValidAccessToken: this.oAuth.hasValidAccessToken(),
        hasValidIdToken: this.oAuth.hasValidIdToken(),
        state: this.oAuth.state
      });

      // Attempt login
      const loginResult = await this.oAuth.tryLoginImplicitFlow();
      console.log('Login result:', loginResult);

      if (!loginResult) {
        console.log('No login result, initiating login flow');
        this.oAuth.initLoginFlow();
      } else if (this.oAuth.hasValidAccessToken()) {
        console.log('Valid access token found, loading user profile');
        await this.loadUserProfile();
      } else {
        console.log('Login completed but no valid access token');
      }
    } catch (error) {
      console.error('Error during login process:', error);
    }
  }

  public async loadUserProfile(): Promise<void> {

    try {
      await this.oAuth.tryLoginImplicitFlow().then(async (response) => {
        if (response) {
          const userProfile = await this.oAuth.loadUserProfile() as UserInfo;
          this.userProfileSubject.next(userProfile);
          console.log('User profile loaded:', userProfile);
        }
      });

    } catch (error) {
      console.error('Error loading user profile:', error);
      this.userProfileSubject.next(null);
    }

  }


  public logOut(): void {
    this.oAuth.logOut();
    this.userProfileSubject.next(null);
    console.log('Logged out');
  }

  public getAuthorizationHeader(): string {
    return "Bearer " + this.oAuth.getAccessToken();
  }

  public getTokenData(): any {
    return {
      accessToken: this.oAuth.getAccessToken(),
      idToken: this.oAuth.getIdToken(),
      validAccessToken: this.oAuth.hasValidAccessToken(),
      validIdToken: this.oAuth.hasValidIdToken(),
      expiresAt: this.oAuth.getAccessTokenExpiration(),
    };
  }
}
