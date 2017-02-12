import {SocketIoService} from "../sign-up/socket-io.service";
import {Subscription} from "rxjs/Subscription";
import {LocationTrackerService} from "./locationTracker.service";
import {RiddleService} from "./riddle.service";
import {Component} from "@angular/core";
import {Platform} from "ionic-angular";
import {
    GoogleMap,
    GoogleMapsEvent,
    GoogleMapsLatLng,
    CameraPosition,
    GoogleMapsMarkerOptions,
    GoogleMapsMarker,
    Geolocation,
    Geofence
} from "ionic-native";

@Component({
    selector: 'home',
    templateUrl: 'home.html'
})
export class HomePage {

    private subscriptionPosition: Subscription;
    private lat: number;
    private lng: number;
    private map: GoogleMap;
    private myPositionMarker: GoogleMapsMarker;
    isQuiz: boolean = false;
    isPicture: boolean = false;

    constructor(private locationService: LocationTrackerService,
        private platform: Platform,
        private socketIoService: SocketIoService,
      private riddleService: RiddleService) {
    }


    //============================================================================
    // life-cycle
    //============================================================================

    ngOnInit() {
        this.platform.ready().then(() => {
            console.log("platform initialized");
            Geofence.initialize().then(
                () => {
                    console.log("geofence initialized");
                    for (let fence of this.locationService.fencesArray) {
                        Geofence.addOrUpdate(fence);
                    }
                },
                (err) => console.log(err)
            );
            Geofence.onTransitionReceived().subscribe(res => {
                console.log("onZoneEntered !", res);
                this.socketIoService.onFenceEntered(res[0].id);
            });
            this.locationService.startTracking();
        });
    }

    ngAfterViewInit() {
        this.socketIoService.setTeamColorTheme();
        this.loadMap();
        this.subscriptionPosition = this.locationService.positionUpdate.subscribe(position => {
            this.lat = position.lat;
            this.lng = position.lng;
            this.updateMap();
        });
        this.socketIoService.getNewRiddle().subscribe((data: any) => {
          this.isQuiz=false;
          this.isPicture=false;
            if(data.type=="qcm"){
              this.isQuiz = true;

              this.riddleService.sendNewRiddleQuiz(data);
            }
            else{
              this.isPicture = true;
              this.riddleService.sendNewRiddlePicture(data);
            }
        });
        this.riddleService.resetRiddle.subscribe(data => {
          this.isQuiz = false;
          this.isPicture = false;
        });
    }

    //============================================================================
    // Utils
    //============================================================================

    stopTracking(): void {
        this.locationService.stopTracking();
    }

    loadMap(): void {
        // create a new map by passing HTMLElement
        let element: HTMLElement = document.getElementById('map');
        this.map = new GoogleMap(element);

        // listen to MAP_READY event
        this.map.one(GoogleMapsEvent.MAP_READY).then(() => {

            //Draw fences on map
            for (let fence of this.locationService.fencesArray) {
                let circle = {
                    center: new GoogleMapsLatLng(fence.latitude, fence.longitude),
                    radius: fence.radius,
                    strokeColor: '#FF0000',
                    strokeWidth: 5,
                    fillColor: '#FF0000'
                }
                this.map.addCircle(circle);
            }

        });

        Geolocation.getCurrentPosition().then((resp) => {
            let currentPosition = new GoogleMapsLatLng(resp.coords.latitude, resp.coords.longitude);

            let pos = { lat: resp.coords.latitude, lng: resp.coords.longitude };
            this.socketIoService.socket.emit("coords", pos);

            // create CameraPosition
            let position: CameraPosition = {
                target: currentPosition,
                zoom: 18
            };

            // move the map's camera to position
            this.map.moveCamera(position);

            // create new marker
            let markerOptions: GoogleMapsMarkerOptions = {
                position: currentPosition,
            };

            this.map.addMarker(markerOptions).then(marker => {
                this.myPositionMarker = marker;
            });
        });

    }

    updateMap(): void {
        let currentPosition = new GoogleMapsLatLng(this.lat, this.lng);
        if (this.myPositionMarker != undefined) this.myPositionMarker.setPosition(currentPosition);
    }

    fakePictureZone() {
        this.socketIoService.onFenceEntered("1");
    }
    fakeQuizZone() {
        this.socketIoService.onFenceEntered("2");
    }



    onTransition
}
