/**
--------------------------------------------------------------------------
  @class Dropdown
  @classdesc Dropdown for form filters (or anything else)
  @author Ian Reid Langevin
--------------------------------------------------------------------------
*/

import { labels } from "../labels"

export class Dropdown {
   /**
   --------------------------------------------------------------------------
   @method constructor
   @param {string} elem - CSS selector
   @param {boolean} options.closeClickOutside
   --------------------------------------------------------------------------
  */
   constructor (elem, options) {
      const DEFAULT_OPTIONS = {
         closeClickOutside: false
      }

      Object.assign(this, DEFAULT_OPTIONS, options)
      this.dropdowns = document.querySelectorAll(elem)
   }

   /**
   --------------------------------------------------------------------------
   @method _closeOnSelect
   @desc - Close the dropdown when selecting a value
   --------------------------------------------------------------------------
   */
   _closeOnSelect (dropdown, headingText) {
      dropdown.removeAttribute(labels.openState)
      dropdown.setAttribute("aria-expanded", "false")
      // set heading with checked value
      this._replaceHeadingWithSelectedLabel(dropdown, headingText)
   }

   /**
   --------------------------------------------------------------------------
   @method _replaceHeadingWithSelectedLabel
   @desc - Replace the dropdown heading by the selected label
   --------------------------------------------------------------------------
   */
   _replaceHeadingWithSelectedLabel (dropdown, headingText) {
      if (dropdown.querySelector("input:checked + label")) {
         headingText.textContent = dropdown.querySelector("input:checked + label").textContent
      }
   }

   /**
   --------------------------------------------------------------------------
   @method _toggleDropdown
   @desc - Open and close dropdown on heading button click
   --------------------------------------------------------------------------
   */
   _toggleDropdown (dropdown) {
      const BUTTON = dropdown.querySelector("button")
      if (BUTTON) {
         BUTTON.addEventListener("click", (event) => {
            if (event.target.disabled === true) return
            dropdown.hasAttribute(labels.openState) ? dropdown.removeAttribute(labels.openState) : dropdown.setAttribute(labels.openState, "")
            BUTTON.setAttribute("aria-expanded", BUTTON.getAttribute("aria-expanded") === "false" ? "true" : "false")
         })
      }
   }

   /**
   --------------------------------------------------------------------------
   @method init
   @desc - public - init
   --------------------------------------------------------------------------
   */
   init () {
      if (this.dropdowns) {
         this.dropdowns.forEach(dropdown => {
            this._toggleDropdown(dropdown)
            // close the filter dropdown when clicking an input if it is a fake select (radio)
            const HEADING_TEXT = dropdown.querySelector(`[${labels.dropdownText}]`)
            if (HEADING_TEXT) {
               dropdown.addEventListener("change", this._closeOnSelect.bind(this, dropdown, HEADING_TEXT))
               window.addEventListener("load", this._replaceHeadingWithSelectedLabel.bind(this, dropdown, HEADING_TEXT))
            }
            // close the filter dropdown on click outside
            if (this.closeClickOutside === true) {
               document.addEventListener("click", event => {
                  if (!dropdown.contains(event.target)) dropdown.removeAttribute(labels.openState)
               })
            }
         })
      }
   }
}
