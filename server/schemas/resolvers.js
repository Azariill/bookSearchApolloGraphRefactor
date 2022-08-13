/** @format */

const { AuthenticationError } = require("apollo-server-express");
const { saveBook } = require("../controllers/user-controller");
const { User } = require('../models');
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("__v -password")
          .populate("savedBooks");

        return userData;
      }
      throw new AuthenticationError("Not logged in");
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { username, email, password }) => {
      // check and see if the user exists
      const user = await User.findOne({ username });

      // throw and error if user is not found
      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

       // check and see if the user exists
       const emailExists = await User.findOne({ email });

       // throw and error if user is not found
       if (!emailExists) {
         throw new AuthenticationError("Incorrect credentials");
       }

      // if the user is found move on to checking for the correct password
      const correctPw = await user.isCorrectPassword(password);

      // if the password is wrong throw an error
      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, args, context) => {
        console.log(args.token);
        const updatedUser = await User.findOneAndUpdate(
          { _id: args.token},
          { $addToSet: { savedBooks: args.bookInput } },
          { new: true }
        ).populate("savedBooks");
        return updatedUser;
      
    
    },
    removeBook: async (parent, args) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: args.bookId } } },
          { new: true }
        ).populate("savedBooks");
        return updatedUser;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
