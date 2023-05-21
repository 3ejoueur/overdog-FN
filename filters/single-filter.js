/**
--------------------------------------------------------------------------
  @class SingleFilter
  @author Ian Reid Langevin
--------------------------------------------------------------------------
*/

import { fetchContent } from "./fetch-content"

export class SingleFilter {
   /**
   --------------------------------------------------------------------------
   @method constructor
   @param {string} elem - CSS selector
   @param {array} options.divIds - Array of ID to replace from the fetch url
   --------------------------------------------------------------------------
  */

   constructor (elem, options) {
      const DEFAULT_OPTIONS = {
         divIds: ["listing"],
         attributes: {}
      }

      const DEFAULT_ATTRIBUTES = {
         loadingState: "data-fn-is-loading"
      }
      // Assign default options to this.options
      Object.assign(this, DEFAULT_OPTIONS, options)
      // Merge in a new object the default attributes names and the custom ones
      this.attr = Object.assign({}, DEFAULT_ATTRIBUTES, this.attributes)
      this.formId = document.querySelector(elem)
   }

   /**
   --------------------------------------------------------------------------
   @method init
   @desc - public - init
   --------------------------------------------------------------------------
   */
   init () {
      if (this.formId) {
         const FORM_INPUTS = this.formId.querySelectorAll("input")
         // Hard refresh when browser back button is pressed to refresh the listing
         window.addEventListener("popstate", () => { window.location.href = window.location })
         // For each input in the form
         FORM_INPUTS.forEach(input => {
            input.addEventListener("click", () => {
               const HREF = input.value
               history.pushState(null, null, HREF)
               fetchContent(HREF, this.divIds, this.attr.loadingState)
            })
         })
      }
   }
}
