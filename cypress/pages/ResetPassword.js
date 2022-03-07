import { generateFakeEmail } from "../utils/helpers"

class ResetPasswordPage {
  runTests({ email }){
    this.verifyEmailNotRegistered()
    this.verifyEmptyCredentials()
    this.verifyRouteBackToSignIn()
    this.verifyUserWithEmailExists({ email })
  }

  verifyEmailNotRegistered(){
    cy.get('input[type=text]:visible').type(generateFakeEmail())
    cy.intercept(`${Cypress.env('railsUrl')}/api/v1/auth/forgot_password`).as('emailNotFound')
    cy.contains("reset password", { matchCase: false }).click()
    cy.wait('@emailNotFound').its('response.body.error').should('exist')
    cy.reload()
  }

  verifyEmptyCredentials(){
    cy.intercept(`${Cypress.env('railsUrl')}/api/v1/auth/forgot_password`).as('emailNotFound')
    cy.contains("reset password", { matchCase: false }).click()
    cy.wait('@emailNotFound').its('response.body.error').should('exist')
    cy.reload()
  }

  verifyUserWithEmailExists({ email }){
    cy.get('input[type=text]:visible').type(email)
    cy.intercept(`${Cypress.env('railsUrl')}/api/v1/auth/forgot_password`).as('resetPasswordEmailSent')
    cy.contains("reset password", { matchCase: false }).click()
    cy.wait('@resetPasswordEmailSent').its('response.body.message').should('eq', "If this user exists, we have sent you a password reset email.")
  }

  verifyRouteBackToSignIn(){
    cy.contains('Back to sign in').click()
    cy.url().should('include', '/users/sign_in')
    cy.go('back')
  }
}

export default ResetPasswordPage