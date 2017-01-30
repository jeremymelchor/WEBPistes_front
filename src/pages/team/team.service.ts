import { Injectable } from  '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class TeamService {

  public url = "https://web-piste.herokuapp.com/";
  public teamName: string;
  public teamColor: string;
  public socket;

  constructor(private http: Http) {
    console.log('constructeur');
    this.socket = undefined;
  }

  getTeamColor() : Observable<any> {
    let context = this;
    this.socket = io(this.url);
    let observable = new Observable(observer => {
      context.socket.on('init', (data) => {
        observer.next(data);
      });
      return () => {
        console.log("callback error inscription");
      };
    });
    console.log(this.socket);
    return observable;
  }

  closeSocket() {
    this.socket.disconnect();
    this.socket = undefined;
  }

  signUp(teamName: string) : void {
    this.socket.emit("new_client",teamName);
  }

  //=======================================================================
  // General messages
  //=======================================================================

  sendGeneralMessage(message) {
        this.socket.emit('general_message', message);
    }

  getGeneralMessages() {
    let observable = new Observable(observer => {
        this.socket.on('general_message', (data) => {
          observer.next(data);
        });
        return () => {
          console.log("Erreur récéption message general_message");
          this.socket.disconnect();
        };
      })
      return observable;
  }

  //=======================================================================
  // Private messages
  //=======================================================================

  sendPrivateMessage(message) {
        this.socket.emit('client_to_masters_message', message);
    }

  getPrivateMessages() {
    let observable = new Observable(observer => {
        this.socket.on('masters_to_client_message', (data) => {
          observer.next(data);
        });
        return () => {
          console.log("Erreur récéption message masters_to_client_message");
          this.socket.disconnect();
        };
      })
      return observable;
  }
}
