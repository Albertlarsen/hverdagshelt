// @flow

import express from "express";
import path from "path";
import reload from "reload";
import fs from "fs";
import { UserDao } from "./daos/userDao";
import { IssueDao } from "./daos/issueDao";
import issueController from "./controllers/issueController.js";
import * as mysql from "mysql2";

type Request = express$Request;
type Response = express$Response;

const public_path = path.join(__dirname, "/../../client/public");

let app = express();

app.use(express.static(public_path));
app.use(express.json()); // For parsing application/json

// connect to database
let pool = mysql.createPool({
  connectionLimit: 10,
  host: "mysql.stud.iie.ntnu.no",
  user: "magnusrm",
  password: "fKzwPFN3",
  database: "magnusrm",
  debug: false
});

let userDao = new UserDao(pool);
let issueDao = new IssueDao(pool);

<<<<<<< HEAD
//fire controllers
issueController(app, issueDao);
=======
let userDao = new UserDao(pool);


>>>>>>> feature/leaflet/get_location_of_marker

// Hot reload application when not in production environment
if (process.env.NODE_ENV !== "production") {
  let reloadServer = reload(app);
  fs.watch(public_path, () => reloadServer.reload());
}

// The listen promise can be used to wait for the web server to start (for instance in your tests)
export let listen = new Promise<void>((resolve, reject) => {
  app.listen(3000, error => {
    console.log(error);
    if (error) reject(error.message);
    console.log("Server started");
    resolve();
  });
});

/*
app.get('/students', (req: Request, res: Response) => {
  return Students.findAll().then(students => res.send(students));
});

app.get('/students/:id', (req: Request, res: Response) => {
  return Students.findOne({ where: { id: Number(req.params.id) } }).then(
    student => (student ? res.send(student) : res.sendStatus(404))
  );
});

app.put('/students', (req: Request, res: Response) => {
  if (
    !req.body ||
    typeof req.body.id != 'number' ||
    typeof req.body.firstName != 'string' ||
    typeof req.body.lastName != 'string' ||
    typeof req.body.email != 'string'
  )
    return res.sendStatus(400);

  return Students.update(
    { firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email },
    { where: { id: req.body.id } }
  ).then(count => (count ? res.sendStatus(200) : res.sendStatus(404)));
});
 */
