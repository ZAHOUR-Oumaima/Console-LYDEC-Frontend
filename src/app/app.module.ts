import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {ButtonModule} from 'primeng/button';
import {TabViewModule} from 'primeng/tabview';
import {ChartModule} from 'primeng/chart';
import {DropdownModule} from 'primeng/dropdown';
import {CardModule} from 'primeng/card';
import {SliderModule} from 'primeng/slider';
import {GMapModule} from 'primeng/gmap';

import {AppRoutingModule} from '@/app-routing.module';
import {AppComponent} from './app.component';
import {MainComponent} from '@modules/main/main.component';

import {HeaderComponent} from '@modules/main/header/header.component';
import {FooterComponent} from '@modules/main/footer/footer.component';
import {MenuSidebarComponent} from '@modules/main/menu-sidebar/menu-sidebar.component';
import {BlankComponent} from '@pages/blank/blank.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {DashboardComponent} from '@pages/dashboard/dashboard.component';
import {ToastrModule} from 'ngx-toastr';

import {CommonModule, registerLocaleData} from '@angular/common';
import localeEn from '@angular/common/locales/en';
import {UserDropdownMenuComponent} from '@modules/main/header/user-dropdown-menu/user-dropdown-menu.component';


import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { ConsommationComponent } from './pages/consommation/consommation.component';
import { LoginComponent } from './login/login.component';
import { MatSliderModule } from '@angular/material/slider';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from "@angular/material/input";
import {MatNativeDateModule} from "@angular/material/core";
import {MatSelectModule} from '@angular/material/select';

import { InfoPosteClientsComponent } from './pages/info-poste-clients/info-poste-clients.component';

registerLocaleData(localeEn, 'en-EN');

@NgModule({
    declarations: [
        AppComponent,
        MainComponent,
        HeaderComponent,
        FooterComponent,
        MenuSidebarComponent,
        BlankComponent,
        DashboardComponent,
        UserDropdownMenuComponent,
        ConsommationComponent,
        LoginComponent,
        InfoPosteClientsComponent
    ],
  imports: [
    ButtonModule,
    TabViewModule,
    ChartModule,
    DropdownModule,
    CardModule,
    SliderModule,
    GMapModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    NgbModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatSliderModule,
    MatSelectModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    })
  ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
