const router = require('express').Router();
const fs = require('fs');
const util = require('util');
const { v4: uuid } = require('uuid');
const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);

//route to get the notes from db/db.json
router.get('/notes', (req, res) => {
  readFileAsync('db/db.json', 'utf8')
    .then((data) => {
      const notes = JSON.parse(data);
      res.json(notes);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Cannot retrieve notes' });
    });
});
//route to post note into db/db.json and return stringified
router.post('/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    readFileAsync('db/db.json', 'utf8')
      .then((data) => {
        const notes = JSON.parse(data);

        // Variable for the object we will save
        const userNote = {
          title,
          text,
          id: uuid(),
        };

        notes.push(userNote);

        return writeFileAsync('db/db.json', JSON.stringify(notes));
      })
      //success and error messages for the user
      .then(() => {
        res.status(201).json({ status: 'success', body: req.body });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Cannot save the note' });
      });
  } else {
    res.status(400).json({ error: 'Missing required fields, please type title, text and ID' });
  }
});
//delete note (only working after trashcan is pressed if screen is refreshed *fix bug)
router.delete('/notes/:id', (req, res)=>{
  const idNotes = req.params.id;

  readFileAsync('db/db.json', 'utf8')
  .then((data) =>{
    const notes =JSON.parse(data);
    const index = notes.findIndex((note) => note.id === idNotes);

    if (index !== -1){
      notes.splice( index, 1);
      return writeFileAsync('db/db.json', JSON.stringify(notes))
    }
  })
})

module.exports = router;

