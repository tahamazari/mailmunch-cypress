import { generateFakeEmail, generateRandomString } from "../utils/helpers"

class SignUpPage {
  runTests(){
    this.verifyRouteSignUpWithShopify()
    this.verifyRouteSignUpWithGoogle()
    this.verifyRouteLogin()
    this.verifyEmailInvalid()
    this.verifyBlankCredentials()
    this.verifyValidSignUp()
  }

  verifyRouteLogin(){
    cy.contains('log in', { matchCase: false }).click()
    cy.url().should('include', '/users/sign_in')
    cy.go('back')
  }

  verifyRouteSignUpWithShopify(){
    cy.contains('Sign up with Shopify').click()
    cy.url().should('include', 'https://apps.shopify.com/mailmunch?auth=1')
    cy.go('back')
  }

  verifyRouteSignUpWithGoogle(){
    cy.get('a').and('have.attr', 'href', `${Cypress.env('railsUrl')}/users/auth/google_oauth2`)
  }

  verifyBlankCredentials(){
    cy.intercept(`${Cypress.env('railsUrl')}/api/v1/auth/sign_up`).as('blankCredentials')
    cy.contains('Sign Up').click()
    cy.wait('@blankCredentials').its('response.body.error').should('exist')
  }

  verifyValidSignUp(){
    cy.window().its('grecaptcha').should('exist')
    cy.get('input[type=email]:visible').type(generateFakeEmail())
    cy.get('input[type=password]:visible').type(generateRandomString())
    cy.intercept(`${Cypress.env('railsUrl')}/api/v1/auth/sign_up`).as('successSignUp')
    cy.contains('Sign Up').click()
    cy.wait('@successSignUp').its('response.body.token').should('exist')
  }

  verifyEmailInvalid(){
    cy.window().its('grecaptcha').should('exist')
    cy.get('input[type=email]:visible').type(generateRandomString())
    cy.get('input[type=password]:visible').type(generateRandomString())
    cy.intercept(`${Cypress.env('railsUrl')}/api/v1/auth/sign_up`).as('invalidEmail')
    cy.contains('Sign Up').click()
    cy.wait('@invalidEmail').its('response.body.token').should('not.exist')
  }
}

export default SignUpPage