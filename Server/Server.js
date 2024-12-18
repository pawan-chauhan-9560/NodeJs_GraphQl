const express = require("express");
const { ApolloServer } = require("@apollo/server");
const bodyParser = require("body-parser");
const { expressMiddleware } = require("@apollo/server/express4");
const axios = require("axios");
const cors = require("cors");

const getData = async () => {
  try {
    const response = await axios.get("https://jsonplaceholder.typicode.com/todos");
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
      type Todo {
        id: ID!
        title: String!
        completed: Boolean
      }

      type Query {
        getTodos: [Todo]
      }
    `,
    resolvers: {
      Query: {
        getTodos: async () => {
          return await getData(); // Fetch data dynamically on query execution
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
