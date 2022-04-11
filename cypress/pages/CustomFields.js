import { generateRandomNumber, interceptGqlRequest } from "../utils/helpers"

class CustomFields {
  constructor(){
    cy.intercept('POST', 'http://localhost:4000/', (req) => {
      if (req.body.operationName === 'UserSites'){
        req.alias = "UserSites"
      }
    })
    cy.wait('@UserSites')
    .its('response.body.data.sites').should('exist')
    .then(sites => {
      cy.visit(`/sites/${sites[0].id}/custom_fields`)
    })
  }

  runTests(){
    this.updateCustomField()
    this.verifyPreventEmptyCustomFieldNameOnUpdate()
  }

  updateCustomField(){
    interceptGqlRequest({ alias: 'updateSiteCustomField' })
    cy.get(`[data-attribute="icon-update-custom-field-${generateRandomNumber({ ceiling: 9 })}"]`).click()
    cy.get('[data-attribute="input-update-custom-field-name"]').type("-updated")
    cy.get("[data-attribute='button-update-custom-field-name']").click()

    cy.wait("@updateSiteCustomField")
    .its("response.body.data.updateSiteCustomField.success").should("eq", true)
  }

  verifyPreventEmptyCustomFieldNameOnUpdate(){
    cy.get(`[data-attribute="icon-update-custom-field-${generateRandomNumber({ ceiling: 9 })}"]`).click()
    cy.get('[data-attribute="input-update-custom-field-name"]').clear()
    cy.get('[data-attribute="button-update-custom-field-name"]').click()
    cy.get("[data-attribute='tooltip-update-custom-field-name']").should("exist")
    cy.get('[data-attribute=modal-close-custom-field-update]').click()
  }
}

export default CustomFields