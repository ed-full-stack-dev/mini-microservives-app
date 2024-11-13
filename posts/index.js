const express = require('express');
const { randomBytes } =  require('crypto')
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

let posts = {};

// GET route for fetching all posts
app.get('/posts', (req, res) => {
  res.json(posts);
});

// POST route for creating a new post
app.post('/posts', async (req, res) => {
  const { title } = req.body;
  const id = randomBytes(4).toString('hex');
  posts[id] = {
    id, title
  }
    // Emit an event to the event bus
    await axios.post('http://localhost:4005/events', {
      type: 'PostCreated',
      data: {
        id, title
      }
    });
  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
    console.log("Event Received", req.body.type);
  
    res.send({});
  });




app.listen(port, () => {
  console.log(`Posts Server is running on http://localhost:${port}`);
});