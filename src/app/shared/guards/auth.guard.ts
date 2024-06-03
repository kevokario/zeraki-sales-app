import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {environment} from "../../../environments/environment";

export const authGuard: CanActivateFn = (route, state) => {
  const user = localStorage.getItem(environment.userToken);
  const router = inject(Router);
  if(user) {
    return true;
  }
  router.navigate(['']);
  return false;
};
