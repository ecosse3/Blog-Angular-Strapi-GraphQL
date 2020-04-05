import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import ARTICLES_QUERY from '../apollo/queries/article/articles.js';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent implements OnInit, OnDestroy {
  @Input() userId: number;

  data: any = {};
  loading = true;
  errors: any;
  articles: any[];

  private queryArticles: Subscription;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.queryArticles = this.apollo
      .watchQuery({
        query: ARTICLES_QUERY,
        variables: {
          id: this.userId,
        },
      })
      .valueChanges.subscribe((result) => {
        this.data = result.data;
        this.articles = this.data.articles;
        this.loading = result.loading;
        this.errors = result.errors;
      });
  }

  ngOnDestroy() {
    this.queryArticles.unsubscribe();
  }
}
