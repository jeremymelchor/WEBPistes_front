import {SocketIoService} from "../sign-up/socket-io.service";
import {GeneralMessageService} from "./general-message.service";
import {Component, OnInit, OnDestroy, ViewChild} from "@angular/core";
import {Content} from "ionic-angular";

@Component({
    selector: 'general-message',
    templateUrl: 'general-message.html'
})
export class GeneralMessage implements OnInit, OnDestroy {

    @ViewChild(Content) content: Content;
    private onMessageReceived: any;
    private message: string;
    private messages_received: Array<string>;
    private isBadgeUpdatable: boolean;

    constructor(private generalMessageService: GeneralMessageService,
                private socketIoService: SocketIoService) {
        this.message = "";
        this.messages_received = [];
        this.isBadgeUpdatable = false;
    }

    //============================================================================
    // Lifecycle
    //============================================================================

    ngOnInit() {
        console.log("On ngOnInit");
        this.onMessageReceived = this.socketIoService.getGeneralMessages().subscribe((data: any) => {
            console.log("message reçu !", data.sender, data.message);
            this.messages_received.push(data.message);
            if (this.isBadgeUpdatable)
                this.generalMessageService.incrementMessageNotRead();
            this.content.scrollToBottom();
            console.log(this.messages_received);
        });
    }

    ngAfterViewInit() {
        this.socketIoService.setTeamColorTheme();
    }


    ngOnDestroy() {
        this.onMessageReceived.unsubscribe();
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
            this.socketIoService.sendGeneralMessage(this.message);
            this.message = "";
        }
    }


}
