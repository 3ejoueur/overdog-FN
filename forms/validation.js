/**
--------------------------------------------------------------------------
   @class FormValidation
   @author Ian Reid Langevin
   @classdesc - Lightweigt data-attribute based Form validation
--------------------------------------------------------------------------
*/

import { validators } from "./validators"

export class FormValidation {
   /**
    * @param  {id} elem
    */
   constructor (elem, options) {
      const DEFAULT_OPTIONS = {
         emptyValues: [] // values from input that you want to considerate empty
      }

      Object.assign(this, DEFAULT_OPTIONS, options)

      this.form = document.querySelector(elem)

      if (this.form) {
         this.fieldWrappersList = this.form.querySelectorAll("[data-validate]")
         this.submitButton = this.form.querySelector("button[type=\"submit\"]")
         this.validators = validators
         this.multipleInputsFieldsType = ["checkbox", "radio"]
         this.consoleMessageError = "The data-validate-format specified in your HTML is not find in validators.js list."
         this.fieldWrappersDataArray = this._getFieldsWrapperData()
         this.labelSuccess = "success"
         this.labelSuccessNotRequired = "success-empty"
      }
   }

   /**
    * @method _getFieldsWrapperData
    */
   _getFieldsWrapperData () {
      const FIELD_WRAPPERS_DATA = []
      this.fieldWrappersList.forEach(fieldWrapper => {
         const WRAPPER_DATA = {}
         // add keys and values to the object
         WRAPPER_DATA.wrapperNode = fieldWrapper
         WRAPPER_DATA.inputs = fieldWrapper.querySelectorAll("input, select")
         WRAPPER_DATA.required = fieldWrapper.hasAttribute("data-validate-required")
         WRAPPER_DATA.format = fieldWrapper.dataset.validateFormat
         WRAPPER_DATA.minLength = fieldWrapper.dataset.validateMin
         WRAPPER_DATA.maxLength = fieldWrapper.dataset.validateMax
         WRAPPER_DATA.errorMessage = fieldWrapper.querySelector("[data-validate-error]")
         FIELD_WRAPPERS_DATA.push(WRAPPER_DATA)
      })

      return FIELD_WRAPPERS_DATA
   }

   /**
    * @method _handler
    * @param  {object} wrapper
    * @param  {event} event
    */
   _handler (wrapper, event) {
      let LABEL_FAILED = "failed"
      // if type is input, but error message has been previously shown, keep it visible
      if (event.type === "input") LABEL_FAILED = wrapper.wrapperNode.dataset.validate === "failed" ? "failed" : "failed-typing"
      const WRAPPER_STATUS = this._validateWrapper(wrapper, LABEL_FAILED)
      wrapper.wrapperNode.dataset.validate = WRAPPER_STATUS
   }

   /**
    * @method _validateWrapper
    * @param  {object} wrapper
    */
   _validateWrapper (wrapper, labelFailed) {
      // input const
      const LABEL_FAILED = labelFailed
      // default value to return
      let wrapperStatus = LABEL_FAILED
      // Validations
      // Multiple inputs -> Get the type of the first input and check if the type is includes in this.multipleInputsFieldsType
      if (this.multipleInputsFieldsType.includes(wrapper.inputs[0].type)) {
         // get the first checked input if exist
         const CHECKED_OPTION = wrapper.wrapperNode.querySelector("input:checked");
         (!CHECKED_OPTION) ? wrapperStatus = LABEL_FAILED : wrapperStatus = this.labelSuccess
         return wrapperStatus
      }
      // single input
      const INPUT_VALUE = wrapper.inputs[0].value.trim() // remove whitespace at beginning and end
      const FIELD_IS_EMPTY = (INPUT_VALUE.length < 1 || this.emptyValues.includes(INPUT_VALUE))
      // 1. Validate the data-validate-required - if not required, clear the validate status if empty
      if (FIELD_IS_EMPTY) {
         (wrapper.required) ? wrapperStatus = LABEL_FAILED : wrapperStatus = this.labelSuccessNotRequired
         return wrapperStatus
      }
      // 2. Validate the min length and return if fail
      if (wrapper.minLength && INPUT_VALUE.length < wrapper.minLength) {
         wrapperStatus = LABEL_FAILED
         return wrapperStatus
      }
      // 3. Validate the max length and return if fail
      if (wrapper.maxLength && INPUT_VALUE.length > wrapper.maxLength) {
         wrapperStatus = LABEL_FAILED
         return wrapperStatus
      }
      // 4. Validate the format
      if (wrapper.format) {
         // get the right regex for the field format
         const REGEX_MATCH = this.validators.find(element => element.format === wrapper.wrapperNode.dataset.validateFormat)
         if (!REGEX_MATCH) {
            // first check if the format exist in the regex validators js file, return with error if not
            console.error(this.consoleMessageError)
            return
         } else if (!REGEX_MATCH.regex.test(INPUT_VALUE)) {
            wrapperStatus = LABEL_FAILED
            return wrapperStatus
         }
      }
      // field has pass through all validations
      wrapperStatus = this.labelSuccess
      return wrapperStatus
   }

   /**
    * @method _checkIfAllWrapperAreValidated
    * @returns {boolean}
    * @note field.offsetParent is use to ignore display none fields (or it parent) (useful on conditionnal field)
    */
   _checkIfAllWrapperAreValidated () {
      // loop through all fields to check data-validate attribute
      const CHECK_ALL_FIELDS_STATUS = this.fieldWrappersDataArray.every(item =>
         [this.labelSuccess, this.labelSuccessNotRequired].includes(item.wrapperNode.dataset.validate) || item.wrapperNode.offsetParent === null
      )
      // set button disabled state
      return CHECK_ALL_FIELDS_STATUS
   }

   /**
    * @method _validateFormOnSubmit
    * @returns {boolean} ALL_FIELDS_ARE_VALIDATE
    */
   _validateFormOnSubmit (event) {
      event.preventDefault()
      this.fieldWrappersDataArray.forEach(wrapper => { this._handler(wrapper, event) })
      const ALL_FIELDS_ARE_VALIDATE = this._checkIfAllWrapperAreValidated()
      return ALL_FIELDS_ARE_VALIDATE
   }

   /**
    * @method _submitFormAction
    * @note - is overrided when using extended Class
    */
   _submitFormAction () {
      this.form.submit()
   }

   /**
    * @method init
   */
   init () {
      if (this.form) {
         // validate only the current field on change event
         this.fieldWrappersDataArray.forEach(wrapper => {
            // the change and input events are used to show different validation status
            wrapper.inputs.forEach(input => {
               input.addEventListener("change", (event) => { this._handler(wrapper, event) })
               input.addEventListener("input", (event) => { this._handler(wrapper, event) })
            })
         })
         // submit event - before submitting, check if all fields are validate
         // submitFunction is imported to allow to easily change the submit function
         this.submitButton.addEventListener("click", (event) => {
            const VALIDATION_STATUS = this._validateFormOnSubmit(event)
            if (VALIDATION_STATUS === true) this._submitFormAction()
         })
      }
   }
}
