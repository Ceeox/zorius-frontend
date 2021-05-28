import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { InMemoryCache, ApolloLink, WatchQueryFetchPolicy } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { setContext } from '@apollo/client/link/context';
import { onError } from "@apollo/client/link/error";
import { environment } from '../environments/environment';

export const POLLING_INTERVAL = environment.pollingInterval;
export const FETCH_POLICY = environment.fetchPolicy as WatchQueryFetchPolicy;
export const RETRY_COUNT = environment.retryCount;
export const RETRY_DELAY = environment.retryDelay;


const uri = environment.apiUrl + '/graphql';

export function createApollo(httpLink: HttpLink) {
  const basic = setContext((_operation, _context) => ({
    headers: {
      Accept: 'charset=utf-8'
    }
  }));

  const auth = setContext((_operation, _context) => {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || null}`
      }
    }
  });

  const _onError = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ),
      );

    if (networkError) console.error(`[Network error]: ${networkError}`);
  })

  const link = ApolloLink.from([_onError, basic, auth, httpLink.create({ uri })]);
  const cache = new InMemoryCache();

  return {
    link,
    cache
  }
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule { }
