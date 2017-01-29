import {AboutService} from "../about/about.service";
import { Component } from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = AboutPage;
  tab3Root: any = ContactPage;

  messageNotRead : number;
  subscription : Subscription;

  constructor(private aboutService: AboutService) {
    //this.messageNotRead = 0;
  }

  //============================================================================
  // Lifecycle
  //============================================================================

  ngOnInit() {
    this.subscription = this.aboutService.messageUpdate.subscribe(item => {
      this.messageNotRead = item;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  //============================================================================
  // Utils
  //============================================================================

  clearMessageNotRead() : void {
    this.aboutService.clearMessageNotRead();
  }
}
