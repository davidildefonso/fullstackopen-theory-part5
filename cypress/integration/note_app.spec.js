describe('Note app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'mario',
      username: 'yessir',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user) 
	cy.visit('http://localhost:3000') 
  })

  it('front page can be opened', function() {
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2021')
  })

  it('login form can be opened', function() {
    cy.contains('login').click()
  })

	it('user can login', function () {
		cy.contains('login').click()
		cy.get('#username').type('yessir')
		cy.get('#password').type('salainen')
		cy.get('#login-button').click()

		cy.contains('mario logged in')
	})  

	describe('when logged in', function() {
		beforeEach(function() {
			cy.login({ username: 'yessir', password: 'salainen' })
		
		})

		it('a new note can be created', function() {
			cy.contains('new note').click()
			cy.contains('show all').click()
			cy.get('input').type('a note created by cypress')
			cy.contains('save').click()
			cy.contains('a note created by cypress')
		})

		describe('and a note exists', function () {
			beforeEach(function () {
				
				
				cy.createNote({ content: 'a note created by cypress', important: false })
			})

			it('it can be made  important', function () {
				cy.contains('show all').click()
				cy.contains('a note created by cypress')
				cy.contains('make important').click()

				cy.contains('a note created by cypress')
				cy.contains('make not important')
			})
		})


		describe('and several notes exist', function () {
			beforeEach(function () {
			cy.createNote({ content: 'first note', important: false })
			cy.createNote({ content: 'second note', important: false })
			cy.createNote({ content: 'third note', important: false })
			})

			it('one of those can be made important', function () {
				cy.contains('show all').click()
				cy.contains('second note')
					.contains('make important')
					.click()

				cy.contains('second note')
					.contains('make not important')
			})
		})
	})



	it('login fails with wrong password', function() {
		cy.contains('login').click()
		cy.get('#username').type('yessir')
		cy.get('#password').type('wrong')
		cy.get('#login-button').click()

		cy.get('.error').contains('Wrong credentials') 
		cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
		cy.get('.error').should('have.css', 'border-style', 'solid')

		cy.get('html').should('not.contain', 'mario logged in')
	})
})

