/** @format */

const { AuthenticationError } = require("apollo-server-express");
const { saveBook } = require("../controllers/user-controller");
const { User } = require('../models');
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id });

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
    login: async (parent, { email, password }) => {
     

       // check and see if the user exists
       const user = await User.findOne({ email });

       // throw and error if user is not found
       if (!user) {
         throw new AuthenticationError("Incorrect credentials");
       }

      // if the user is found move on to checking for the correct password
      const correctPw = await user.isCorrectPassword(password);

      // if the password is wrong throw an error
      if (!correctPw) {
        throw new AuthenticationError("Incorrect Password");
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, {input}, context) => {
      if(context.user){
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id},
          { $push: { savedBooks:  input  } },
          { new: true }
        );
        return updatedUser;
      }
        
      
    
    },
    removeBook: async (parent, args, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: args.bookId } } },
          { new: true }
        );
        return updatedUser
      }
      
    },
  },
};

module.exports = resolvers;
