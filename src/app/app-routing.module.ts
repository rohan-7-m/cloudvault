import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { IamCloudVaultComponent } from './iam-cloud-vault/iam-cloud-vault.component';

const routes: Routes = [
  {path: '', component:AppComponent,
    children :[
      {path: 'iam', component:IamCloudVaultComponent ,
        children:[
          { path: '**', component: IamCloudVaultComponent }
        ]
      },
    ]
  }
  // { path: 'iam', component: IamCloudVaultComponent }
 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
