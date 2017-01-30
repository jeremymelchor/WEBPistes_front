import {Injectable, NgZone, Inject} from '@angular/core';
import {Geolocation, Geoposition, BackgroundGeolocation} from 'ionic-native';
import { Observable } from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/filter';
import * as io from 'socket.io-client';

export class LocationTrackerService {

  public watch: any;
  public lat: number;
  public lng: number;
  private url : string = "https://web-piste.herokuapp.com";
  private socket;
  positionUpdateSource = new BehaviorSubject<any>(0);
  positionUpdate : Observable<any>;

  constructor(@Inject(NgZone) private zone:NgZone) {
    this.socket = io(this.url);
    this.positionUpdate = this.positionUpdateSource.asObservable();
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

      this.zone.run(() => {
        let position = {lat: location.latitude, lng: location.longitude};
        this.socket.emit(this.url, position);
      });

    }, (error) => {
      console.log('BackgroundGeolocation error');
    }, config);

    // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
    BackgroundGeolocation.start();

    // Foreground tracking

    this.watch = Geolocation.watchPosition().filter((p: any) => p.code === undefined).subscribe(res => {
      console.log(res);

      this.zone.run(() => {
        let position = {lat: res.coords.latitude, lng: res.coords.longitude};
        this.positionUpdateSource.next(position);
        this.socket.emit(this.url, position);
      });
    });
  }


  stopTracking() {
    console.log('stopTracking');
    BackgroundGeolocation.finish();
    this.watch.unsubscribe();
  }

}
