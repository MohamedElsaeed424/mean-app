import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot
} from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    const isAuth = this.authService.getAuthStatus();
    if(!isAuth) {
      this.router.navigate(['/auth/login']);
    }
    return isAuth;
  }



}
