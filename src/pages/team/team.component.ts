import {TabsPage} from "../tabs/tabs";
import {TeamService} from "./team.service";
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpModule, Headers, RequestOptions } from "@angular/http";
import { NavController } from 'ionic-angular';

@Component({
  selector: 'team',
  templateUrl: 'team.html'
})
export class Team {

  private listColors : Array<any>;
  private teamName : string;
  private colorObserver: Observable<any>;

  constructor(
    private nav: NavController,
    private teamService : TeamService) {
    this.listColors = [
      {name: "blue", value: "#6C96FF"},
      {name: "red", value: "#FD7567"},
      {name: "green", value: "#6ddb5c"},
      {name: "yellow", value: "#FDF569"},
      {name: "orange", value: "#FF9900"},
      {name: "pink", value: "#E661AC"},
      {name: "lightblue", value: "#6CE8E8"},
      {name: "purple", value: "#8E67FD"}
    ]
  }

  //============================================================================
  // Lifecycle
  //============================================================================

  //============================================================================
  // Utils
  //============================================================================

  getTeamColor() {

  }

  signUp() : void {
    if (this.teamService.socket == undefined) {
      console.log("socket undefined");
      this.teamService.getTeamColor().subscribe(
        res => {
          console.log("success",res)
          if (res == 'KO') this.teamService.closeSocket();
          else this.nav.setRoot(TabsPage);
        },
        error => console.log("error",error)
      );
      this.teamService.signUp(this.teamName);
    }

  }
}
