import { Injectable } from '@angular/core';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router:Router) { }

  // s'authentifier
  authenticate(username, password) {
    if (username === "admin" && password === "admin") {   // exemple : admin - admin
      sessionStorage.setItem('username', username)
      return true;
    }
    return false;
  }

  // verifier s'il est authentifier (session)
  isUserLoggedIn() {
    let user = sessionStorage.getItem('username');
    console.log(!(user === null))
    return !(user === null)
  }

  // se déconnecter
  logOut() {
    sessionStorage.removeItem('username');
    this.router.navigate(['login']);
  }

}
