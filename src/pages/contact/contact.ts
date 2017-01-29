import {ContactService} from "./contact.service";
import { Component } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  private socket;
  private listener : any;
  private message : string;
  private messages_received : Array<string>;
  private isBadgeUpdatable : boolean;

  constructor(public contactService: ContactService) {
    this.message = "";
    this.messages_received = new Array<string>();
    this.isBadgeUpdatable = false;
  }

  //============================================================================
  // Lifecycle
  //============================================================================

  ngOnInit() {
      this.listener = this.contactService.getMessages().subscribe((data : any) => {
        console.log("message reçu !", data.sender, data.message);
        this.messages_received.push(data.message);
        if (this.isBadgeUpdatable)
          this.contactService.incrementMessageNotRead();
    });
  }

  ngOnDestroy() {
    this.listener.unsubscribe();
  }

  ionViewWillEnter() {
    this.isBadgeUpdatable = false;
  }

  ionViewWillLeave() {
    this.isBadgeUpdatable = true;
  }

  //==========================================================================
  // Utils
  //==========================================================================

  sendMessage() : void {
    if (this.message != "") {
      console.log("on emit le message",this.message);
      this.contactService.sendMessage(this.message);
      this.message = "";
    }
  }

}
