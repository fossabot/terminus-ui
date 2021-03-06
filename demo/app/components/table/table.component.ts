import {
  AfterViewInit,
  Component,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  merge,
  Observable,
  of,
} from 'rxjs';
import { startWith, map, switchMap, catchError } from 'rxjs/operators';
import {
  TsTableDataSource,
  TsSortDirective,
  TsPaginatorComponent,
  TsPaginatorMenuItem,
  TsSelectFormatFn,
} from '@terminus/ui';


export interface TableItem {
  username: string;
  age: number;
  title: string;
  active: boolean;
  visible: boolean;
}

const COLUMNS_SOURCE_GITHUB = [
  {
    name: 'Created',
    value: 'created',
  },
  {
    name: 'Title',
    value: 'title',
  },
  {
    name: 'Comments',
    value: 'comments',
  },
  {
    name: 'State',
    value: 'state',
  },
  {
    name: 'Number',
    value: 'number',
  },
];

export interface GithubApi {
  items: GithubIssue[];
  total_count: number;
}

export interface GithubIssue {
  created_at: string;
  number: string;
  state: string;
  title: string;
}

/**
 * An example database that the data source uses to retrieve data for the table.
 */
export class ExampleHttpDao {
  constructor(private http: HttpClient) {}

  getRepoIssues(sort: string, order: string, page: number, perPage: number): Observable<GithubApi> {
    const href = 'https://api.github.com/search/issues';
    const requestUrl = `${href}?q=repo:GetTerminus/terminus-ui`;
    const requestParams = `&sort=${sort}&order=${order}&page=${page + 1}&per_page=${perPage}`;

    return this.http.get<GithubApi>(`${requestUrl}${requestParams}`);
  }
}


@Component({
  selector: 'demo-table',
  templateUrl: './table.component.html',
})
export class TableComponent implements AfterViewInit {
  allColumns = COLUMNS_SOURCE_GITHUB.slice(0);
  displayedColumns: string[] = [
    'created',
    'number',
    'title',
    'state',
    'comments',
  ];
  exampleDatabase!: ExampleHttpDao;
  dataSource: TsTableDataSource<GithubIssue> = new TsTableDataSource();
  resultsLength = 0;

  @ViewChild(TsSortDirective)
  sort!: TsSortDirective;

  @ViewChild(TsPaginatorComponent)
  paginator!: TsPaginatorComponent;

  myUIFn: TsSelectFormatFn = (v) => v.name;
  myModelFn: TsSelectFormatFn = (v) => v.value;


  constructor(
    private http: HttpClient,
  ) {}


  ngAfterViewInit(): void {
    this.exampleDatabase = new ExampleHttpDao(this.http);

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => {
      this.paginator.currentPageIndex = 0;
    });

    // Fetch new data anytime the sort is changed, the page is changed, or the records shown per
    // page is changed
    merge(this.sort.sortChange, this.paginator.pageSelect, this.paginator.recordsPerPageChange)
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.exampleDatabase.getRepoIssues(
            this.sort.active,
            this.sort.direction,
            this.paginator.currentPageIndex,
            this.paginator.recordsPerPage,
          );
        }),
        map((data) => {
          console.log('Demo: fetched data: ', data);
          this.resultsLength = data.total_count;

          return data.items;
        }),
        catchError(() => {
          console.warn('GitHub API rate limit has been reached!');
          return of([]);
        }),
      ).subscribe((data) => {
        this.dataSource.data = data;
      });
  }


  perPageChange(e: number): void {
    console.log('DEMO records per page changed: ', e);
  }

  onPageSelect(e: TsPaginatorMenuItem): void {
    console.log('DEMO page selected: ', e);
  }

}
