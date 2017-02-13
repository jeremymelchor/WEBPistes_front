import {SocketIoService} from "../sign-up/socket-io.service";
import {RiddleService} from "../home/riddle.service";
import {Component, OnInit, OnDestroy} from "@angular/core";
import { AlertController } from 'ionic-angular';

@Component({
    selector: 'riddleQuiz',
    templateUrl: 'riddleQuiz.html'
})
export class RiddleQuiz implements OnInit, OnDestroy {

    question: string;
    answer: string;
    answers: Array<string>;
    riddle: Object;



    constructor(
        private socketIoService: SocketIoService,
        private riddleService: RiddleService,
        public alertCtrl: AlertController) {
        this.riddleService.newRiddleQuiz.subscribe(data => {
            this.riddle = data;
            this.question = data.question;
            this.answer = data.answer;
            this.answers = data.answers;
        });

    }

    //============================================================================
    // Lifecycle
    //============================================================================

    ngOnInit() {

    }

    ngAfterViewInit() {

    }


    ngOnDestroy() {
    }

    checkAnswer(userAnswer: string) {
        if (userAnswer != this.answer) {
            this.riddle["points"] = Number(this.riddle["points"]) - 20;
            let alert = this.alertCtrl.create({
                title: 'Mauvaise réponse!',
                subTitle: 'Essayez encore',
                buttons: ['OK']
            });
            alert.present();
        }
        else {
            let alert = this.alertCtrl.create({
                title: 'Bonne réponse!',
                subTitle: 'Bravo',
                buttons: ['OK']
            });
            alert.present();
            this.riddle["points"] = Number(this.riddle["points"]);
            this.socketIoService.sendRiddleSolved(this.riddle);
            this.riddleService.addCurrentPoints(this.riddle["points"]);
            this.riddleService.sendResetRiddle();
        }
    }




}
