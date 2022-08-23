/**
--------------------------------------------------------------------------
   @class FormValidationGetForm extends FormValidation class
   @description This allow to connect your form to an external API like Getform account with the fetch API
   @author Ian Reid Langevin
--------------------------------------------------------------------------
*/

import { FormValidation } from "./validation"

export class FormValidationWithApi extends FormValidation {
   constructor (elem, options) {
      super(elem)
      this.endpoint = options.formEndpoint
   }

   _getInputsNameAndValues () {
      const FORM_DATA = new FormData()
      const ALL_INPUTS = this.form.querySelectorAll("input, select")
      ALL_INPUTS.forEach(element => {
         FORM_DATA.append(element.name, element.value)
      })
      return FORM_DATA
   }

   /**
    * @method _submitFormAction
    * @note - Override default submit to alllow you to set custom action on submit
    */
   _submitFormAction () {
      const FORM_DATA_VALUES = this._getInputsNameAndValues()

      fetch(this.endpoint, {
         method: "POST",
         body: FORM_DATA_VALUES
      })

         .then((response) => {
            if (response.ok) {
               this.form.setAttribute("data-form-submit", "success")
            } else {
               console.log("Looks like there was a problem. Status Code: " + response.status)
               this.form.setAttribute("data-form-submit", "failed")
            }
         })
   }

   /**
  @method
  @description public - init
  */
   init () {
      super.init() // init parent class
   }
}
