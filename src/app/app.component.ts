import {SignUp} from "../pages/sign-up/sign-up";
import {Component} from "@angular/core";
import {Platform} from "ionic-angular";
import {StatusBar} from "ionic-native";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = SignUp;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      //Splashscreen.hide();
    });
  }


}
