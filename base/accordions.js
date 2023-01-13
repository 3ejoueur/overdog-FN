/**
--------------------------------------------------------------------------
  @class Accordions
  @author Ian Reid Langevin
--------------------------------------------------------------------------
*/

// import collapse functions - adjust the import path to fit your project structure
import { showContent, hideContent, collapseAll } from "../shared/collapse"

export class Accordions {
   /**
   --------------------------------------------------------------------------
   @method constructor
   @param {string} elem - CSS selector
   @param {boolean} options.alternateMode - Set to true to open one accordion at the time
   @param {boolean} options.closeClickingOutside - Set to true to open one accordion at the time
   --------------------------------------------------------------------------
  */
   constructor (elem, options) {
      const DEFAULT_OPTIONS = {
         alternateMode: false,
         closeClickingOutside: false,
         attributes: {}
      }

      const DEFAULT_ATTRIBUTES = {
         openState: "data-fn-is-open",
         accordions: "data-fn-accordion",
         target: "data-fn-target"
      }

      // Merge in a new object the default attributes names and the custom ones
      this.attr = Object.assign({}, DEFAULT_ATTRIBUTES, options.attributes)
      // Assign default options to this.options
      Object.assign(this, DEFAULT_OPTIONS, options)
      this.accordionsGroups = document.querySelectorAll(elem)
   }

   /**
   --------------------------------------------------------------------------
   @method _closeAccordionsOnClickOutside
   --------------------------------------------------------------------------
   */
   _closeAccordionsOnClickOutside (item) {
      document.addEventListener("click", (event) => {
         if (!event.target.closest(`[${this.attr.accordions}]`)) collapseAll(item, this.attr.target, this.attr.openState)
      })
   }

   /**
   --------------------------------------------------------------------------
   @method init
   --------------------------------------------------------------------------
   */
   init () {
      this.accordionsGroups.forEach(item => {
         // get all the headings in this accordions group
         const ACCORDIONS_ITEM = item.querySelectorAll(`[${this.attr.accordions}]`)
         // close the accordions on click outside - feature only for this project
         if (this.closeClickingOutside === true) this._closeAccordionsOnClickOutside(item)
         ACCORDIONS_ITEM.forEach(accordion => {
            const HEADING = accordion.querySelector("button")
            if (HEADING) {
               HEADING.addEventListener("click", () => {
                  const TARGET_CONTENT = document.getElementById(HEADING.getAttribute(this.attr.target))
                  if (accordion.hasAttribute(this.attr.openState)) {
                     hideContent(accordion, HEADING, TARGET_CONTENT, this.attr.openState)
                     return
                  }
                  if (this.alternateMode === true) collapseAll(item, this.attr.target, this.attr.openState)
                  showContent(accordion, HEADING, TARGET_CONTENT, this.attr.openState)
               })
            }
         })
      })
   }
}
