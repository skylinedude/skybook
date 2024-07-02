const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const router = express.Router();
// const User=require('../models/User')
const Notes = require('../models/Notes')
const { body, validationResult } = require('express-validator');

//Route 1: Get all notes using GET: "/api/notes/fetchallnotes" login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id })
    res.json(notes)
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal server error occurred');
  }
})

//Route 2: add notes using POST: "/api/notes/addnote" login required
router.post('/addnote', fetchuser, [
  body('title', 'Enter a valid title').isLength({ min: 3 }),
  body('description', 'Description must be atleast 5 character').isLength({ min: 5 })
], async (req, res) => {
  try {
    // If error occurs, show the errors
    const { title, description, tag } = req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const note = new Notes({
      title, description, tag, user: req.user.id
    })
    const savedNote = await note.save()
    res.json(savedNote)
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal server error occurred');
  }
})

//Route 3: update note using PUT: "/api/notes/updatenote" login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
  try {


    const { title, description, tag } = req.body
    const newNote = {}
    if (title) { newNote.title = title }
    if (description) { newNote.description = description }
    if (tag) { newNote.tag = tag }

    // find the note to be updated and update it
    let note = await Notes.findById(req.params.id)
    if (!note) {
      res.status(404).send("Not found")
    }
    if (note.user.toString() !== req.user.id) {
      res.status(401).send("Not allowed")
    }
    note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
    res.json({ note })
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal server error occurred');
  }
})

//Route 4: Delete an existing note using DELETE: "/api/notes/deletenote" login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
  try {
    // find the note to be delete and delete it
    let note = await Notes.findById(req.params.id)
    if (!note) {
      res.status(404).send("Not found")
    }
    if (note.user.toString() !== req.user.id) {
      res.status(401).send("Not allowed")
    }
    note = await Notes.findByIdAndDelete(req.params.id)
    res.json({ "Success": "note as been deleted", note: note })
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal server error occurred');
  }
})
module.exports = router