import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

export class ContactService {

  private messageNotRead : number = 0;
  messageUpdateSource = new BehaviorSubject<number>(0);
  messageUpdate : Observable<number> = this.messageUpdateSource.asObservable();

  incrementMessageNotRead() : void {
    this.messageNotRead++;
    this.messageUpdateSource.next(this.messageNotRead);
  }

  clearMessageNotRead() : void {
    this.messageNotRead = 0;
    this.messageUpdateSource.next(this.messageNotRead);
  }
}
