const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

function validateBody(request, response, next) {
  const { title, url, techs } = request.body;
  if (!title || !url || !techs) {
    console.log(title, url, techs);
    return response.status(400).json("Invalid request.");
  }
  return next();
}

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", validateBody, (request, response) => {
  const { title, url, techs } = request.body;
  const project = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };
  repositories.push(project);
  return response.status(201).json(project);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const projectIndex = repositories.findIndex((repo) => repo.id === id);
  if (projectIndex < 0) {
    return response.status(400).json({ errro: "Repository not found." });
  }
  const { title, url, techs } = request.body;
  const updatedProject = {
    id,
    title,
    url,
    techs,
    likes: repositories[projectIndex].likes,
  };

  repositories[projectIndex] = updatedProject;
  return response.json(updatedProject);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const projectIndex = repositories.findIndex((repo) => repo.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ errro: "Repository not found." });
  }

  repositories.splice(projectIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const projectIndex = repositories.findIndex((repo) => repo.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ errro: "Repository not found." });
  }
  const updatedProject = {
    ...repositories[projectIndex],
    likes: repositories[projectIndex].likes + 1,
  };

  repositories[projectIndex] = updatedProject;
  return response.json(updatedProject);
});

module.exports = app;
