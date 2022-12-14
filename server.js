const express = require("express");
const cors = require("cors")
const res = require("express/lib/response");
const sqlite3 = require("sqlite3")
const app = express();

const PORT = 3001

app.use(cors())
app.use(express.json()); // for req.body

const db = new sqlite3.Database('./db.sqlite3', (err) => {
  if (err) {
    console.error("Error opening database " + err.message)
  }

  console.log('Connected to database.')
});

// app.get("/test", (req, res) => {
//   res.status(200).json({success: true})
// } )

app.get("/profiles", (req, res) => {
  db.all('SELECT * FROM profiles', (err, rows) => {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }

    res.status(200).json({rows});
  });
});

//const GET_PROFILE_STATEMENT = 'SELECT * FROM profiles WHERE login = ? AND password = ?';
app.get("/profiles/profile?:login?:password", (req, res) => {
  //var params = [req.query.login, req.query.password]
  const query = `SELECT * FROM profiles WHERE login = '${req.query.login}' AND password = '${req.query.password}'`
  //db.get(GET_PROFILE_STATEMENT, params, (err, row) => {
  console.log(query)
  db.get(query, [], (err, row) => {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }
    if(row == undefined) {
      res.status(204).json({})
      return;
    }

    res.status(200).json(row);
  })
})

const CREATE_PROFILE_STATEMENT = 'INSERT INTO profiles (login, displayName, password) VALUES (?, ?, ?)';
app.post("/profiles", (req, res) => {
  var reqBody = req.body;
  db.run(CREATE_PROFILE_STATEMENT, [reqBody.login, reqBody.displayName, reqBody.password], (err) => {
    if(err) {
      if(err.message === "SQLITE_CONSTRAINT: UNIQUE constraint failed: profiles.login") {
        res.status(409).json({"status":"error", "error":err.message, "message":"Login already exists."})
      }
      else {
        res.status(400).json({"status":"error", "error":err.message})
      }
      return
    }

    res.status(201).json({"status":"success", "message":"user created"})
  })
})

//const UPDATE_PROFILE_STATEMENT = 'UPDATE profiles SET displayName = ?, highscore = ? WHERE login = ? AND password = ?'
app.patch("/profiles", (req, res) => {
  var reqBody = req.body
  const query = `UPDATE profiles SET displayName = '${reqBody.displayName}', highscore = ${reqBody.highscore} WHERE login = '${reqBody.login}' AND password = '${reqBody.password}'`
  // db.run(UPDATE_PROFILE_STATEMENT, [reqBody.displayName, reqBody.highscore, reqBody.login, reqBody.password], (err) => {
    db.run(query, [], (err) => {
    if (err) {
      res.status(400).json({"status": "error", "error":err.message})
      return
    }

    res.status(200).json({"status":"success", "message":"profile updated"})
  })
})

// Tests

app.get("/tests", (req, res) => {
  db.all('SELECT * FROM customWords', (err, rows) => {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }

    res.status(200).json({rows});
  });
});

const GET_TEST_STATEMENT = 'SELECT * FROM customWords WHERE owner = ?';
app.get("/tests/test?", (req, res) => {
  var params = [req.query.owner]
  db.all(GET_TEST_STATEMENT, params, (err, rows) => {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }

    res.status(200).json(rows);
  })
})

const GET_TEST_WITH_ID_STATEMENT = 'SELECT * FROM customWords WHERE id = ?';
app.get("/testID/", (req, res) => {
  var params = [req.query.id]
  db.get(GET_TEST_WITH_ID_STATEMENT, params, (err, row) => {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }

    res.status(200).json(row);
  })
})

const CREATE_TEST_STATEMENT = 'INSERT INTO customWords (owner, name, description, words) VALUES (?, ?, ?, ?)';
app.post("/tests", (req, res) => {
  var reqBody = req.body;
  db.run(CREATE_TEST_STATEMENT, [reqBody.owner, reqBody.name, reqBody.description, reqBody.words], (err) => {
    if(err) {
      res.status(400).json({"error":err.message})
      return
    }

    res.sendStatus(201)
  })
})

const UPDATE_TEST_STATEMENT = 'UPDATE customWords SET name = ?, description = ?, words = ? WHERE owner = ? AND id = ?'
app.patch("/tests", (req, res) => {
  var reqBody = req.body
  db.run(UPDATE_TEST_STATEMENT, [reqBody.name, reqBody.description, reqBody.words, reqBody.owner, reqBody.id], (err) => {
    if (err) {
      res.status(400).json({"error":err.message})
      return
    }

    res.sendStatus(200)
  })
})

const DELETE_TEST_STATEMENT = 'DELETE FROM customWords WHERE owner = ? AND id = ?'
app.delete("/tests/test?:owner?:id", (req, res) => {
  var params = [req.query.owner, req.query.id]
  db.run(DELETE_TEST_STATEMENT, params, (err) => {
    if (err) {
      res.status(400).json({"error":err.message})
      return
    }

    res.sendStatus(200)
  })
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))