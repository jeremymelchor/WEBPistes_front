import {TeamService} from "../team/team.service";
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
  private onPrivateMessage : any;
  private message : string;
  private messages_received : Array<string>;
  private isBadgeUpdatable : boolean;

  constructor(
    public contactService: ContactService,
    private teamService : TeamService) {
    this.message = "";
    this.messages_received = new Array<string>();
    this.isBadgeUpdatable = false;
  }

  //============================================================================
  // Lifecycle
  //============================================================================

  ngOnInit() {
      this.onPrivateMessage = this.teamService.getPrivateMessages().subscribe((data : any) => {
        console.log("message reçu !", data.sender, data.message);
        this.messages_received.push(data.message);
        if (this.isBadgeUpdatable)
          this.contactService.incrementMessageNotRead();
    });
  }

  ngAfterViewInit() {
    this.teamService.setTeamColorTheme();
  }

  ngOnDestroy() {
    this.onPrivateMessage.unsubscribe();
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
      this.teamService.sendPrivateMessage(this.message);
      this.message = "";
    }
  }

}
