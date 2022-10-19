/**
--------------------------------------------------------------------------
  @class Tabs
  @author Ian Reid Langevin
--------------------------------------------------------------------------
*/

import { labels } from "../labels"

export class Tabs {
   /**
    elem
    @param {string} your tabs group - Multiple elements CSS selector
    options
    @param {boolean} makeFirstTabActive - Make first tab active with JS, useful if not active within template
  */

   constructor (elem, options) {
      const defaultOptions = {
         makeFirstTabActive: false
      }

      Object.assign(this, defaultOptions, options)
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
            const TABS_LIST = tabGroup.querySelector(`[${labels.tabs}]`)
            const TABS_HEADINGS = tabGroup.querySelectorAll(`[${labels.tabsHeading}]`)
            const TABS_CONTENTS = tabGroup.querySelectorAll(`[${labels.tabsContent}]`)

            // add the active class on the first element on page load
            if (this.makeFirstTabActive) {
               TABS_CONTENTS[0].setAttribute(labels.openState, "")
               TABS_HEADINGS[0].setAttribute(labels.openState, "")
            }

            // click action
            TABS_HEADINGS.forEach(heading => {
               heading.addEventListener("click", () => {
                  TABS_HEADINGS.forEach(heading => {
                     heading.removeAttribute(labels.openState)
                     heading.setAttribute("aria-selected", false)
                  })
                  TABS_CONTENTS.forEach(content => {
                     content.removeAttribute(labels.openState)
                  })
                  // set heading active state
                  heading.setAttribute(labels.openState, "")
                  heading.setAttribute("aria-selected", true)
                  // set target content active state
                  const TARGET_CONTENT = document.getElementById(heading.getAttribute(labels.target))
                  TARGET_CONTENT.setAttribute(labels.openState, "")
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
