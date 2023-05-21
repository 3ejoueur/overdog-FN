/**
--------------------------------------------------------------------------
  @class Tabs
  @author Ian Reid Langevin
--------------------------------------------------------------------------
*/

export class Tabs {
   /**
    elem
    @param {string} your tabs group - Multiple elements CSS selector
    options
    @param {boolean} makeFirstTabActive - Make first tab active with JS, useful if not active within template
  */

   constructor (elem, options) {
      const defaultOptions = {
         makeFirstTabActive: false,
         attributes: {}
      }

      const DEFAULT_ATTRIBUTES = {
         openState: "data-fn-is-open",
         tabs: "data-fn-tabs",
         tabsHeading: "data-fn-tabs-heading",
         tabsContent: "data-fn-tabs-content",
         tabsClose: "data-fn-tabs-content",
         target: "data-fn-target"
      }
      // Assign default options to this.options
      Object.assign(this, defaultOptions, options)
      // Merge in a new object the default attributes names and the custom ones
      this.attr = Object.assign({}, DEFAULT_ATTRIBUTES, this.attributes)
      this.tabsGroups = document.querySelectorAll(elem)
   }

   /**
   --------------------------------------------------------------------------
   @method init
   --------------------------------------------------------------------------
   */
   init () {
      if (this.tabsGroups) {
         this.tabsGroups.forEach(tabGroup => {
            const TABS_LIST = tabGroup.querySelector(`[${this.attr.tabs}]`)
            const TABS_HEADINGS = tabGroup.querySelectorAll(`[${this.attr.tabsHeading}]`)
            const TABS_CONTENTS = tabGroup.querySelectorAll(`[${this.attr.tabsContent}]`)
            // add the active class on the first element on page load
            if (this.makeFirstTabActive) {
               TABS_CONTENTS[0].setAttribute(this.attr.openState, "")
               TABS_HEADINGS[0].setAttribute(this.attr.openState, "")
            }
            // click action
            TABS_HEADINGS.forEach(heading => {
               heading.addEventListener("click", () => {
                  TABS_HEADINGS.forEach(heading => {
                     heading.removeAttribute(this.attr.openState)
                     heading.setAttribute("aria-selected", false)
                  })
                  TABS_CONTENTS.forEach(content => {
                     content.removeAttribute(this.attr.openState)
                  })
                  // set heading active state
                  heading.setAttribute(this.attr.openState, "")
                  heading.setAttribute("aria-selected", true)
                  // set target content active state
                  const TARGET_CONTENT = document.getElementById(heading.getAttribute(this.attr.target))
                  TARGET_CONTENT.setAttribute(this.attr.openState, "")
               })
            })
            this._keyboardNav(TABS_LIST, TABS_HEADINGS)
         })
      }
   }

   /**
   --------------------------------------------------------------------------
   @method _keyboardNav
   @desc Keyboard nav inside tablist
   --------------------------------------------------------------------------
   */
   _keyboardNav (tabList, tabsHeadings) {
      let tabFocus = 0

      tabList.addEventListener("keydown", event => {
      // Move right
         if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            tabsHeadings[tabFocus].setAttribute("tabindex", -1)
            if (event.key === "ArrowRight") {
               tabFocus++
               // If we are at the end, go to the start
               if (tabFocus >= tabsHeadings.length) {
                  tabFocus = 0
               }
               // Move left
            } else if (event.key === "ArrowLeft") {
               tabFocus--
               // If we are at the start, move to the end
               if (tabFocus < 0) {
                  tabFocus = tabsHeadings.length - 1
               }
            }
            tabsHeadings[tabFocus].setAttribute("tabindex", 0)
            tabsHeadings[tabFocus].focus()
         }
      })
   }
}
