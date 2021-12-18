import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Button = styled.button`
  background: Bisque;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid Chocolate;
  border-radius: 3px;
`

const Input = styled.input`
  margin: 0.25em;
`



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
			
				<Input
					id="username"
					label="username" 
					value={username}
					onChange={handleUsernameChange}
				/>
			</div>
			<div>	
				<Input
					label="password" 
					id="password"
					type="password"
					value={password}
					onChange={handlePasswordChange}
				/>
			</div>	
			<Button id="login-button" type="submit"  >login</Button>
			
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