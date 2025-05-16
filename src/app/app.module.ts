import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HeaderComponent } from './components/header/header.component';
import { BookComponent } from './components/book/book.component';
import { SplashscreenComponent } from './components/splashscreen/splashscreen.component';
import { LoaderComponent } from './components/loader/loader.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpService } from './services/http.service';
import { BookService } from './services/book.service';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BookComponent,
    SplashscreenComponent,
    LoaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxDocViewerModule,
    ReactiveFormsModule,
  ],
  exports: [
    FormsModule,
    NgxDocViewerModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [BookService, HttpService, HttpClient ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
