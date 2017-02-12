import {SocketIoService} from "../sign-up/socket-io.service";
import {PrivateMessageService} from "../private-message/private-message.service";
import {GeneralMessageService} from "../general-message/general-message.service";
import {Component, ViewChild} from "@angular/core";
import {Subscription} from "rxjs/Subscription";
import {HomePage} from "../home/home";
import {GeneralMessage} from "../general-message/general-message";
import {PrivateMessage} from "../private-message/private-message";

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {

    // this tells the tabs component which Pages
    // should be each tab's root Page
    tab1Root: any = HomePage;
    tab2Root: any = GeneralMessage;
    tab3Root: any = PrivateMessage;

    messageNotReadGeneralMessage: number;
    messageNotReadPrivateMessage: number;
    subscriptionGeneralMessage: Subscription;
    subscriptionPrivateMessage: Subscription;

    constructor(
        private generalMessageService: GeneralMessageService,
        private privateMessageService: PrivateMessageService,
        private socketIoService: SocketIoService) {
    }

    //============================================================================
    // Lifecycle
    //============================================================================

    ngOnInit() {
        this.subscriptionGeneralMessage = this.generalMessageService.messageUpdate.subscribe(item => {
            this.messageNotReadGeneralMessage = item;
        });

        this.subscriptionPrivateMessage = this.privateMessageService.messageUpdate.subscribe(item => {
            this.messageNotReadPrivateMessage = item;
        })
    }

    ngAfterViewInit() {
        let elements = document.getElementsByClassName('tabbar');
        console.log("tabs : ", elements);
        for (let i = 0; i < elements.length; i++) {
            (elements[i] as any).style.backgroundColor = this.socketIoService.teamColor;
        }
    }

    ngOnDestroy() {
        this.subscriptionGeneralMessage.unsubscribe();
        this.subscriptionPrivateMessage.unsubscribe();
    }

    //============================================================================
    // Utils
    //============================================================================

    clearGeneralMessageNotRead(): void {
        this.generalMessageService.clearMessageNotRead();
    }

    clearPrivateMessageNotRead(): void {
        this.privateMessageService.clearMessageNotRead();
    }
}
