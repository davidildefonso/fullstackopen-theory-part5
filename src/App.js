import React, { useState, useEffect, useRef  } from "react";
import Note from "./components/Note.js";
import Notification from "./components/Notification.js";
import noteService from './services/notes.js';
import loginService from './services/login.js';
import Footer from './components/Footer.js';
import LoginForm from './components/LoginForm.js';
import Togglable from './components/Togglable.js';
import NoteForm from './components/NoteForm.js';
import { Routes, Route, Link, useMatch } from "react-router-dom";
import {

  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
 
  Button,

} from '@material-ui/core'
import styled from 'styled-components'

const Page = styled.div`
  padding: 1em;
  background: papayawhip;
`

const Navigation = styled.div`
  background: BurlyWood;
  padding: 1em;
`



const Notes = ({notes, noteFormRef, createNote, showAll, setShowAll, user}) => {

	return  (
	<div>
		{user && <Togglable buttonLabel="new note" ref={noteFormRef} >
				<NoteForm	createNote = {createNote}	/>
			</Togglable>}
		<div>
			<button onClick={() => setShowAll(!showAll)}>
				show {showAll ? 'important' : 'all' }
			</button>
		</div>
		<TableContainer component={Paper}>
			<Table>
				<TableBody>
					
					{notes.map(note =>
						<TableRow  key={note.id}>
							<TableCell><Link to={`/notes/${note.id}`}>{note.content}</Link></TableCell>
							<TableCell>{note.user && note.user.name}</TableCell>
						</TableRow >
					)}
					
				</TableBody>
			</Table>
		</TableContainer>
	</div>
	)
}



const Home = () => (
  <div> 
    <h2>TKTL notes app</h2> 
    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
		Lorem Ipsum has been the industry&#39;s standard dummy text ever since the 1500s,
		when an unknown printer took a galley of type and scrambled it to make a type
		specimen book. It has survived not only five centuries, but also the leap 
		into electronic typesetting, remaining essentially unchanged. It was popularised in 
		the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
		and more recently with desktop publishing software like Aldus
		PageMaker including versions of Lorem Ipsum.</p> 
  </div>
)

const Users = () => (
  <div>
    <h2>TKTL notes app</h2>
    <ul>
      <li>Matti Luukkainen</li>
      <li>Juha Tauriainen</li>
      <li>Arto Hellas</li>
    </ul>
  </div>
)


const Login = ({username, password, handleLogin, setUsername, setPassword}) => {
	return (
		<LoginForm
				username={username}
				password={password}
				handleUsernameChange={({ target }) => setUsername(target.value)}
				handlePasswordChange={({ target }) => setPassword(target.value)}
				handleSubmit={handleLogin}
		/>
	)
} 



const App = () => {

	const [notes, setNotes] = useState([]);
	const [showAll, setShowAll] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);
	const [username, setUsername] = useState('') 
	const [password, setPassword] = useState('') 
	const [user, setUser] = useState(null)

	const noteFormRef = useRef()

	const match = useMatch('/notes/:id')
	const note = match 
		? notes.find(note => note.id === match.params.id)
		: null
	

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
			setErrorMessage('Sucess!', 'success')
				setErrorMessage({ content: 'Sucess ', type: 'success' }  )
			setTimeout(() => {
				setErrorMessage(null)
			}, 5000)
		} catch (exception) {	
			setErrorMessage({ content: 'Wrong credentials', type: 'error' }  )
			setTimeout(() => {
				setErrorMessage(null)
			}, 5000)
		}
	}

	const logOutUser = () => {
		localStorage.removeItem('loggedNoteappUser')
		setUser(null)
	}



	return (
	<Page>
		<h1>Notes</h1>		
		<Navigation >		
			{!user &&   <Button color="inherit" component={Link} to="/login">  login  </Button>  }
			<Button color="inherit" component={Link} to="/">  home  </Button>
			<Button color="inherit" component={Link} to="/notes">  notes  </Button>					
			{user &&  <Button color="inherit" component={Link} to="/users">  users  </Button>}	
			{user &&  <span>{user.name} logged in  <button  onClick={logOutUser} >log out</button> </span> }	
	
		</Navigation>
		<Routes>
			<Route path="/" element={<Home/>} />
			<Route path="users" element={<Users/>}  />
			<Route path="login" element={<Login   
				username={username} password={password} handleLogin={handleLogin} 
				setUsername = {setUsername} setPassword={setPassword}	/>}  />
			<Route path="notes" element={<Notes notes={notesToShow}  user={user}
				noteFormRef={noteFormRef} createNote={createNote}
				showAll={showAll} setShowAll={setShowAll} />} />
			<Route path="notes/:id" element={<Note note={note} toggleImportance = {toggleImportance} key={document.location.href} />} />
		</Routes>
		<Notification message={errorMessage} />	
		<Footer  />
	</Page>
  )
};

export default App;