import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import highmaps from '../../node_modules/highcharts/modules/map.src';
import { MapChart } from 'angular-highcharts';

export function highchartsModules() {
  return [highmaps];
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartModule,
    HttpClientModule

  ],
  providers: [{ provide: HIGHCHARTS_MODULES, useFactory: highchartsModules }, MapChart],
  bootstrap: [AppComponent]
})
export class AppModule { }
