import NewSubscriber from "./NewSubsciber"
import { interceptGqlRequest } from "../../utils/helpers"

class Subscribers {
  constructor(){
    cy.intercept('POST', Cypress.env('graphql'), (req) => {
      if (req.body.operationName === 'UserSites'){
        req.alias = "UserSites"
      }
    })
    cy.wait('@UserSites')
    .its('response.body.data.sites').should('exist')
    .then(sites => {
      cy.visit(`/sites/${sites[0].id}/subscribers`)
    })
  }

  runTests(){
    this.verifySiteSubscribersFetched()
    const newSubscriber = new NewSubscriber()
    newSubscriber.runTests()
  }

  verifySiteSubscribersFetched = () => {
    interceptGqlRequest({ alias: 'fetchSubscribers' })

    cy.wait('@fetchSubscribers')
    .its("response.body.data.site.id").should("exist")
  }
}

export default Subscribers