import React from 'react';
import { Mutation, ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';

import { LoginForm, Loading } from '../components';

const LOGIN_USER = gql`
  mutation login($email: String!) {
    login(email: $email)
  }
`;

export default function Login() {
  return (
    <ApolloConsumer>
      {client => (
        <Mutation
          mutation={LOGIN_USER}
          onCompleted={({ login }) => {
            localStorage.setItem('token', login);
            client.writeData({ data: { isLoggedIn: true } });
          }}
        >
          {(login, { loading, error }) => {
            // this loading state will probably never show, but it's helpful to
            // have for testing
            if (loading) return <Loading />;
            if (error) return <p>An error occurred</p>;

            return <LoginForm login={login} />;
          }}
        </Mutation>
      )}
    </ApolloConsumer>
  );
}

/*
export default function Login() {
  return (
      *  Our Mutation component takes a render prop function 
      *  as a child that exposes a mutate function (login) and the 
      *  data object returned from the mutation. Finally, we pass our 
      *  login function to the LoginForm component.
    <Mutation mutation={LOGIN_USER}>
      {(login, { data }) => <LoginForm login={login} />}
    </Mutation>
  );
}
*/

/* Expose Apollo Client with ApolloConsumer

One of the main functions of react-apollo is that it puts your ApolloClient 
instance on React's context. Sometimes, we need to access the ApolloClient 
instance to directly call a method that isn't exposed by the react-apollo 
helper components. The ApolloConsumer component can help us access the client.

ApolloConsumer takes a render prop function as a child that is called with 
the client instance. Let's wrap our Mutation component with ApolloConsumer to 
expose the client. Next, we want to pass an onCompleted callback to Mutation 
that will be called once the mutation is complete with its return value. This 
callback is where we will save the login token to localStorage.

In our onCompleted handler, we also call client.writeData to write local data 
to the Apollo cache indicating that the user is logged in. This is an example
 of a direct write that we'll explore further in the next section on local 
 state management.
*/