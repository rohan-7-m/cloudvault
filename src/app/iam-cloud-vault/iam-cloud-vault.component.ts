import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstant } from '../../@core/constant/app.constant';
import jwt_decode from 'jwt-decode';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-iam-cloud-vault',
  templateUrl: './iam-cloud-vault.component.html',
  styleUrls: ['./iam-cloud-vault.component.css']
})
export class IamCloudVaultComponent {
  responseData: any;
  targetDateString: string;
  daysRemaining: number;
  jsonFileName: string;
  jwt:string;


  @ViewChild('copyElement', { static: false }) copyElementRef!: ElementRef;

  constructor(private http: HttpClient) {
    console.log("iam-cloud-vault.component.ts");
    console.log(window.location.href);
    let url=window.location.href;
    this.jsonFileName = "";
    this.targetDateString = "";
    this.daysRemaining = 0;
    this.jwt="";

    const parts = url.split('/'); // Split the URL by '/'
    this.jsonFileName = parts[parts.length - 1]; // Get the last part of the URL
    localStorage.setItem('jsonFileName',this.jsonFileName+".json");
    // console.log("localStorage.getItem('jwtJWT') : ",localStorage.getItem('jwtJWT'));
    // console.log("sessionStorage.getItem('jwtJWT') : ",sessionStorage.getItem('jwtJWT'));
    this.jwt=localStorage.getItem('jwtJWT')!;
    console.log("jwt : ",this.jwt);
    if (sessionStorage.getItem('AUTHENTICATED') == 'true'){
        // sessionStorage.setItem('AUTHENTICATED',"false")
        console.log(localStorage.getItem('jsonFileName'));
        const inputString : string = localStorage.getItem('jsonFileName')!; // Replace with your input string
        // this.targetDateString = this.extractDateFromInput(inputString);
        // console.log(this.targetDateString);
        // this.daysRemaining = this.calculateDaysRemaining();
        this.API_retrive_data()
        console.log("api responsedata : ",this.responseData);
    }
  }
  base64url(source: any) {
    let encodedSource = CryptoJS.enc.Base64.stringify(source);

    encodedSource = encodedSource.replace(/=+$/, '');

    encodedSource = encodedSource.replace(/\+/g, '-');
    encodedSource = encodedSource.replace(/\//g, '_');

    return encodedSource;
  }

  encodeToken(payload:any) {
    var header = {
      "alg": "HS256",
      "typ": "JWT"
    };

    var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
    var encodedHeader = this.base64url(stringifiedHeader);

    var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(payload));
    var encodedData = this.base64url(stringifiedData);

    var token = encodedHeader + "." + encodedData;
    return token;
  }
  signToken(payload:any,key:string) {
    var secret = key;
    let token:any = this.encodeToken(payload);

    var signature:any = CryptoJS.HmacSHA256(token, secret);
    signature = this.base64url(signature);

    var signedToken = token + "." + signature;
    return signedToken;
  }
  getDecodedJWTtoken(token: any) {
    try {
        return jwt_decode(token);
    } catch (Error) {
        return null;
    }
  }

  API_retrive_data(){
    console.log("localStorage.getItem('jwtJWT') : ",localStorage.getItem('jwtJWT'));
    console.log("sessionStorage.getItem('jwtJWT') : ",sessionStorage.getItem('jwtJWT'));
    console.log("jwt : ",this.jwt);
    let jwt_json: any = this.getDecodedJWTtoken(this.jwt);
    jwt_json.json_filename=localStorage.getItem('jsonFileName')
    const { v4: uuidv4 } = require('uuid');
    var secretKey = uuidv4();
    const authentication_token=this.signToken(jwt_json,secretKey)
    this.jwt=authentication_token
    console.log("new jwt : ", this.jwt);

    const apiUrl = 'https://9a9lyywea6.execute-api.us-east-1.amazonaws.com/dev/getbucket'; // Replace with your API URL
    const requestBody = {
      json_file_name: localStorage.getItem('jsonFileName')
    };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': this.jwt });
    this.http.post(apiUrl, requestBody, { headers }).subscribe((response) => {
      this.responseData = response;
      console.log( this.responseData.credential_created_date)
      this.targetDateString = this.extractDateFromInput(String(this.responseData.credential_created_date));
      console.log(this.targetDateString);
      this.daysRemaining = this.calculateDaysRemaining();
    });
  }



  downloadTxtFile() {
    const jsonDataStr = JSON.stringify(this.responseData, null, 2);
    const blob = new Blob([jsonDataStr], { type: 'text/plain' });
    const anchor = document.createElement('a');
    anchor.download = localStorage.getItem('jsonFileName')+'.txt';
    anchor.href = URL.createObjectURL(blob);
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  }

  onCopyClick(copyText: any) {
    const textArea = document.createElement('textarea');
    textArea.value = copyText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    // Add visual feedback or notification here
    alert('Copied: ' + copyText);
  }


  private extractDateFromInput(input: string): string {
    const regex = /(\d{4}-\d{2}-\d{2})/; // Regular expression to match date format
    const match = input.match(regex);
    return match ? match[1] : '';
  }

  private calculateDaysRemaining(): number {
    if (!this.targetDateString) {
      return 0;
    }

    const currentDate = new Date();
    const targetDate = new Date(this.targetDateString);
    const millisecondsInADay = 1000 * 60 * 60 * 24;
    const timeDifference = (targetDate.getTime() + (15 * millisecondsInADay))- currentDate.getTime();
    console.log(timeDifference);
    const daysRemaining = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysRemaining >= 0 ? daysRemaining : 0;
  }


}
