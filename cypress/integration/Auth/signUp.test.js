import SignUpPage from "../../pages/SignUp"

context('Cypress Mailmunch - Sign Up Page Tests', () => {
  it('Sign Up', () => {
    cy.visit('/users/sign_up')
    const signUpPageTestCases = new SignUpPage()
    signUpPageTestCases.runTests()
  })
})