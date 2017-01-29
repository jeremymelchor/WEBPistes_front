import {AboutService} from "./about.service";
import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage implements OnInit, OnDestroy {

  private socket;
  private listener : any;
  private message : string;
  private messages_received : Array<string>;
  private isBadgeUpdatable : boolean;

  constructor(private aboutService : AboutService) {
    this.message = "";
    this.messages_received = new Array<string>();
    this.isBadgeUpdatable = false;
  }

  //============================================================================
  // Lifecycle
  //============================================================================

  ngOnInit() {
      console.log("On ngOnInit");
      this.listener = this.aboutService.getMessages().subscribe((data : any) => {
        console.log("message reçu !", data.sender, data.message);
        this.messages_received.push(data.message);
        if (this.isBadgeUpdatable)
          this.aboutService.incrementMessageNotRead();
        console.log(this.messages_received);
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
        this.aboutService.sendMessage(this.message);
        this.message = "";
      }
    }





}
