import {LocationTrackerService} from "../pages/home/locationTracker.service";
import {PrivateMessageService} from "../pages/private-message/private-message.service";
import {SocketIoService} from "../pages/sign-up/socket-io.service";
import {SignUp} from "../pages/sign-up/sign-up";
import {GeneralMessageService} from "../pages/general-message/general-message.service";
import {RiddlePictureService} from "../pages/riddlePicture/riddlePicture.service";
import {RiddleQuizService} from "../pages/riddleQuiz/riddleQuiz.service";
import {RiddleService} from "../pages/home/riddle.service";
import {NgModule, ErrorHandler} from "@angular/core";
import {IonicApp, IonicModule, IonicErrorHandler} from "ionic-angular";
import {MyApp} from "./app.component";
import {GeneralMessage} from "../pages/general-message/general-message";
import {PrivateMessage} from "../pages/private-message/private-message";
import {HomePage} from "../pages/home/home";
import {RiddlePicture} from "../pages/riddlePicture/riddlePicture";
import {RiddleQuiz} from "../pages/riddleQuiz/riddleQuiz";
import {TabsPage} from "../pages/tabs/tabs";

@NgModule({
    declarations: [
        MyApp,
        GeneralMessage,
        PrivateMessage,
        HomePage,
        SignUp,
        RiddleQuiz,
        RiddlePicture,
        TabsPage,
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
        SignUp,
        RiddleQuiz,
        RiddlePicture,
        TabsPage,
        SignUp
    ],
    providers: [
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        GeneralMessageService,
        SocketIoService,
        PrivateMessageService,
        LocationTrackerService,
        RiddleQuizService,
        RiddlePictureService,
        RiddleService
    ]
})
export class AppModule {
}
