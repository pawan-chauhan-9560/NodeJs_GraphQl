const express = require("express");
const { ApolloServer } = require("@apollo/server");
const bodyParser = require("body-parser");
const { expressMiddleware } = require("@apollo/server/express4");
const axios = require("axios");
const cors = require("cors");

const getData = async (type, id = 0) => {
  try {
    const queryType = type == "todo" ? "todos" : "users";
    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/${queryType}${
        id > 0 ? `/${id}` : ""
      }`
    );
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error("Error fetching data:", err);
    throw err;
  }
};

async function startServer() {
  const app = express();

  const PORT = process.env.PORT || 8001;

  const server = new ApolloServer({
    typeDefs: `
    type User{
    id:ID!
    name:String!
    username:String!
    email:String!
    phone: String!
    website:String!
    }
      type Todo {
        id: ID!
        title: String!
        completed: Boolean
        user:User
      }

      type Query {
        getTodos: [Todo]
        getAllUser:[User]
        getUser(id:ID!):User
      }
    `,
    resolvers: {
      Todo: {
        user: async (todo) =>
          (
            await axios.get(
              `https://jsonplaceholder.typicode.com/users/${todo.userId}`
            )
          ).data,
      },
      Query: {
        getTodos: async () => {
          return await getData("todo");
        },
        getAllUser: async () => {
          return await getData("user");
        },
        getUser: async (parent, { id }) => {
          return await getData("user", id);
        },
      },
    },
  });

  app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());

  await server.start();
  app.use("/graphql", expressMiddleware(server));

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
