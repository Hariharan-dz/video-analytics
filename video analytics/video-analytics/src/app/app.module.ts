import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CollectionComponent } from './collection/collection.component';
import { VideoComponent } from './video/video.component';


import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DataTableComponent } from './data-table/data-table.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';


@NgModule({
  declarations: [AppComponent,
    CollectionComponent,
    VideoComponent,
    DataTableComponent,
  ],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    MatProgressSpinnerModule,
    MatSortModule,
    HttpClientModule,
    MatPaginatorModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    MatIconModule,
    FormsModule,
    MatTableModule],
  providers: [DatePipe, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }
