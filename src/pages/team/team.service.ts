import { Injectable } from  '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class TeamService {

  private url = "https://web-piste.herokuapp.com/signUp";

  constructor(private http: Http) {}

  signUp(teamName: any) : Observable<any> {
    return this.http.post(this.url, {name: teamName}).map(res => res.json())
  }
}
