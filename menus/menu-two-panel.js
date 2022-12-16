/**
--------------------------------------------------------------------------
  @class MenuTwoPanel
  @author Ian Reid Langevin
--------------------------------------------------------------------------
*/

import { showContent, hideContent, collapseAll } from "../shared/collapse.js"
import { labels } from "../labels.js"

export class MenuTwoPanel {
   /**
   --------------------------------------------------------------------------
   @method constructor
   @param {string} elem
   @param {string} options.collapseBreakpoint
   @param {string} options.currentLinkSelector
   @param {boolean} options.hideCurrentOnMobile
   @param {boolean} options.closeActiveOnClick
   --------------------------------------------------------------------------
   */
   constructor (elem, options) {
      const DEFAULT_OPTIONS = {
         collapseBreakpoint: "767px",
         currentLinkSelector: "[data-fn-uri=\"current\"]",
         hideCurrentOnMobile: false,
         closeActiveOnClick: false
      }

      Object.assign(this, DEFAULT_OPTIONS, options)
      this.menuSelector = document.querySelector(elem) // wrapper of your whole menu
      this.mediaQueryDesktop = window.matchMedia(`screen and (max-width: ${this.collapseBreakpoint})`)
      if (this.menuSelector) this.onLoadcurrentMenuLink = this.menuSelector.querySelector(this.currentLinkSelector)
   }

   /**
   --------------------------------------------------------------------------
   @method _openParent
   @desc - Main event handling to show parent on load
   --------------------------------------------------------------------------
   */
   _openParent (current) {
      const CURRENT_LINK_SUBMENU = current.closest(`[${labels.menuSubmenu}]`)
      if (CURRENT_LINK_SUBMENU) {
         const PARENT_LABEL = document.querySelector(`[${labels.target}="${CURRENT_LINK_SUBMENU.id}"]`)
         const PARENT_MENU_ITEM = CURRENT_LINK_SUBMENU.closest(`[${labels.menuItem}]`)
         showContent(PARENT_MENU_ITEM, PARENT_LABEL, CURRENT_LINK_SUBMENU)
      }
   }

   /**
   --------------------------------------------------------------------------
   @method showHideSubmenu
   @desc - Show and hide submenu
   --------------------------------------------------------------------------
   */
   _showHideSubmenu () {
      const MENU_ITEMS = this.menuSelector.querySelectorAll(`[${labels.menuItem}]`)

      MENU_ITEMS.forEach(menuItem => {
         const HEADING = menuItem.querySelector("button")

         if (HEADING) {
            HEADING.addEventListener("click", () => {
               const RELATED_SUBMENU = document.getElementById(HEADING.getAttribute(labels.target))
               // if submenu is already open - close it on click and end function with return
               if (menuItem.hasAttribute(labels.openState)) {
                  if (this.mediaQueryDesktop.matches || this.closeActiveOnClick === true) {
                     hideContent(menuItem, HEADING, RELATED_SUBMENU)
                  }
                  return
               }
               collapseAll(this.menuSelector)
               showContent(menuItem, HEADING, RELATED_SUBMENU)
            })
         }
      })
   }

   /**
   --------------------------------------------------------------------------
   @method init
   @desc - Method to use to init your instance
   --------------------------------------------------------------------------
   */
   init () {
      if (this.onLoadcurrentMenuLink) {
         // option enable to open current element only on desktop (not in accordions view)
         if (this.hideCurrentOnMobile) {
            if (!this.mediaQueryDesktop.matches) this._openParent(this.onLoadcurrentMenuLink)
         } else {
            this._openParent(this.onLoadcurrentMenuLink)
         }
      }
      if (this.menuSelector) this._showHideSubmenu()
   }
}
