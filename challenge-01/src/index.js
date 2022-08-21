const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;
  const user = users.find((user) => user.username === username);
  if (!user) {
    return response.status(400).json({ error: "User not found" });
  }
  request.user = user;
  return next();
}

function checksExistsTodoUser(request, response, next) {
  const { user } = request;
  const todoUuid = request.params.id;
  const todo = user.todos.find((todo) => todo.id === todoUuid);
  if (!todo) {
    return response.status(404).json({ error: "Todo not found" });
  }
  request.todo = todo;
  return next();
}

app.post("/users", (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const userValidation = users.find((user) => user.username === username);
  if (userValidation) {
    return response.status(400).json({ error: "User already exists" });
  }
  const user = {
    name,
    username,
    id: uuidv4(),
    todos: [],
  };

  users.push(user);

  return response.status(201).send(user);
});

app.get("/users", (request, response) => {
  return response.json(users);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  return response.json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { user } = request;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(todo);
  return response.status(201).send(todo);
});

app.put(
  "/todos/:id",
  checksExistsUserAccount,
  checksExistsTodoUser,
  (request, response) => {
    // Complete aqui
    const { title, deadline } = request.body;
    const { todo } = request;

    todo.title = title;
    todo.deadline = new Date(deadline);
    return response.status(200).send(todo);
  }
);

app.patch(
  "/todos/:id/done",
  checksExistsUserAccount,
  checksExistsTodoUser,
  (request, response) => {
    // Complete aqui
    const { todo } = request;
    todo.done = true;
    return response.status(200).send(todo);
  }
);

app.delete(
  "/todos/:id",
  checksExistsUserAccount,
  checksExistsTodoUser,
  (request, response) => {
    // Complete aqui
    const { user } = request;
    const { todo } = request;
    user.todos.splice(todo, 1);
    return response.status(204).send();
  }
);

module.exports = app;
