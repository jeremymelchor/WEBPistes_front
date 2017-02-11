import {LocationTrackerService} from "../home/locationTracker.service";
import {Tabs} from "../tabs/tabs";
import {SocketIoService} from "./socket-io.service";
import {Component} from "@angular/core";
import {NavController, ToastController} from "ionic-angular";

@Component({
    selector: 'team',
    templateUrl: 'sign-up.html'
})
export class SignUp {

    private listColors: Array<any>;
    private teamName: string;
    private teamColor: string;

    constructor(private nav: NavController,
        private socketIoService: SocketIoService,
        private locationTrackerService: LocationTrackerService,
        private toastCtrl: ToastController) {
        this.teamName = "";
        this.listColors = [
            { name: "bleu", value: "#6C96FF" },
            { name: "rouge", value: "#FD7567" },
            { name: "vert", value: "#6ddb5c" },
            { name: "jaune", value: "#FDF569" },
            { name: "orange", value: "#FF9900" },
            { name: "rose", value: "#E661AC" },
            { name: "cyan", value: "#6CE8E8" },
            { name: "violet", value: "#8E67FD" }
        ]
    }

    //============================================================================
    // Lifecycle
    //============================================================================

    //============================================================================
    // Utils
    //============================================================================

    signUp(): void {
        if (this.teamName.length === 0) this.noTeamNameToast();
        else if (this.teamColor == undefined) this.noTeamColorToast();
        else if (this.socketIoService.socket == undefined) {
            console.log("socket undefined");
            this.socketIoService.getFences().subscribe(
                res => {
                    console.log("success", res)
                    if (res == 'KO') this.socketIoService.closeSocket();
                    else {
                        this.locationTrackerService.buildGeofences(res);
                        this.nav.setRoot(Tabs);
                    }
                },
                error => console.log("error", error)
            );
            this.socketIoService.signUp(this.teamName, this.teamColor);
        }

    }

    private noTeamColorToast(): void {
        let toast = this.toastCtrl.create({
            message: 'Veuillez choisir une couleur pour votre équipe',
            duration: 3000
        });
        toast.present();
    }

    private noTeamNameToast(): void {
        let toast = this.toastCtrl.create({
            message: 'Veuillez choisir un nom pour votre équipe',
            duration: 3000
        });
        toast.present();
    }
}
