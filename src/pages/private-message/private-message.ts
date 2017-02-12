import {SocketIoService} from "../sign-up/socket-io.service";
import {PrivateMessageService} from "./private-message.service";
import {Component, ViewChild} from "@angular/core";
import {Content} from "ionic-angular";


@Component({
    selector: 'private-message',
    templateUrl: 'private-message.html'
})
export class PrivateMessage {

    @ViewChild(Content) content: Content;
    private onPrivateMessage: any;
    private message: string;
    private messages_received: Array<any>;
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
            console.log(data);
            let iAmTheSender: boolean;
            if (data.sender == this.socketIoService.teamName) iAmTheSender = true;
            else iAmTheSender = false;
            let message = { sender: data.sender, message: data.message, iAmTheSender: iAmTheSender };
            this.messages_received.push(message);
            if (this.isBadgeUpdatable) this.privateMessageService.incrementMessageNotRead();
            this.content.scrollToBottom();
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
