import {
    Component,
    OnInit,
    ViewChild,
    HostListener,
    ElementRef,
    Renderer2
} from '@angular/core';
import {AppService} from '@services/app.service';
import {DateTime} from 'luxon';
import {AuthService} from "@services/auth.service";

@Component({
    selector: 'app-user-dropdown-menu',
    templateUrl: './user-dropdown-menu.component.html',
    styleUrls: ['./user-dropdown-menu.component.scss']
})
export class UserDropdownMenuComponent{

    @ViewChild('dropdownMenu', {static: false}) dropdownMenu;
    @HostListener('document:click', ['$event'])
    clickout(event) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.hideDropdownMenu();
        }
    }

    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2,
        private auth : AuthService
    ) {}


    toggleDropdownMenu() {
        if (this.dropdownMenu.nativeElement.classList.contains('show')) {
            this.hideDropdownMenu();
        } else {
            this.showDropdownMenu();
        }
    }

    showDropdownMenu() {
        this.renderer.addClass(this.dropdownMenu.nativeElement, 'show');
    }

    hideDropdownMenu() {
        this.renderer.removeClass(this.dropdownMenu.nativeElement, 'show');
    }

    formatDate(date) {
        return DateTime.fromISO(date).toFormat('dd LLL yyyy');
    }

    Logout(){
      this.auth.logOut();
    }

}
