
/**
--------------------------------------------------------------------------
  @class SlidingNav
  @author Ian Reid Langevin
--------------------------------------------------------------------------
*/

import { showOverlay, hideAllOverlay } from "../shared/overlay"

export class SlidingNav {
   /**
   --------------------------------------------------------------------------
   @method constructor
   @param {string} elem - CSS selector - Wrapper around the open buttons to allow multiple instances with different options
   @param {integer} delayBetweenOpenings - Delay between mega nav in milliseconds
   @param {string} backTransition - Style applied for back transition to avoid FOUC
   @param {string} overlaySelector - CSS Selector
   --------------------------------------------------------------------------
   */

   constructor (elem, options) {
      const DEFAULT_OPTIONS = {
         delayBetweenOpenings: 450,
         backTransition: "transition:transform 0.25s;transition-timing-function:cubic-bezier(0.42, 0, 1, 1);",
         overlaySelector: null,
         attributes: {}
      }

      const DEFAULT_ATTRIBUTES = {
         overlayOpenState: "data-fn-is-open",
         navPanel: "data-fn-nav-panel",
         navButton: "data-fn-nav-button",
         navOpen: "data-fn-nav-open",
         navClose: "data-fn-nav-close"
      }
      // Merge in a new object the default attributes names and the custom ones
      this.attr = Object.assign({}, DEFAULT_ATTRIBUTES, options.attributes)
      // Assign default options to this.options
      Object.assign(this, DEFAULT_OPTIONS, options)

      this.buttonsWrapper = document.querySelector(elem)
      if (this.buttonsWrapper) this.navButtons = this.buttonsWrapper.querySelectorAll(`[${this.attr.navButton}]`)
      if (this.overlaySelector) this.overlay = document.querySelector(this.overlaySelector)
   }

   /**
   --------------------------------------------------------------------------
   @method _openNav
   --------------------------------------------------------------------------
   */
   _openNav (currentButtonValue, relatedNav, currentButton) {
      if (this.overlay) showOverlay(this.overlay, this.attr.overlayOpenState)
      document.body.setAttribute(this.attr.navOpen, currentButtonValue)
      if (!relatedNav.hasAttribute("style")) relatedNav.setAttribute("style", this.backTransition) // set the back transition on click - avoid a FOUT effect
      this._setAllButtonsAriaFalse()
      this._setOpenButtonAriaTrue(currentButton)
   }

   /**
   --------------------------------------------------------------------------
   @method _closeAllNavs
   --------------------------------------------------------------------------
   */
   _closeAllNavs () {
      document.body.removeAttribute(this.attr.navOpen)
      hideAllOverlay(this.attr.overlayOpenState)
      this._setAllButtonsAriaFalse()
   }

   /**
   --------------------------------------------------------------------------
   @method _setAllButtonsAriaFalse
   --------------------------------------------------------------------------
   */
   _setAllButtonsAriaFalse () {
      this.navButtons.forEach(button => { button.setAttribute("aria-expanded", "false") })
   }

   /**
   --------------------------------------------------------------------------
   @method _setOpenButtonAriaTrue
   --------------------------------------------------------------------------
   */
   _setOpenButtonAriaTrue (currentButton) {
      currentButton.setAttribute("aria-expanded", "true")
   }

   /**
   --------------------------------------------------------------------------
   @method init
   --------------------------------------------------------------------------
   */
   init () {
      if (this.navButtons) {
         this.navButtons.forEach(button => {
            // get the related panel
            const RELATED_NAV = document.querySelector(`[${this.attr.navPanel}="${button.getAttribute(this.attr.navButton)}"]`)
            if (RELATED_NAV) {
               const CLOSE_BUTTON = RELATED_NAV.querySelector(`[${this.attr.navClose}]`)
               if (CLOSE_BUTTON) CLOSE_BUTTON.addEventListener("click", () => { this._closeAllNavs() })
               button.addEventListener("click", () => {
                  // get the value of the data attribute
                  const CURRENT_BUTTON_VALUE = button.getAttribute(this.attr.navButton)
                  // manage state of all panels and buttons
                  if (!document.body.hasAttribute(this.attr.navOpen)) {
                     this._openNav(CURRENT_BUTTON_VALUE, RELATED_NAV, button)
                     return
                  }
                  if (document.body.getAttribute(this.attr.navOpen) === CURRENT_BUTTON_VALUE) {
                     this._closeAllNavs()
                  // manage the toggle between 2 different panels - keep the overlay
                  } else {
                     this._closeAllNavs()
                     setTimeout(() => { this._openNav(CURRENT_BUTTON_VALUE, RELATED_NAV, button) }, this.delayBetweenOpenings)
                  }
               })
            }
         })
         // if overlay, add the eventlistener and close all navs
         if (this.overlay) this.overlay.addEventListener("click", () => { this._closeAllNavs() })
      }
   }
}
