import { generateRandomName, generateRandomNumber, interceptGqlRequest } from "../utils/helpers"

class ListsPage {
  constructor(){
    cy.intercept('POST', Cypress.env('graphqlUrl'), (req) => {
      if (req.body.operationName === 'UserSites'){
        req.alias = "UserSites"
      }
    })
    cy.wait('@UserSites')
    .its('response.body.data.sites').should('exist')
    .then(sites => {
      cy.visit(`/sites/${sites[0].id}/lists`)
    })
  }

  runTests(){
    this.verifyAtleastOneListExists()
    this.verifyPreventDeletingOnlyExistingList()
    this.verifyPreventEmptyListCreation()
    this.verifyPreventEmptyListNameOnUpdate()
    this.verifySuccessfulCreateList()
    this.verifySuccessfulDoubleOptInUpdate()
    this.verifySuccessfulUpdateList()
    this.verifySuccessfulDeleteList()
  }


  verifyAtleastOneListExists(){
    interceptGqlRequest({ alias: "getSite", opName: "Site" })
    cy.wait('@getSite')
    .its("response.body.data.site.lists").its("length").should("be.gt", 0)
  }

  verifyPreventDeletingOnlyExistingList(){
    cy.get('[data-attribute="icon-list-delete-0"]').click()
    cy.get("[data-attribute='button-list-delete']").should('have.class', 'pointer-events-none')
    cy.contains("Discard").click()
  }

  verifyPreventEmptyListCreation(){
    cy.get('[data-attribute="button-list-create-new"]').click()
    cy.get('[data-attribute="button-list-upsert"]').click()
    cy.get("[data-attribute='tooltip-list-upsert-name']").should("exist")
    cy.get('[data-attribute=modal-close-list-upsert]').click()
  }

  verifyPreventEmptyListNameOnUpdate(){
    cy.get('[data-attribute="icon-list-upsert-0"]').click()
    cy.get('[data-attribute="input-list-upsert-name"]').clear()
    cy.get('[data-attribute="button-list-upsert"]').click()
    cy.get("[data-attribute='tooltip-list-upsert-name']").should("exist")
    cy.get('[data-attribute=modal-close-list-upsert]').click()
  }

  verifySuccessfulCreateList(){
    interceptGqlRequest({ alias: 'createList' })

    cy.get('[data-attribute="button-list-create-new"]').click()
    cy.get('[data-attribute="input-list-upsert-name"]').type(generateRandomName())
    cy.get('[data-attribute="button-list-upsert"]').click()

    cy.wait('@createList')
    .its("response.body.data.createList.success").should("eq", true) 
  }

  verifySuccessfulDeleteList(){
    interceptGqlRequest({ alias: 'deleteListAndAssignNewList' })

    cy.get('[data-attribute="icon-list-delete-1"]').click()
    cy.get('[data-attribute="select-list-choose-new"]').click()
    cy.get('[data-attribute="select-list-choose-new"]').within(() => {
      cy.get('[class$=-MenuList]').children().eq(0).click()
    })
    cy.get("[data-attribute='button-list-delete']").click()

    cy.wait('@deleteListAndAssignNewList')
    .its("response.body.data.deleteListAndAssignNewList.success").should("eq", true)
  }

  verifySuccessfulDoubleOptInUpdate(){
    interceptGqlRequest({ alias: 'updateList' })

    cy.get("[data-attribute=toggle-list-opt-in-0]").click()
    
    cy.wait("@updateList")
    .its("response.body.data.updateList.success").should("eq", true)
  }

  verifySuccessfulUpdateList(){
    interceptGqlRequest({ alias: 'updateList' })

    cy.get('[data-attribute="icon-list-upsert-0"]').click()

    cy.get('[data-attribute="input-list-upsert-name"]').type("-updated")
    
    cy.get("[data-attribute='select-list-upsert-set-locale']").click()

    cy.get('[data-attribute="select-list-upsert-set-locale"]').within(() => {
      cy.get('[class$=-MenuList]').children().eq(generateRandomNumber({ ceiling: 15 })).click()
    })

    cy.get("[data-attribute='toggle-list-opt-in-form']").click()

    cy.get("body").then($body => {
      if($body.find(".ql-container").length){
        cy.get(".ql-container").type(generateRandomName())
        cy.get("[data-attribute='button-list-upsert']").click()
        cy.wait("@updateList")
        .its("response.body.data.updateList.success").should("eq", true)
      }
      else{
        cy.get("[data-attribute='button-list-upsert']").click()
        cy.wait("@updateList")
        .its("response.body.data.updateList.success").should("eq", true)
      }
    })
  }
}

export default ListsPage