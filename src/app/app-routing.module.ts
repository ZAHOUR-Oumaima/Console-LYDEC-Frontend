import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';


import {MainComponent} from '@modules/main/main.component';


import {DashboardComponent} from '@pages/dashboard/dashboard.component';
import {ConsommationComponent} from "@pages/consommation/consommation.component";
import {BlankComponent} from "@pages/blank/blank.component";
import {LoginComponent} from "@/login/login.component";
import {InfoPosteClientsComponent} from "@pages/info-poste-clients/info-poste-clients.component";
import {AuthGuardService} from "@services/auth-guard.service";


const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        canActivate:[AuthGuardService],
        children: [
            {
                path: 'postes',
                component: BlankComponent
            },
            {
                path: '',
                component: DashboardComponent
            },
            {
              path: 'consommation',
              component: ConsommationComponent
            },
            {
              path: 'vue_deleg',
              component: InfoPosteClientsComponent
            }
        ]
    },
    {
      path: 'login',
      component: LoginComponent
    },
    {
      path: '**',
      redirectTo: ''
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'})],
    exports: [RouterModule]
})
export class AppRoutingModule {}
