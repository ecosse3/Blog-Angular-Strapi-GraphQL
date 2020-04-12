import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { GoogleChartInterface, ChartSelectEvent } from 'ng2-google-charts';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { COUNTRY_LIST } from '../../my-travels/country-list';
import { Apollo } from 'apollo-angular';
import COUNT_VISITED_COUNTRIES from '../../apollo/queries/visitedCountries/visited-countries.js';
import { TokenStorageService } from '../../auth/token-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

export interface PeriodicElement {
  position: number;
  username: string;
  avatar: string;
  count: number;
  percentOfWorld: number;
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-visited-countries',
  templateUrl: './visited-countries.component.html',
  styleUrls: ['./visited-countries.component.scss'],
})
export class VisitedCountriesComponent implements OnInit, OnDestroy {
  loaded: boolean;
  userData: any;
  mapData = [];

  queryTopVisitedCountries: Subscription;

  mapChart: GoogleChartInterface = {
    chartType: 'GeoChart',
    dataTable: [['Country', 'Visitors']],
    firstRowIsData: false,
    options: {
      region: 'world',
      defaultColor: '#304ffe',
      colorAxis: { colors: ['#FFA726', '#4374e0'] },
    },
  };

  displayedColumns: string[] = [
    'position',
    'username',
    'count',
    'percentOfWorld',
  ];
  visitedCountriesSource = new MatTableDataSource<PeriodicElement>(
    ELEMENT_DATA
  );

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private apollo: Apollo,
    private tokenStorageService: TokenStorageService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.userData = this.tokenStorageService.getUser();
    this.paginator._intl.itemsPerPageLabel = 'Users per page:';

    this.queryTopVisitedCountries = this.apollo
      .watchQuery({
        query: COUNT_VISITED_COUNTRIES,
      })
      .valueChanges.subscribe((result: any) => {
        console.log(result);
        for (const [i, user] of result.data.users.entries()) {
          const percent = (user.countriesCount / 195) * 100;
          ELEMENT_DATA.push({
            position: i + 1,
            username: user.username,
            avatar: user.avatar,
            count: user.countriesCount,
            percentOfWorld: percent,
          });

          this.mapData.push(user.countries.list);
        }

        this.generateMapCountries();

        // Refresh table
        this.refreshElementData();

        console.log(this.mapChart.dataTable);
      });
  }

  setLoaded() {
    this.loaded = true;
  }

  changeRegion(value: string | number) {
    this.mapChart.options = { ...this.mapChart.options, region: value };
    this.mapChart.component.draw();
  }

  refreshElementData() {
    this.visitedCountriesSource = new MatTableDataSource<PeriodicElement>(
      ELEMENT_DATA
    );

    this.visitedCountriesSource.paginator = this.paginator;
    this.visitedCountriesSource.sort = this.sort;
  }

  generateMapCountries() {
    const flattenedArr = [].concat.apply([], this.mapData);

    const countArr = _.chain(flattenedArr)
      .groupBy('name')
      .map(
        (countries) => ((countries[0].count = countries.length), countries[0])
      )
      .value();

    countArr.map((value) => {
      this.mapChart.dataTable.push([value.name, value.count]);
    });
  }

  ngOnDestroy() {
    ELEMENT_DATA.splice(0, ELEMENT_DATA.length);
    this.queryTopVisitedCountries.unsubscribe();
  }
}
