/**
--------------------------------------------------------------------------
  @class Four-Panel menu
  @desc A four panel menu that slides on mobile devices
  @author Ian Reid Langevin @3ejoueur
--------------------------------------------------------------------------
*/

import { labels } from "../labels"

export class MenuFourPanel {
   /**
   --------------------------------------------------------------------------
   @method constructor
   @param {string} elem - CSS selector - Wrapper of your menu
   --------------------------------------------------------------------------
   */

   constructor (elem, options) {
      const DEFAULT_OPTIONS = {
         currentLinkSelector: "[data-fn-uri=\"current\"]"
      }

      Object.assign(this, DEFAULT_OPTIONS, options)

      this.menuSelector = document.querySelector(elem)

      if (this.menuSelector) {
         // dom elements
         this.menuButtons = this.menuSelector.querySelectorAll(`[${labels.menuButton}]`)
         this.menuBackButtons = this.menuSelector.querySelectorAll(`[${labels.menuBack}]`)
         this.onLoadcurrentMenuLink = this.menuSelector.querySelector(this.currentLinkSelector)
      }
   }

   /**
   --------------------------------------------------------------------------
   @method _closeNotActiveSubmenus
   @desc - Close all submenus not in the clicked item parent tree
   --------------------------------------------------------------------------
   */
   _closeNotActiveSubmenus (btn) {
      const PARENTS_LIST = btn.closest(`[${labels.menuList}]`)
      const CHILD_LIST = PARENTS_LIST.querySelectorAll(`[${labels.menuList}]`)
      const CHILD_BUTTONS = PARENTS_LIST.querySelectorAll(`[${labels.menuButton}]`)
      CHILD_LIST.forEach(submenu => { submenu.removeAttribute(labels.openState) })
      CHILD_BUTTONS.forEach(childBtn => {
         childBtn.setAttribute("aria-expanded", false)
         childBtn.removeAttribute(labels.openState)
      })
   }

   /**
   --------------------------------------------------------------------------
   @method _openSubmenu
   @desc - Add class to the target submenu and set aria-expanded to the clicked item
   --------------------------------------------------------------------------
   */
   _openSubmenu (btn) {
      const TARGET_SUBMENU = document.getElementById(btn.getAttribute(labels.menuSubmenu))
      TARGET_SUBMENU.setAttribute(labels.openState, "")
      btn.setAttribute("aria-expanded", true)
      btn.setAttribute(labels.openState, "")
   }

   /**
   --------------------------------------------------------------------------
   @method _backButtonCloseSubmenu
   @desc - Action when user click back button
   --------------------------------------------------------------------------
   */

   _backButtonCloseSubmenu (backBtn) {
      const TARGET_SUBMENU = document.getElementById(backBtn.getAttribute(labels.menuSubmenu))
      const ANCESTOR_BUTTON = document.querySelector(`[${labels.menuBack}="${backBtn.getAttribute(labels.menuBack)}"]`)
      ANCESTOR_BUTTON.removeAttribute(labels.openState)
      TARGET_SUBMENU.removeAttribute(labels.openState)
   }

   /**
   --------------------------------------------------------------------------
   @method _openParentsTree
   @desc - Used on load to open the tree of menu by default
   --------------------------------------------------------------------------
   */
   _openParentsTree (elem) {
      const parents = []
      for (; elem && elem !== document; elem = elem.parentNode) {
         parents.push(elem)
      }
      if (parents) {
         parents.forEach(item => {
            if (item.hasAttribute(labels.menuList)) {
               item.setAttribute(labels.openState, "")
            } else if (item.hasAttribute(labels.menuItem)) {
               const menuParent = item.querySelector(`[${labels.menuButton}]`)
               if (menuParent) menuParent.setAttribute(labels.openState, "")
            }
         })
      }
   }

   /**
   --------------------------------------------------------------------------
   @method init
   --------------------------------------------------------------------------
   */
   init () {
      if (this.menuSelector) {
         // open current link tree if any
         if (this.onLoadcurrentMenuLink) this._openParentsTree(this.onLoadcurrentMenuLink)
         // menu button action
         if (this.menuButtons.length) {
            this.menuButtons.forEach(btn => {
               btn.addEventListener("click", () => {
                  if (btn.hasAttribute(labels.openState)) return // menu is already open - do nothing
                  this._closeNotActiveSubmenus(btn)
                  this._openSubmenu(btn)
               })
            })
         } else {
            console.warn("No menu buttons found, add data-navig-menu-button on your four-panel menu buttons")
         }
         // back button action
         if (this.menuBackButtons.length) {
            this.menuBackButtons.forEach(backBtn => {
               backBtn.addEventListener("click", () => { this._backButtonCloseSubmenu(backBtn) })
            })
         } else {
            console.warn("No BACK buttons found, add data-navig-back-button on buttons inside your submenu panels")
         }
      }
   }
}
