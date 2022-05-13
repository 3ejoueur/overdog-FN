/**
--------------------------------------------------------------------------
  @class Accordions
  @classdesc In most case, you just need to edit the path for the imported functions
  @author Ian Reid Langevin @3ejoueur
--------------------------------------------------------------------------
*/

// import collapse functions - adjust the import path to fit your project structure
import { showContent, hideContent, collapseAll } from "../shared/collapse"
import { labels } from "../labels"


export class Accordions {
   /**
   --------------------------------------------------------------------------
   @method constructor
   @param {string} elem - CSS selector
   @param {boolean} options.alternateMode - Set to true to open one accordion at the time
   --------------------------------------------------------------------------
  */
   constructor (elem, options) {
      const DEFAULT_OPTIONS = {
         alternateMode: false,
         clickOnOutsideClick: false
      }

      Object.assign(this, DEFAULT_OPTIONS, options)
      this.accordionsGroups = document.querySelectorAll(elem)
   }

   /**
   --------------------------------------------------------------------------
   @method _closeAccordionsOnClickOutside
   @desc Close accordions on outside click - add-on for this project
   --------------------------------------------------------------------------
   */
   _closeAccordionsOnClickOutside (item) {
      document.addEventListener("click", (event) => {
         if (!event.target.closest(`[${labels.accordions}]`)) collapseAll(item)
      })
   }

   /**
   --------------------------------------------------------------------------
   @method init
   @desc use this to init your class instance
   --------------------------------------------------------------------------
   */
   init () {
      this.accordionsGroups.forEach(item => {
         // get all the headings in this accordions group
         const ACCORDIONS_ITEM = item.querySelectorAll(`[${labels.accordions}]`)
         // close the accordions on click outside - feature only for this project
         if (this.clickOnOutsideClick === true) this._closeAccordionsOnClickOutside(item)
         ACCORDIONS_ITEM.forEach(accordion => {
            const HEADING = accordion.querySelector("button")
            if (HEADING) {
               HEADING.addEventListener("click", () => {
                  const TARGET_CONTENT = document.getElementById(HEADING.getAttribute(labels.target))
                  if (accordion.hasAttribute(labels.openState)) {
                     hideContent(accordion, HEADING, TARGET_CONTENT)
                     return
                  }
                  if (this.alternateMode === true) collapseAll(item)
                  showContent(accordion, HEADING, TARGET_CONTENT)
               })
            }
         })
      })
   }
}
