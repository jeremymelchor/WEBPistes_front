import {LocationTrackerService} from "../pages/home/locationTracker.service";
import {PrivateMessageService} from "../pages/private-message/private-message.service";
import {SocketIoService} from "../pages/sign-up/socket-io.service";
import {SignUp} from "../pages/sign-up/sign-up";
import {GeneralMessageService} from "../pages/general-message/general-message.service";
import {NgModule, ErrorHandler} from "@angular/core";
import {IonicApp, IonicModule, IonicErrorHandler} from "ionic-angular";
import {MyApp} from "./app.component";
import {GeneralMessage} from "../pages/general-message/general-message";
import {PrivateMessage} from "../pages/private-message/private-message";
import {HomePage} from "../pages/home/home";
import {Tabs} from "../pages/tabs/tabs";

@NgModule({
    declarations: [
        MyApp,
        GeneralMessage,
        PrivateMessage,
        HomePage,
        Tabs,
        SignUp
    ],
    imports: [
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        GeneralMessage,
        PrivateMessage,
        HomePage,
        Tabs,
        SignUp
    ],
    providers: [
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        GeneralMessageService,
        SocketIoService,
        PrivateMessageService,
        LocationTrackerService
    ]
})
export class AppModule {
}
