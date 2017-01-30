import {LocationTrackerService} from "../home/locationTracker.service";
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
  private teamColor: string;
  private colorObserver: Observable<any>;

  constructor(
    private nav: NavController,
    private teamService : TeamService,
    private locationTrackerService: LocationTrackerService) {
    this.listColors = [
      {name: "bleu", value: "#6C96FF"},
      {name: "rouge", value: "#FD7567"},
      {name: "vert", value: "#6ddb5c"},
      {name: "jaune", value: "#FDF569"},
      {name: "orange", value: "#FF9900"},
      {name: "rose", value: "#E661AC"},
      {name: "cyan", value: "#6CE8E8"},
      {name: "violet", value: "#8E67FD"}
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
          else {
            this.teamColor == undefined ?
              this.teamService.teamColor = "#f4f4f4" : this.teamService.teamColor = this.teamColor;
            this.locationTrackerService.buildGeofences(res);
            this.nav.setRoot(TabsPage);
          }
        },
        error => console.log("error",error)
      );
      this.teamService.signUp(this.teamName);
    }

  }
}
