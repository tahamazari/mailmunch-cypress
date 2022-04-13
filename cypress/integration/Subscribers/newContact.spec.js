import SubscribersPage from "../../pages/Subscribers"

context('Cypress Mailmunch - Subscribers Page Tests', () => {
  beforeEach(() => {
    cy.login()
  });

  it('Subscribers', () => {
    cy.visit('/sites')
    const subscribersPageTestCases = new SubscribersPage()

    cy.fixture('users').then(users => {
      const { admin } = users
      subscribersPageTestCases.runTests({ ...admin })
    })
  })
})