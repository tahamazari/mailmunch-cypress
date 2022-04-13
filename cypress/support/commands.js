// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', () => {
  cy.fixture('users').then(users => {
    const { admin: { email, password } } = users
    cy.session([email, password], () => {
      cy.visit('/login')
      cy.get('input[type=email]:visible').type(email)
      cy.get('input[type=password]:visible').type(password)
      cy.intercept(`${Cypress.env('railsUrl')}/api/v1/auth/sign_in`).as('successLogin')
      cy.contains('Sign In').click()
      cy.wait('@successLogin').its('response.body.token').should('exist')
    })
  })
})