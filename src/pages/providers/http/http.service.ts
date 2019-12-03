import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

import 'rxjs/add/operator/map';
/*
  Generated class for the HttpProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

let apiUrl = 'https://morning-gorge-50959.herokuapp.com/api/v2/'

@Injectable()
export class HttpProvider {

  headers?: Headers | null;

  constructor(public http: Http, public alertCtrl: AlertController) {
    console.log('Hello HttpProvider Provider');
  }

  uploadPic(data) {
    return this.http.post(apiUrl + "student/" + 10 + "/report", data);
  }

  getStudent() {
    var url = apiUrl + "student/" + 10 + "/reports";
    return this.http.get(url)
      .map(res => res.json())
  }
 
}