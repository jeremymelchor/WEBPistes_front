import {SocketIoService} from "../sign-up/socket-io.service";
import {Subscription} from "rxjs/Subscription";
import {LocationTrackerService} from "./locationTracker.service";
import {Component} from "@angular/core";
import {Platform, NavController} from "ionic-angular";
import {
    GoogleMap,
    GoogleMapsEvent,
    GoogleMapsLatLng,
    CameraPosition,
    GoogleMapsMarkerOptions,
    GoogleMapsMarker,
    Geolocation,
    Camera,
    Geofence
} from "ionic-native";

@Component({
    selector: 'home',
    templateUrl: 'home.html'
})
export class HomePage {

    private subscriptionPosition: Subscription;
    private subscriptionTest: Subscription;
    private lat: number;
    private lng: number;
    private map: GoogleMap;
    private myPositionMarker: GoogleMapsMarker;

    constructor(private navCtrl: NavController,
        private locationService: LocationTrackerService,
        private platform: Platform,
        private socketIoService: SocketIoService) {
    }


    //============================================================================
    // life-cycle
    //============================================================================

    ngOnInit() {
        //initialize other component manually
        this.navCtrl.parent.select(1);
        this.navCtrl.parent.select(2);
        this.navCtrl.parent.select(0);

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
        this.subscriptionTest = this.socketIoService.getNewRiddle().subscribe((data: any) => {
            console.log("message reçu zbreh !", data);
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

    fakeToGarbejaire() {
        this.socketIoService.onFenceEntered("2");

    }


    takePicture() {

        let options = {
            destinationType: 0,
            correctOrientation: true,
            targetWidth: 1280,
            targetHeight: 720
        };

        Camera.getPicture(options).then(
            (imageData) => {
                let base64Image = 'data:image/jpeg;base64,' + imageData;
                let imageToSend = { file: base64Image };
                this.socketIoService.socket.emit("image", imageToSend);
            },
            (err) => {
                console.log("error taking picture", err);
            });
    }

    onTransition
}
