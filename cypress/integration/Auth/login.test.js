import LoginPage from "../../pages/Login"

context('Cypress Mailmunch - Login Page Tests', () => {
  beforeEach(() => {
    cy.fixture("users.json").as("users");
  });

  it('Login', () => {
    cy.visit('/users/sign_in')

    const loginPageTestCases = new LoginPage()

    cy.fixture('users').then(users => {
      const { admin } = users
      loginPageTestCases.runTests({ ...admin })
    })
  })
})