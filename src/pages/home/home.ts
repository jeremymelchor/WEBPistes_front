import { Observable } from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {LocationTrackerService} from "./locationTracker.service";
import {Component} from "@angular/core";
import { Platform } from 'ionic-angular';
import {
 GoogleMap,
 GoogleMapsEvent,
 GoogleMapsLatLng,
 CameraPosition,
 GoogleMapsMarkerOptions,
 GoogleMapsMarker,
 Geolocation
} from 'ionic-native';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private subscriptionPosition : Subscription;
  private lat: number;
  private lng: number;
  private map: GoogleMap;

  constructor(
    private locationService : LocationTrackerService,
    private plt: Platform) {
      //this.plt.ready().then(() => this.locationService.startTracking());
    }


  //============================================================================
  // life-cycle
  //============================================================================

  ngAfterViewInit() {
    let elements = <HTMLCollection>document.getElementsByClassName('toolbar-background');
    console.log(elements);
    for (let i=0; i<elements.length; i++) {
      (elements[i] as any).style.backgroundColor = "#00E74D";
    }
    //this.loadMap();
    /*this.subscriptionPosition = this.locationService.positionUpdate.subscribe(position => {
      this.lat = position.lat;
      this.lng = position.lng;
      this.updateMap();
    });*/
  }

  //============================================================================
  // Utils
  //============================================================================

  stopTracking() : void {
    this.locationService.stopTracking();
  }

  loadMap() : void {
    // create a new map by passing HTMLElement
    let element: HTMLElement = document.getElementById('map');
    this.map = new GoogleMap(element);

    // listen to MAP_READY event
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {

      Geolocation.getCurrentPosition().then((resp) => {
        let currentPosition = new GoogleMapsLatLng(resp.coords.latitude, resp.coords.longitude);

        // create CameraPosition
        let position: CameraPosition = {
          target: currentPosition,
          zoom: 18,
          tilt: 30
        };

        // move the map's camera to position
        this.map.moveCamera(position);

        // create new marker
        let markerOptions: GoogleMapsMarkerOptions = {
          position: currentPosition,
        };

        this.map.addMarker(markerOptions);
    });

    });
  }

  updateMap(): void {
    this.map.clear();
    let currentPosition = new GoogleMapsLatLng(this.lat, this.lng);

    let position: CameraPosition = {
      target: currentPosition,
      zoom: 18,
      tilt: 30
    };

    this.map.moveCamera(position);

    let markerOptions: GoogleMapsMarkerOptions = {
      position: currentPosition,
    };
    this.map.addMarker(markerOptions);
  }
}
