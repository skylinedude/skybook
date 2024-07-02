import React, { useContext, useState } from 'react'
import NoteContext from '../context/noteContext'

const AddNotes = () => {
    const context = useContext(NoteContext)
    const { addNote } = context;
    const [note, setNote] = useState({ title: "", description: "", tag: '' })
    const handleClick = (e) => {
        e.preventDefault();
        addNote(note.title, note.description, note.tag)
        setNote({ title: "", description: "", tag: '' })
    }
    const onChanged = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }
    return (
        <div className="container my-3">
            <h2>Add your note</h2>
            <form className='container my-3'>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label"><strong>Title</strong></label>
                    <input type="text" placeholder='Enter the title' className="form-control" id="title" name='title' aria-describedby="emailHelp" onChange={onChanged} minLength={3} required value={note.title}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label"><strong>Description</strong></label>
                    <input type="text" placeholder='Add description about your notes' className="form-control" id="description" name='description' onChange={onChanged} minLength={3} required value={note.description}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label"><strong>Tag</strong></label>
                    <input type="text" placeholder='Tag name' className="form-control" id="tag" name='tag' onChange={onChanged} minLength={3} required value={note.tag}/>
                </div>
                <button disabled={note.title.length<3 || note.description.length<3} type="submit" className="btn btn-primary" onClick={handleClick} >Add Note</button>
            </form>
        </div>
    )
}

export default AddNotes