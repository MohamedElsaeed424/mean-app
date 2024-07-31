import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {Subject} from "rxjs";


@Injectable({providedIn: 'root'})

export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();

  constructor( private http: HttpClient , private router : Router) {}

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getAuthStatus() {
    return this.isAuthenticated;
  }

  signup(email: string, password: string) {
    const authData = {email: email, password: password};
    this.http.post(`${environment.apiUrl}/auth/signup`, authData)
      .subscribe(response => {
        console.log(response);
        this.router.navigate(['/auth/login']);
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  login(email: string, password: string) {
    const authData = {email: email, password: password};
    this.http.post<{accessToken :string ,expiresIn:any ,userId:string}>(`${environment.apiUrl}/auth/login`, authData)
      .subscribe(response => {
        const token = response['accessToken'];
        this.token = token;
        if(token){
          // to update UI for Logout after session expires as number of seconds
          const expiresInDuration = response['expiresIn'];
          this.userId = response['userId'];
          this.setAuthTimer(expiresInDuration)
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          //------------------------------------
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate);
          //------------------------------------
          this.router.navigate(['/']);
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  logout() {
    this.token = null;
    this.userId = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', this.userId);
  }
  clearAuthData() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  getAuthData() {
    const token = localStorage.getItem('accessToken');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate || !userId) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.userId = authInformation.userId;
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
      this.setAuthTimer(expiresIn / 1000);
    }
  }

}
