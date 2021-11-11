import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {AuthService} from "@services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {

  username: string;
  password: string;
  invalidLogin: boolean = false;

  constructor(private elementRef:ElementRef, private auth: AuthService, private router: Router) { }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.ownerDocument
      .body.style.backgroundColor = '#03224c';
  }

  checkLogin(){
    if (this.auth.authenticate(this.username, this.password)) {
      this.router.navigate([''])
      this.invalidLogin = false
    }
    this.invalidLogin = true
  }


}
