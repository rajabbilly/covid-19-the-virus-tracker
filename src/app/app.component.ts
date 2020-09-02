import { Component, OnInit } from '@angular/core';
import { MapChart } from 'angular-highcharts';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { TheVirusTracker } from '../shared/thevirustracker.model'

var Highcharts = require('highcharts/highmaps'),
  map = require('@highcharts/map-collection/custom/world.geo.json');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  arrayOfHttp = [];
  chartData = [];
  globalData = [];
  isLoading: boolean = false;

  constructor(private http: HttpClient, public mapChart: MapChart) { }

  ngOnInit() {
    map.features.forEach(element => {
      this.arrayOfHttp.push(
        this.http.get<TheVirusTracker>(
          `https://thevirustracker.com/free-api?countryTotal=${element.id}`
        )
          .pipe(catchError(error => of(error)))
      );
    });

    forkJoin(this.arrayOfHttp).subscribe(results => {
      results.forEach(data => {
        if (data["countrydata"]) {
          this.chartData.push({
            code3: map.features.filter(
              x => x.id == data["countrydata"][0].info.code
            )[0].properties["iso-a3"],
            name: data["countrydata"][0].info.title,
            value: data["countrydata"][0].total_cases,
            total_cases: data["countrydata"][0].total_cases,
            total_active_cases: data["countrydata"][0].total_active_cases,
            total_deaths: data["countrydata"][0].total_deaths,
            total_recovered: data["countrydata"][0].total_recovered,
            total_new_cases_today: data["countrydata"][0].total_new_cases_today,
            total_new_deaths_today: data["countrydata"][0].total_new_deaths_today
          });
        }
      });
      this.prepapareChat();
    });

    this.http
      .get<TheVirusTracker>("https://thevirustracker.com/free-api?global=stats")
      .subscribe(data => {
        this.globalData.push({
          total_active_cases: data["results"][0].total_active_cases,
          total_cases: data["results"][0].total_cases,
          total_deaths: data["results"][0].total_deaths,
          total_new_cases_today: data["results"][0].total_new_cases_today,
          total_new_deaths_today: data["results"][0].total_new_deaths_today
        });
      });
  }

  prepapareChat() {
    this.mapChart = new MapChart({
      chart: {
        borderWidth: 0,
        height: (9 / 16) * 100 - 15 + "%",
        map: map,
        backgroundColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, "#4a0000"],
            [1, "#000000"]
          ]
        }
      },

      title: {
        text: "COVID - 19",
        style: {
          color: "white",
          fontWeight: "bold",
          fontSize: "2em",
          opacity: 0.8
        }
      },

      subtitle: {
        text: "Hover on a country or territory to see casses, deaths and recoveries.",
        style: {
          color: "white",
          fontSize: "1em",
          opacity: 0.8
        }
      },

      mapNavigation: {
        enabled: true,
        buttonOptions: {
          verticalAlign: "top"
        }
      },

      colorAxis: {
        dataClasses: [
          {
            from: 0,
            to: 0,
            color: "#FBEFEF"
          }, {
            from: 1,
            to: 100,
            color: "#FA5858"
          }, {
            from: 101,
            to: 1000,
            color: "#500000"
          }, {
            from: 1001,
            to: 10000,
            color: "#880000"
          }, {
            from: 10001,
            to: 20000,
            color: "#b10000"
          }, {
            from: 20001,
            to: 50000,
            color: "#FE2E2E"
          }, {
            from: 50001,
            color: "#ff0000"
          }
        ]
      },

      series: [
        {
          type: undefined,
          name: "Covid",
          animation: {
            duration: 2000
          },
          borderColor: "#FFDF00",
          joinBy: ["iso-a3", "code3"],
          data: this.chartData,
          dataLabels: {
            enabled: false,
            format: "{point.name}"
          },
          minSize: 4,
          maxSize: "40%",
          tooltip: {
            headerFormat: "{point.name}",
            pointFormat: `<b>{point.name}</b> <br /> <br /> Total Cases : {point.total_cases}
                  <br /> Total Active Cases : {point.total_active_cases}
                  <br /> Total Deaths : {point.total_deaths}
                  <br /> Total Recovered : {point.total_recovered}
                  <br /> New Cases Today : <b>+ {point.total_new_cases_today}
      
                  `
          }
        }
      ]
    });
  }
}


