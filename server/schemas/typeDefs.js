const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User{
        _id: ID
        username: String
        email: String
        password: String
        savedBooks: [Book]
    }

    type Book{
        authors:[String]
        description: String
        bookId: String
        image: String
        link: String
        title: String

    }
    type Auth{
        token: ID!
        user: User
    }

    type Query{
        me: User
    }

    input bookInput{
        authors:[string]
        description: String
        title: String
        bookId: String
        image: String
        link: String

    }

    type Mutation{
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(input: bookInput): Book
        removeBook(bookId: ID!): User


    }



`;

module.exports = typeDefs;