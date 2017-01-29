import {Injectable, NgZone, Inject} from '@angular/core';
import {Geolocation, Geoposition, BackgroundGeolocation} from 'ionic-native';
import 'rxjs/add/operator/filter';
import * as io from 'socket.io-client';

export class LocationTrackerService {

  public watch: any;
  public lat: number = 0;
  public lng: number = 0;
  private url : string = "https://web-piste.herokuapp.com";
  private socket;

  constructor(@Inject(NgZone) private zone:NgZone) {
    this.socket = io(this.url);
  }

  startTracking() {
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
        this.sendDataToServer(location.latitude, location.longitude);
      });

    }, (error) => {
      console.log('BackgroundGeolocation error');
    }, config);

    // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
    BackgroundGeolocation.start().then(res => console.log(res));

    // Foreground tracking

    this.watch = Geolocation.watchPosition().filter((p: any) => p.code === undefined).subscribe(res => {
      console.log(res);

      this.zone.run(() => {
        console.log("emit data");
        this.sendDataToServer(res.coords.latitude, res.coords.longitude);
      });
    });
  }


  stopTracking() {
    console.log('stopTracking');
    BackgroundGeolocation.finish();
    this.watch.unsubscribe();
  }

  sendDataToServer(latitude : number, longitude : number) {
    let data = {lat: latitude, lng: longitude};
    this.socket.emit(this.url, data);
  }

}
