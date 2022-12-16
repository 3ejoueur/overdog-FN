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
         divIds: ["listing"]
      }
      Object.assign(this, DEFAULT_OPTIONS, options)
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
               fetchContent(HREF, this.divIds)
            })
         })
      }
   }
}
