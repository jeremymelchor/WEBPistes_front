import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import * as io from "socket.io-client";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

@Injectable()
export class SocketIoService {

    public url = "https://web-piste.herokuapp.com/";
    public teamName: string;
    public teamColor: string;
    public socket;

    constructor() {
        console.log('constructeur');
        this.socket = undefined;
    }

    //=======================================================================
    // SignUp
    //=======================================================================

    getFences(): Observable<any> {
        let context = this;
        this.socket = io(this.url);
        let observable = new Observable(observer => {
            context.socket.on('init', (data) => {
                observer.next(data);
            });
            return () => {
                console.log("callback error inscription");
            };
        });
        console.log(this.socket);
        return observable;
    }

    closeSocket() {
        this.socket.disconnect();
        this.socket = undefined;
    }

    signUp(teamName: string, teamColor: string): void {
        this.teamColor = teamColor;
        let teamColorValue = teamColor.replace("#", "");
        let response = { pseudo: teamName, colorCode: teamColorValue };
        this.socket.emit("new_client", response);
    }

    setTeamColorTheme(): void {
        let elements = <HTMLCollection>document.getElementsByClassName('toolbar-background');
        for (let i = 0; i < elements.length; i++) {
            (elements[i] as HTMLElement).style.backgroundColor = this.teamColor;
        }
    }

    //=======================================================================
    // Home Page (maps)
    //=======================================================================

    onFenceEntered(fenceId: string) {
        this.socket.emit("zone_entered", Number(fenceId));
    }

    //=======================================================================
    // General messages
    //=======================================================================

    sendGeneralMessage(message) {
        this.socket.emit('general_message', message);
    }

    getGeneralMessages() {
        return new Observable(observer => {
            this.socket.on('general_message', (data) => {
                observer.next(data);
            });
            return () => {
                console.log("Erreur récéption message general_message");
                this.socket.disconnect();
            };
        });
    }

    //=======================================================================
    // Private messages
    //=======================================================================

    sendPrivateMessage(message) {
        this.socket.emit('client_to_masters_message', message);
    }

    getPrivateMessages() {
        return new Observable(observer => {
            this.socket.on('masters_to_client_message', (data) => {
                observer.next(data);
            });
            return () => {
                console.log("Erreur récéption message masters_to_client_message");
                this.socket.disconnect();
            };
        });
    }

    //=======================================================================
    // Riddle
    //=======================================================================

    getNewRiddle() {
        return new Observable(observer => {
            this.socket.on('zone_entered', (data) => {
                observer.next(data);
            });
            return () => {
                console.log("Erreur récéption message zone_entered");
                this.socket.disconnect();
            };
        });
    }

    getValidation() {
        return new Observable(observer => {
            this.socket.on('image', (data) => {
                observer.next(data);
            });
            return () => {
                console.log("Erreur récéption message image");
                this.socket.disconnect();
            };
        });
    }

    sendRiddleSolved(riddle) {
        this.socket.emit('riddle_solved', riddle);
    }
}
