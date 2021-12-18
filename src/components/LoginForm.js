import React from 'react'
import PropTypes from 'prop-types'
import {TextField , Button } from '@material-ui/core'

const LoginForm = ({
   handleSubmit,
   handleUsernameChange,
   handlePasswordChange,
   username,
   password
  }) => {
  return (
    <div>
		<h2>Login</h2>
		<form  onSubmit={handleSubmit}>
			<div>
			
				<TextField
					id="username"
					label="username" 
					value={username}
					onChange={handleUsernameChange}
				/>
			</div>
			<div>	
				<TextField
					label="password" 
					id="password"
					type="password"
					value={password}
					onChange={handlePasswordChange}
				/>
			</div>	
			<Button id="login-button" type="submit" variant="contained" color="primary" >login</Button>
			
		</form >
    </div>
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm