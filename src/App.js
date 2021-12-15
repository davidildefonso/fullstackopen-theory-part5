import React, { useState, useEffect, useRef  } from "react";
import Note from "./components/Note.js";
import Notification from "./components/Notification.js";
import noteService from './services/notes.js';
import loginService from './services/login.js';
import Footer from './components/Footer.js';
import LoginForm from './components/LoginForm.js';
import Togglable from './components/Togglable.js';
import NoteForm from './components/NoteForm.js';

const App = () => {

	const [notes, setNotes] = useState([]);
	const [showAll, setShowAll] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);
	const [username, setUsername] = useState('') 
	const [password, setPassword] = useState('') 
	const [user, setUser] = useState(null)

	const noteFormRef = useRef()
	

	const hook = () => {		
		noteService
			.getAll()
			.then((data) => {
					setNotes(data)	
			});
		
	}

	useEffect(hook, []);

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			setUser(user)
			noteService.setToken(user.token)
		}
	}, [])


	const createNote = async (noteObject) => {		

			const returnedNote  = await noteService.create( noteObject)
			
			setNotes(notes.concat( returnedNote ));
			noteFormRef.current.toggleVisibility()
	}



	const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important ) ; 


	const toggleImportance = (id) => {
			const targetNote = notes.find(note => note.id === id);		
			const noteObject = {...targetNote,  important: !targetNote.important};

			noteService
					.update( id,  noteObject)
					.then((data) => {
							setNotes(notes.map( note => note.id === id ? data : note ));
					})
					.catch(() => {
								setErrorMessage(
									`Note '${targetNote.content}' was already removed from server`
								)
								setTimeout(() => {
									setErrorMessage(null)
								}, 5000)
								setNotes(notes.filter(n => n.id !== id))
					});
		
	}

	const handleLogin = async  (event) => {
		event.preventDefault()
	
		try {
			const user = await loginService.login({
				username, password,
			})

			window.localStorage.setItem(
				'loggedNoteappUser', JSON.stringify(user)
			) 
			
			noteService.setToken(user.token)
			setUser(user)
			setUsername('')
			setPassword('')
		} catch (exception) {
			setErrorMessage('Wrong credentials')
			setTimeout(() => {
				setErrorMessage(null)
			}, 5000)
		}
	}





	return (
    <div>
		<h1>Notes</h1>
		<Notification message={errorMessage} />
		{!user && 
			<Togglable buttonLabel='login'>
				<LoginForm
					username={username}
					password={password}
					handleUsernameChange={({ target }) => setUsername(target.value)}
					handlePasswordChange={({ target }) => setPassword(target.value)}
					handleSubmit={handleLogin}
				/>
			</Togglable>}
		{user &&  
			<div>
				<p>{user.name} logged in</p>
				{<Togglable buttonLabel="new note" ref={noteFormRef} >
					<NoteForm	createNote = {createNote}	/>
				</Togglable>}
			</div>
		}
		<div>
			<button onClick={() => setShowAll(!showAll)}>
				show {showAll ? 'important' : 'all' }
			</button>
		</div>
		<ul>
			{notesToShow.map(note => 
				<Note key={note.id} note={note} toggleImportance = {toggleImportance} />
			)}
		</ul>
	
		<Footer  />
    </div>
  )
};

export default App;