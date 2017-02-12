import {Injectable} from '@angular/core';
import {Observable, BehaviorSubject} from "rxjs";

@Injectable()
export class RiddleService {
    newRiddleQuizSource = new BehaviorSubject<any>(0);
    newRiddleQuiz: Observable<any>;

    newRiddlePictureSource = new BehaviorSubject<any>(0);
    newRiddlePicture: Observable<any>;



    constructor() {
        this.newRiddleQuiz = this.newRiddleQuizSource.asObservable();
        this.newRiddlePicture = this.newRiddlePictureSource.asObservable();
    }



    sendNewRiddleQuiz(data: Object) {
        this.newRiddleQuizSource.next(data);
    }
    sendNewRiddlePicture(data: Object) {
        this.newRiddlePictureSource.next(data);
    }

}
