import { Component, OnInit } from '@angular/core';
import { Book } from './models/book.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'my-work';
  searchFromheader?: string;
  isSplashCompleted: boolean = true;

  onGetInput(event: string) {
    this.searchFromheader = event;
    console.log(this.searchFromheader)
  }

  ngOnInit() {
    setTimeout(() => {
      this.isSplashCompleted = true;
    }, 4000);
  }
}
