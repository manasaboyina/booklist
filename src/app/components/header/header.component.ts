import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() searchInput = new EventEmitter<string>();

  isMobile: boolean = false;


  ngOnInit() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768; // Adjust breakpoint as needed
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  onChange(event: Event) {
    this.searchInput.emit((event.target as HTMLInputElement).value);
  }


  onSearchClear(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement.value.length) {
      this.searchInput.emit((event.target as HTMLInputElement).value);
    }
  }

}
