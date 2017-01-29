import {ContactService} from "../contact/contact.service";
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

  messageNotReadGeneralMessage : number;
  messageNotReadPrivateMessage : number;
  subscriptionGeneralMessage : Subscription;
  subscriptionPrivateMessage : Subscription;

  constructor(
    private aboutService: AboutService,
    private contactService : ContactService) {
  }

  //============================================================================
  // Lifecycle
  //============================================================================

  ngOnInit() {
    this.subscriptionGeneralMessage = this.aboutService.messageUpdate.subscribe(item => {
      this.messageNotReadGeneralMessage = item;
    });

    this.subscriptionPrivateMessage = this.contactService.messageUpdate.subscribe(item => {
      this.messageNotReadPrivateMessage = item;
    })
  }

  ngOnDestroy() {
    this.subscriptionGeneralMessage.unsubscribe();
    this.subscriptionPrivateMessage.unsubscribe();
  }

  //============================================================================
  // Utils
  //============================================================================

  clearGeneralMessageNotRead() : void {
    this.aboutService.clearMessageNotRead();
  }

  clearPrivateMessageNotRead(): void {
    this.contactService.clearMessageNotRead();
  }
}
