/**
--------------------------------------------------------------------------
  @class MenuFourPanel
  @author Ian Reid Langevin
--------------------------------------------------------------------------
*/

export class MenuFourPanel {
   /**
   --------------------------------------------------------------------------
   @method constructor
   @param {string} elem - CSS selector - Wrapper of your menu
   @param {string} options.currentLinkSelector
   --------------------------------------------------------------------------
   */

   constructor (elem, options) {
      const DEFAULT_OPTIONS = {
         currentLinkSelector: "[data-fn-uri=\"current\"]",
         attributes: {}
      }

      const DEFAULT_ATTRIBUTES = {
         openState: "data-fn-is-open",
         menuItem: "data-fn-menu-item",
         menuList: "data-fn-menu-list",
         menuSubmenu: "data-fn-submenu",
         menuButton: "data-fn-menu-button",
         menuBack: "data-fn-menu-back"
      }

      // Assign default options to this.options
      Object.assign(this, DEFAULT_OPTIONS, options)
      // Merge in a new object the default attributes names and the custom ones
      this.attr = Object.assign({}, DEFAULT_ATTRIBUTES, this.attributes)

      this.menuSelector = document.querySelector(elem)

      if (this.menuSelector) {
         this.menuButtons = this.menuSelector.querySelectorAll(`[${this.attr.menuButton}]`)
         this.menuBackButtons = this.menuSelector.querySelectorAll(`[${this.attr.menuBack}]`)
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
      const PARENTS_LIST = btn.closest(`[${this.attr.menuList}]`)
      const CHILD_LIST = PARENTS_LIST.querySelectorAll(`[${this.attr.menuList}]`)
      const CHILD_BUTTONS = PARENTS_LIST.querySelectorAll(`[${this.attr.menuButton}]`)
      CHILD_LIST.forEach(submenu => { submenu.removeAttribute(this.attr.openState) })
      CHILD_BUTTONS.forEach(childBtn => {
         childBtn.setAttribute("aria-expanded", false)
         childBtn.removeAttribute(this.attr.openState)
      })
   }

   /**
   --------------------------------------------------------------------------
   @method _openSubmenu
   @desc - Add class to the target submenu and set aria-expanded to the clicked item
   --------------------------------------------------------------------------
   */
   _openSubmenu (btn) {
      const TARGET_SUBMENU = document.getElementById(btn.getAttribute(this.attr.menuSubmenu))
      TARGET_SUBMENU.setAttribute(this.attr.openState, "")
      btn.setAttribute("aria-expanded", true)
      btn.setAttribute(this.attr.openState, "")
   }

   /**
   --------------------------------------------------------------------------
   @method _backButtonCloseSubmenu
   @desc - Action when user click back button
   --------------------------------------------------------------------------
   */

   _backButtonCloseSubmenu (backBtn) {
      const TARGET_SUBMENU = document.getElementById(backBtn.getAttribute(this.attr.menuSubmenu))
      const ANCESTOR_BUTTON = document.getElementById(backBtn.getAttribute(this.attr.menuBack))
      ANCESTOR_BUTTON.removeAttribute(this.attr.openState)
      TARGET_SUBMENU.removeAttribute(this.attr.openState)
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
            if (item.hasAttribute(this.attr.menuList)) {
               item.setAttribute(this.attr.openState, "")
            } else if (item.hasAttribute(this.attr.menuItem)) {
               const menuParent = item.querySelector(`[${this.attr.menuButton}]`)
               if (menuParent) menuParent.setAttribute(this.attr.openState, "")
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
                  if (btn.hasAttribute(this.attr.openState)) return // menu is already open - do nothing
                  this._closeNotActiveSubmenus(btn)
                  this._openSubmenu(btn)
               })
            })
         } else {
            console.warn(`No menu buttons found, add ${this.menuButton} on your four-panel menu buttons`)
         }
         // back button action
         if (this.menuBackButtons.length) {
            this.menuBackButtons.forEach(backBtn => {
               backBtn.addEventListener("click", () => { this._backButtonCloseSubmenu(backBtn) })
            })
         } else {
            console.warn(`No BACK buttons found, add ${this.menuBack} on buttons inside your submenu panels`)
         }
      }
   }
}
