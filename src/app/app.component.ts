import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstant } from '../@core/constant/app.constant';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'cloudVault';
  router: any;
  jsonFileName: string;

  constructor(private http: HttpClient, private _loader: NgxUiLoaderService) {
    // this._loader.start(); 
    console.log(window.location.href);
    if (window.location.href.includes('jwt=')) {
      localStorage.setItem('jwtJWT',window.location.href.split('jwt=')[1]);
      sessionStorage.setItem('jwtJWT',window.location.href.split('jwt=')[1]);
    }

    let url=window.location.href;
    this.jsonFileName = "";
    
    switch (AppConstant.APP_ENV) {
      case 'PROD' : this.validateLogin(AppConstant.DEV_OKTA_URL); break;
      case 'UAT' : this.validateLogin(AppConstant.DEV_OKTA_URL); break;
      case 'DEV': this.validateLogin(AppConstant.DEV_OKTA_URL); break;
    }
    // this._loader.stop()
  }

  ngOnInit(): void {
  }

  validateLogin(Auth_url : any) {
    if (sessionStorage.getItem('AUTHENTICATED') == null  || (sessionStorage.getItem('AUTHENTICATED') == "false" && !window.location.href.includes('jwt='))){
      sessionStorage.setItem('AUTHENTICATED',"false");
      sessionStorage.setItem('url',window.location.href);
      window.location.href=Auth_url;
    }else{
      console.log("window.location.href : ",window.location.href);
      console.log("localStorage.getItem('jwt') : ",localStorage.getItem('jwt'));
      sessionStorage.setItem('AUTHENTICATED',"true");
      console.log("sessionStorage.getItem('url') : ",sessionStorage.getItem('url'));
      if ( window.location.href != sessionStorage.getItem('url')!){
        window.location.href = sessionStorage.getItem('url')!;
        window.location.reload();
      }
    }
  }

}
