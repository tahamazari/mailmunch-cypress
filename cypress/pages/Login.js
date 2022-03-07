import { generateFakeEmail, generateRandomString } from "../utils/helpers"

class LoginPage {
  runTests({ email, password }){
    this.verifyEmailInvalid()
    this.verifyCredentialsNOTEmptyMessage()
    this.verifyInvalidCredentials()
    this.verifyLoginWithShopifyRoute()
    this.verifyRouteLoginWithShopify()
    this.verifyRouteForgotPassword()
    this.verifyRouteSignUp()
    this.verifyValidUserLogin({ email, password })
  }

  verifyValidUserLogin({ email, password }){
    cy.window().its('grecaptcha').should('exist')
    cy.get('input[type=email]:visible').type(email)
    cy.get('input[type=password]:visible').type(password)
    cy.intercept(`${Cypress.env('railsUrl')}/api/v1/auth/sign_in`).as('successLogin')
    cy.contains('Sign In').click()
    cy.wait('@successLogin').its('response.body.token').should('exist')
  }

  verifyInvalidCredentials(){
    cy.get('input[type=email]:visible').type(generateFakeEmail())
    cy.get('input[type=password]:visible').type(generateRandomString())
    cy.intercept(`${Cypress.env('railsUrl')}/api/v1/auth/sign_in`).as('failedLogin')
    cy.contains('Sign In').click()
    cy.wait('@failedLogin').its('response.body.token').should('not.exist')
    cy.reload()
  }

  verifyEmailInvalid(){
    cy.get('input[type=email]:visible').type("taha")
    cy.get('input[type=password]:visible').type("123")
    cy.contains('Sign In').click()
    cy.contains('Email is Invalid')
    cy.reload()
  }

  verifyCredentialsNOTEmptyMessage(){
    cy.contains('Sign In').click()
    cy.contains('Email or Password cannot be Empty')
  }

  verifyRouteForgotPassword(){
    cy.contains('Forgot Password?').click()
    cy.url().should('include', '/users/password/new')
    cy.go('back')
  }

  verifyRouteSignUp(){
    cy.contains('Sign Up').click()
    cy.url().should('include', '/users/sign_up')
    cy.go('back')
  }

  verifyRouteLoginWithShopify(){
    cy.contains('Sign in with Shopify').click()
    cy.url().should('include', 'https://apps.shopify.com/mailmunch?auth=1')
    cy.go('back')
  }

  verifyRouteLoginWithGoogle(){
    cy.get('a').and('have.attr', 'href', `${Cypress.env('railsUrl')}/users/auth/google_oauth2`)
  }
}

export default LoginPage