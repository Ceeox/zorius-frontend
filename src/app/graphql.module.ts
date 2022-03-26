import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import {
  InMemoryCache,
  ApolloLink,
  WatchQueryFetchPolicy,
} from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

export const POLLING_INTERVAL = environment.pollingInterval;
export const FETCH_POLICY = environment.fetchPolicy as WatchQueryFetchPolicy;
export const RETRY_COUNT = environment.retryCount;
export const RETRY_DELAY = environment.retryDelay;

const uri = environment.apiUrl + '/graphql';

export function createApollo(
  httpLink: HttpLink,
  router: Router,
  snackBar: MatSnackBar
) {
  const basic = setContext((_operation, _context) => ({
    headers: {
      Accept: 'charset=utf-8',
    },
  }));

  const auth = setContext((_operation, _context) => {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || null}`,
      },
    };
  });

  const _onError = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) => {
        if (message === 'token error') {
          snackBar.open('Session expired. Try to login again.', undefined, {
            duration: 5000,
          });
          router.navigate(['login']);
        }
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
        snackBar.open(message, undefined, {
          duration: 5000,
        });
      });

    if (networkError) console.error(`[Network error]: ${networkError}`);
  });

  const link = ApolloLink.from([
    _onError,
    basic,
    auth,
    httpLink.create({ uri }),
  ]);
  const cache = new InMemoryCache();

  return {
    link,
    cache,
  };
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, Router, MatSnackBar],
    },
  ],
})
export class GraphQLModule {
  constructor(public router: Router) {}
}
