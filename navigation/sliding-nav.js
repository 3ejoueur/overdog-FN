
/**
--------------------------------------------------------------------------
  @class MegaNav
  @classdesc Toggle between multiple nav buttons and open class on body
  @author Ian Reid Langevin @3ejoueur
--------------------------------------------------------------------------
*/

import { showOverlay, hideAllOverlay } from "../shared/overlay"
import { labels } from "../labels"

export class SlidingNav {
   /**
   --------------------------------------------------------------------------
      elem
      @param {string} elem - CSS selector - Wrapper around the open buttons to allow multiple instances with different options
      options
      @param {integer} delayBetweenOpenings - Delay between mega nav in milliseconds
      @param {string} backTransition - Style applied for back transition to avoid FOUC
      @param {string} overlaySelector - CSS Selector
      --------------------------------------------------------------------------
   */

   constructor (elem, options) {
      const DEFAULT_OPTIONS = {
         delayBetweenOpenings: 450,
         backTransition: "transition:transform 0.25s;transition-timing-function:cubic-bezier(0.42, 0, 1, 1);",
         overlaySelector: null
      }

      Object.assign(this, DEFAULT_OPTIONS, options)
      this.buttonsWrapper = document.querySelector(elem)
      if (this.buttonsWrapper) this.navButtons = this.buttonsWrapper.querySelectorAll(`[${labels.navButton}]`)
      if (this.overlaySelector) this.overlay = document.querySelector(this.overlaySelector)
   }

   /**
   --------------------------------------------------------------------------
   @method _openNav
   --------------------------------------------------------------------------
   */
   _openNav (currentButtonValue, relatedNav, currentButton) {
      if (this.overlay) showOverlay(this.overlay)
      document.body.setAttribute(labels.navOpen, currentButtonValue)
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
      document.body.removeAttribute(labels.navOpen)
      hideAllOverlay()
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
            const RELATED_NAV = document.querySelector(`[${labels.navPanel}="${button.getAttribute(labels.navButton)}"]`)
            const CLOSE_BUTTON = RELATED_NAV.querySelector(`[${labels.navClose}]`)

            if (CLOSE_BUTTON) CLOSE_BUTTON.addEventListener("click", () => { this._closeAllNavs() })

            button.addEventListener("click", () => {
               // get the value of the data attribute
               const CURRENT_BUTTON_VALUE = button.getAttribute(labels.navButton)
               // manage state of all panels and buttons
               if (!document.body.hasAttribute(labels.navOpen)) {
                  this._openNav(CURRENT_BUTTON_VALUE, RELATED_NAV, button)
                  return
               }
               if (document.body.getAttribute(labels.navOpen) === CURRENT_BUTTON_VALUE) {
                  this._closeAllNavs()
               } else { // manage the toggle between 2 different panels - keep the overlay
                  this._closeAllNavs()
                  setTimeout(() => { this._openNav(CURRENT_BUTTON_VALUE, RELATED_NAV, button) }, this.delayBetweenOpenings)
               }
            })
         })
         // if overlay, add the eventlistener and close all navs
         if (this.overlay) this.overlay.addEventListener("click", () => { this._closeAllNavs() })
      }
   }
}
