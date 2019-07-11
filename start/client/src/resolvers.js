import gql from 'graphql-tag';
import GET_CART_ITEMS from './pages/cart'

/**
 * To build a client schema, we extend the types of our server schema 
 * and wrap it with the gql function. Using the extend keyword allows 
 * us to combine both schemas inside developer tooling like Apollo VSCode 
 * and Apollo DevTools.

We can also add local fields to server data by extending types from our 
server. Here, we're adding the isInCart local field to the Launch type we 
receive back from our graph API.


 */
export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [ID!]!
  }

  extend type Launch {
    isInCart: Boolean!
  }

  extend type Mutation {
    addOrRemoveFromCart(id: ID!): [Launch]
  }
`;

export const resolvers ={
  Launch: {
    isInCart: (launch, _, { cache }) => {
      const { cartItems } = cache.readQuery({ query: GET_CART_ITEMS });
      return cartItems.includes(launch.id);
    },
  },
  Mutation: {
    addOrRemoveFromCart: (_, { id }, { cache }) => {
      const { cartItems } = cache.readQuery({ query: GET_CART_ITEMS });
      const data = {
        cartItems: cartItems.includes(id)
          ? cartItems.filter(i => i !== id)
          : [...cartItems, id],
      };
      cache.writeQuery({ query: GET_CART_ITEMS, data });
      return data.cartItems;
    },
  },
};

export const schema = gql`
  extend type Launch {
    isInCart: Boolean!
  }
`;
