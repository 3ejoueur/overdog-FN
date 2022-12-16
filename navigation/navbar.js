/**
--------------------------------------------------------------------------
  @class Navbar
  @author Ian Reid Langevin
--------------------------------------------------------------------------
*/

import { labels } from "../labels.js"

export class Navbar {
   /**
   --------------------------------------------------------------------------
   @method constructor
   @param {string} elem - CSS selector
   @param {integer} scrollTopDistance
   --------------------------------------------------------------------------
   */

   constructor (elem, options) {
      const DEFAULT_OPTIONS = {
         scrollTopDistance: 80,
         behavior: "sticky"
      }

      this.navBar = document.querySelector(elem)
      Object.assign(this, DEFAULT_OPTIONS, options)
      // usefull for hidden navbar
      this.lastScrollpos = 0
   }

   /**
   --------------------------------------------------------------------------
   @method toggleNavbarActiveState
   --------------------------------------------------------------------------
   */
   _toggleNavbarSticky () {
   // old iOS used document.body.scrollTop but not modern browsers - get the bigger number
      const SCROLL_TOP_DISTANCE = Math.max(document.documentElement.scrollTop, document.body.scrollTop)
      if (SCROLL_TOP_DISTANCE > this.scrollTopDistance) {
         this.navBar.setAttribute(labels.openState, "")
      } else {
         this.navBar.removeAttribute(labels.openState)
      }
   }

   /**
   --------------------------------------------------------------------------
   @method toggleNavbarHiding
   --------------------------------------------------------------------------
   */
   _toggleNavbarHiding () {
      const CURRENT_SCROLL_POSITION = window.pageYOffset
      // old iOS used document.body.scrollTop but not modern browsers - get the bigger number
      const SCROLL_TOP_DISTANCE = Math.max(document.documentElement.scrollTop, document.body.scrollTop)
      if (SCROLL_TOP_DISTANCE > this.scrollTopDistance) { // avoid elastic iphone hide (you can adjust the pixel)
         if (this.lastScrollpos > CURRENT_SCROLL_POSITION) {
            this.navBar.removeAttribute(labels.openState)
         } else if (CURRENT_SCROLL_POSITION > this.lastScrollpos) {
            this.navBar.setAttribute(labels.openState, "")
         }
      }
      this.lastScrollpos = window.pageYOffset
   }

   /**
   --------------------------------------------------------------------------
   @method init
   @desc - public - init
   --------------------------------------------------------------------------
   */
   init () {
      if (this.navBar) {
         let ticking = false

         window.addEventListener("scroll", () => {
            if (!ticking) {
               window.requestAnimationFrame(() => {
                  this.behavior === "hidden" ? this._toggleNavbarHiding() : this._toggleNavbarSticky()
                  ticking = false
               })
               ticking = true
            }
         })
      }
   }
}
