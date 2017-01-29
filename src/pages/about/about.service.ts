import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

export class AboutService {

  private url = "https://web-piste.herokuapp.com";
  private socket;
  private messageNotRead : number = 0;
  messageUpdateSource = new BehaviorSubject<number>(0);
  messageUpdate : Observable<number> = this.messageUpdateSource.asObservable();

  sendMessage(message) {
        this.socket.emit('general_message', message);
    }

  getMessages() {
    let observable = new Observable(observer => {
        this.socket = io(this.url);
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

  incrementMessageNotRead() : void {
    this.messageNotRead++;
    this.messageUpdateSource.next(this.messageNotRead);
  }

  clearMessageNotRead() : void {
    this.messageNotRead = 0;
    this.messageUpdateSource.next(this.messageNotRead);
  }

  getUrl() : string {
    return this.url;
  }
}
