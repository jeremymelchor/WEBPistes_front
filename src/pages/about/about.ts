import {TeamService} from "../team/team.service";
import {AboutService} from "./about.service";
import { Component, EventEmitter, Output, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Content, Header } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage implements OnInit, OnDestroy {

  @ViewChild(Content) content: Content;
  private socket;
  private onMessageReceived : any;
  private message : string;
  private messages_received : Array<string>;
  private isBadgeUpdatable : boolean;

  constructor(
    private aboutService : AboutService,
    private teamService: TeamService
  /*private keyboard: Keyboard*/) {
    this.message = "";
    this.messages_received = new Array<string>();
    this.isBadgeUpdatable = false;
  }

  //============================================================================
  // Lifecycle
  //============================================================================

  ngOnInit() {
      console.log("On ngOnInit");
      //this.keyboard.onClose(this.onKeyboardClosed);
      this.onMessageReceived = this.teamService.getGeneralMessages().subscribe((data : any) => {
        console.log("message reçu !", data.sender, data.message);
        this.messages_received.push(data.message);
        if (this.isBadgeUpdatable)
          this.aboutService.incrementMessageNotRead();
        this.content.scrollToBottom();
        console.log(this.messages_received);
    });
  }

  ngAfterViewInit() {
    let elements = <HTMLCollection>document.getElementsByClassName('toolbar-background');
    console.log(elements);
    for (let i=0; i<elements.length; i++) {
      (elements[i] as any).style.backgroundColor = "#00E74D";
    }
  }


  ngOnDestroy() {
    this.onMessageReceived.unsubscribe();
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
        this.teamService.sendGeneralMessage(this.message);
        this.message = "";
      }
    }

    onKeyboardClosed(): void {

    }





}
