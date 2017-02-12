import {SocketIoService} from "../sign-up/socket-io.service";
import {RiddlePictureService} from "./riddlePicture.service";
import {RiddleService} from "../home/riddle.service";
import {Component, OnInit, OnDestroy} from "@angular/core";
import {Camera} from "ionic-native";
import { AlertController } from 'ionic-angular';

@Component({
    selector: 'riddlePicture',
    templateUrl: 'riddlePicture.html'
})
export class RiddlePicture implements OnInit, OnDestroy {

    question: string;
    points: number;
    riddle : Object;

    constructor(private generalMessageService: RiddlePictureService,
        private socketIoService: SocketIoService,
        private riddleService: RiddleService,
        public alertCtrl: AlertController) {
        this.riddleService.newRiddlePicture.subscribe(data => {
          this.riddle=data;
            this.question = data.question;
            this.points = Number(data.points);
        });

    }

    //============================================================================
    // Lifecycle
    //============================================================================

    ngOnInit() {
    }

    ngAfterViewInit() {
      this.socketIoService.getValidation().subscribe((data: any) => {
          if(data.validator){
            let alert = this.alertCtrl.create({
                title: 'Bravo!',
                subTitle: 'Le master a validé votre photo',
                buttons: ['OK']
            });
            alert.present();
          }
          else{
            let alert = this.alertCtrl.create({
                title: 'Désolé!',
                subTitle: 'Le master a refusé votre photo',
                buttons: ['OK']
            });
            alert.present();
          }
      });
    }


    ngOnDestroy() {
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
                let imageToSend = { file: base64Image, riddle : this.riddle };
                this.socketIoService.socket.emit("image", imageToSend);
                let alert = this.alertCtrl.create({
                    title: 'Photo envoyée!',
                    subTitle: 'Veuillez attendre la réponse du master',
                    buttons: ['OK']
                });
                alert.present();
            },
            (err) => {
                console.log("error taking picture", err);
            });
    }



}
