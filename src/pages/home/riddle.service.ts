import {Injectable} from '@angular/core';
import {Observable, BehaviorSubject} from "rxjs";

@Injectable()
export class RiddleService {
    newRiddleQuizSource = new BehaviorSubject<any>(0);
    newRiddleQuiz: Observable<any>;

    newRiddlePictureSource = new BehaviorSubject<any>(0);
    newRiddlePicture: Observable<any>;

    resetRiddleSource = new BehaviorSubject<any>(0);
    resetRiddle: Observable<any>;


    constructor() {
        this.newRiddleQuiz = this.newRiddleQuizSource.asObservable();
        this.newRiddlePicture = this.newRiddlePictureSource.asObservable();
        this.resetRiddle = this.resetRiddleSource.asObservable();
    }

    sendNewRiddleQuiz(data: Object) {
        this.newRiddleQuizSource.next(data);
    }
    sendNewRiddlePicture(data: Object) {
        this.newRiddlePictureSource.next(data);
    }
    sendResetRiddle() {
        this.resetRiddleSource.next({});
    }

}
