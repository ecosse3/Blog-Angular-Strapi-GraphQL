import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { GoogleChartInterface, ChartSelectEvent } from 'ng2-google-charts';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { COUNTRY_LIST } from './country-list';
import { Apollo } from 'apollo-angular';
import UPDATE_USER from '../apollo/mutations/user/update.js';
import USER_DATA from '../apollo/queries/user/user-data.js';
import { TokenStorageService } from '../auth/token-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

export interface PeriodicElement {
  position: number;
  name: string;
  date: string | object;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-my-travels',
  templateUrl: './my-travels.component.html',
  styleUrls: ['./my-travels.component.scss'],
})
export class MyTravelsComponent implements OnInit, OnDestroy {
  selectedCountry: any;
  loaded = false;
  userData: any;
  userCountries: any;
  userLoading: boolean;
  userErrors: any;
  saveClicked = false;

  queryUserCountries: Subscription;

  mapChart: GoogleChartInterface = {
    chartType: 'GeoChart',
    dataTable: [['Country']],
    firstRowIsData: false,
    options: {
      region: 'world',
      defaultColor: '#304ffe',
      tooltip: { trigger: 'none' },
    },
  };

  displayedColumns: string[] = ['position', 'name', 'date', 'symbol'];
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
    this.paginator._intl.itemsPerPageLabel = 'Countries per page:';

    this.queryUserCountries = this.apollo
      .watchQuery({
        query: USER_DATA,
        variables: {
          id: this.userData.data.login.user.id,
        },
      })
      .valueChanges.subscribe((result: any) => {
        this.userCountries = result.data;
        this.userLoading = result.loading;
        this.userErrors = result.errors;

        if (result.data.user.countries !== null && this.saveClicked === false) {
          for (
            let index = 1;
            index < result.data.user.countries.map.length;
            index++
          ) {
            this.mapChart.dataTable.push(result.data.user.countries.map[index]);
          }

          // tslint:disable-next-line: prefer-for-of
          for (
            let index = 0;
            index < result.data.user.countries.list.length;
            index++
          ) {
            ELEMENT_DATA.push(result.data.user.countries.list[index]);
          }

          this.refreshElementData();
        }
      });
  }

  setLoaded() {
    this.loaded = true;
  }

  changeRegion(value: string | number) {
    this.mapChart.options = { ...this.mapChart.options, region: value };
    this.mapChart.component.draw();
  }

  addCountry(event: { region: string }) {
    // Check if exists in array
    for (let i = 1; i < this.mapChart.dataTable.length; i++) {
      if (this.mapChart.dataTable[i][0] === event.region) {
        const indexM = this.mapChart.dataTable.findIndex(
          (e) => e[0] === event.region
        );
        this.mapChart.dataTable.splice(indexM, 1);

        const indexT = ELEMENT_DATA.findIndex((e) => e.symbol === event.region);

        if (indexT > -1) {
          ELEMENT_DATA.splice(indexT, 1);

          // tslint:disable-next-line: no-shadowed-variable
          ELEMENT_DATA.forEach((element, i) => {
            element.position = i + 1;
          });
        }

        this.refreshElementData();

        this.mapChart.component.draw();
        return;
      }
    }

    this.mapChart.dataTable.push([event.region]);

    ELEMENT_DATA.push({
      position: ELEMENT_DATA.length + 1,
      name: this.findCountryName(event.region),
      date: 'Pick a date',
      symbol: event.region,
    });

    this.refreshElementData();

    this.mapChart.component.draw();
  }

  findCountryName(code: string) {
    const obj = COUNTRY_LIST.find((o) => o.code === code);

    return obj.name;
  }

  save() {
    if (this.mapChart.dataTable[1] === 'Country') {
      this.mapChart.dataTable.shift();
    }

    this.apollo
      .mutate({
        mutation: UPDATE_USER,
        variables: {
          input: {
            where: {
              id: this.userData.data.login.user.id,
            },
            data: {
              countries: {
                map: this.mapChart.dataTable,
                list: ELEMENT_DATA,
              },
              countriesCount: ELEMENT_DATA.length,
            },
          },
        },
      })
      .subscribe(
        (data: any) => {
          this.snackBar.open('Visited coutries has been saved!', 'Dismiss', {
            duration: 4000,
          });
        },
        (error) => {
          this.snackBar.open(error, 'Dismiss', {
            duration: 4000,
          });
        }
      );
    this.userCountries.user.countries.list = ELEMENT_DATA.slice();
    this.saveClicked = true;
  }

  saveButtonState() {
    if (
      this.userCountries.user.countries.list
        .map((e) => e.name + e.date)
        .toString() === ELEMENT_DATA.map((e) => e.name + e.date).toString()
    ) {
      return true;
    } else {
      return false;
    }
  }

  refreshElementData() {
    this.visitedCountriesSource = new MatTableDataSource<PeriodicElement>(
      ELEMENT_DATA
    );

    this.visitedCountriesSource.paginator = this.paginator;
    this.visitedCountriesSource.sort = this.sort;
  }

  ngOnDestroy() {
    ELEMENT_DATA.splice(0, ELEMENT_DATA.length);
    this.queryUserCountries.unsubscribe();
  }
}
