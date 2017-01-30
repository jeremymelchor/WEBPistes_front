import {TeamService} from "../team/team.service";
import {Injectable, NgZone, Inject} from '@angular/core';
import {Geolocation, Geoposition, BackgroundGeolocation} from 'ionic-native';
import { Observable } from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Geofence } from 'ionic-native';
import 'rxjs/add/operator/filter';
import * as io from 'socket.io-client';

export class LocationTrackerService {

  public watch: any;
  public lat: number;
  public lng: number;
  positionUpdateSource = new BehaviorSubject<any>(0);
  positionUpdate : Observable<any>;
  public fencesArray: Array<Geofence>

  constructor(@Inject(NgZone) private zone:NgZone,
  @Inject(TeamService) private teamService : TeamService) {
    this.positionUpdate = this.positionUpdateSource.asObservable();
    this.fencesArray = new Array<Geofence>();
  }

  startTracking(): void {
    console.log("start tracking");

    let config = {
      desiredAccuracy: 10,
      stationaryRadius: 10,
      distanceFilter: 10,
      interval:1000,
      stopOnTerminate: true
    };

    BackgroundGeolocation.configure((location) => {
      console.log('[js] BackgroundGeolocation callback:  ' + location.latitude + ',' + location.longitude);

      let position = {lat: location.latitude, lng: location.longitude};
      this.teamService.socket.emit("coords", position);

      this.zone.run(() => {

      });

    }, (error) => {
      console.log('BackgroundGeolocation error');
    }, config);

    // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
    BackgroundGeolocation.start();

    // Foreground tracking

    this.watch = Geolocation.watchPosition().filter((p: any) => p.code === undefined).subscribe(res => {
      console.log(res);

      let position = {lat: res.coords.latitude, lng: res.coords.longitude};
      this.positionUpdateSource.next(position);
      this.teamService.socket.emit("coords", position);

      this.zone.run(() => {

      });
    });
  }


  stopTracking() {
    console.log('stopTracking');
    BackgroundGeolocation.finish();
    this.watch.unsubscribe();
  }

  buildGeofences(zones: Array<any>) : void {
    for (let zone of zones) {
      let fence = {
        id: zone.id,
        latitude: zone.lat,
        longitude: zone.lng,
        radius: zone.radius,
        transitionType: 1, //Enter
        notification: {
          id: zone.id,
          title: "Vous rentrez dans une zone à énigme !",
          text: "Dépechez-vous d'y répondre",
          openAppOnClick: true
        }
      }
      this.fencesArray.push(fence);
    }
  }

}
