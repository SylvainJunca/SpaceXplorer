import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { LaunchTile, Header, Button, Loading } from '../components';

/* 
Query without the fragment :

const GET_LAUNCHES = gql`
  query launchList($after: String) {
    launches(after: $after) {
      cursor
      hasMore
      launches {
        id
        isBooked
        rocket {
          id
          name
        }
        mission {
          name
          missionPatch
        }
      }
    }
  }
`;

*/

/*
We define a GraphQL fragment by giving it a name (LaunchTile)
 and defining it on a type on our schema (Launch). The name we give 
 our fragment can be anything, but the type must correspond to a type 
 in our schema. 
 To use our fragment in our query, we import it into the GraphQL document 
 and use the spread operator to spread the fields into our query:
 */
export const LAUNCH_TILE_DATA = gql`
  fragment LaunchTile on Launch {
    id
    isBooked
    rocket {
      id
      name
    }
    mission {
      name
      missionPatch
    }
  }
`;

/* 
Query with the fragment 
*/

const GET_LAUNCHES = gql`
  query launchList($after: String) {
    launches(after: $after) {
      cursor
      hasMore
      launches {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;


export default function Launches() {
  return (
    <Query query={GET_LAUNCHES}>
      {({ data, loading, error, fetchMore }) => {
        if (loading) return <Loading />;
        if (error) return <p>ERROR</p>;

        return (
          <Fragment>
            <Header />
            {data.launches &&
              data.launches.launches &&
              data.launches.launches.map(launch => (
                <LaunchTile
                  key={launch.id}
                  launch={launch}
                />
              ))}
              {data.launches &&
                data.launches.hasMore && (
                  <Button
                    onClick={() =>
                      fetchMore({
                        variables: {
                          after: data.launches.cursor,
                        },
                        updateQuery: (prev, { fetchMoreResult, ...rest }) => {
                          if (!fetchMoreResult) return prev;
                          return {
                            ...fetchMoreResult,
                            launches: {
                              ...fetchMoreResult.launches,
                              launches: [
                                ...prev.launches.launches,
                                ...fetchMoreResult.launches.launches,
                              ],
                            },
                          };
                        },
                      })
                    }
                  >
                    Load More
                  </Button>
                )
              }
          </Fragment>
        );
      }}
    </Query>
  );
};