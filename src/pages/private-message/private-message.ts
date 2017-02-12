import {SocketIoService} from "../sign-up/socket-io.service";
import {PrivateMessageService} from "./private-message.service";
import {Component} from "@angular/core";

@Component({
    selector: 'private-message',
    templateUrl: 'private-message.html'
})
export class PrivateMessage {

    private onPrivateMessage: any;
    private message: string;
    private messages_received: Array<string>;
    private isBadgeUpdatable: boolean;

    constructor(public privateMessageService: PrivateMessageService,
                private socketIoService: SocketIoService) {
        this.message = "";
        this.messages_received = [];
        this.isBadgeUpdatable = false;
    }

    //============================================================================
    // Lifecycle
    //============================================================================

    ngOnInit() {
        this.onPrivateMessage = this.socketIoService.getPrivateMessages().subscribe((data: any) => {
            console.log("message reçu !", data.sender, data.message);
            this.messages_received.push(data);
            if (this.isBadgeUpdatable)
                this.privateMessageService.incrementMessageNotRead();
        });
    }

    ngAfterViewInit() {
        this.socketIoService.setTeamColorTheme();
    }

    ngOnDestroy() {
        this.onPrivateMessage.unsubscribe();
    }

    ionViewWillEnter() {
        this.isBadgeUpdatable = false;
    }

    ionViewWillLeave() {
        this.isBadgeUpdatable = true;
    }

    //==========================================================================
    // Utils
    //==========================================================================

    sendMessage(): void {
        if (this.message != "") {
            console.log("on emit le message", this.message);
            this.socketIoService.sendPrivateMessage(this.message);
            this.message = "";
        }
    }

}
