/**
--------------------------------------------------------------------------
  @class Modal with overlay background
  @author Ian Reid Langevin
--------------------------------------------------------------------------
*/

import { showOverlay, hideAllOverlay } from "../shared/overlay"
import { trapFocus } from "../shared/trap-focus"

export class Modal {
   /**
    elem
    @param {string} the button class to open modal - Multiple CSS selectors
    options
    @param {string} overlaySelector - CSS selector
    @param {string} focusOnFirstFocusable - Boolean
  */

   constructor (elem, options) {
      const DEFAULT_OPTIONS = {
         overlaySelector: "#overlay",
         focusOnFirstFocusable: true,
         attributes: {}
      }

      const DEFAULT_ATTRIBUTES = {
         openState: "data-fn-is-open",
         modalButton: "data-fn-modal-button",
         modalBox: "data-fn-modal-box",
         modalClose: "data-fn-modal-close",
         target: "data-fn-target"
      }

      // Assign default options to this.options
      Object.assign(this, DEFAULT_OPTIONS, options)
      // Merge in a new object the default attributes names and the custom ones
      this.attr = Object.assign({}, DEFAULT_ATTRIBUTES, this.attributes)

      this.modalOpenButtons = document.querySelectorAll(elem)
      this.overlay = document.querySelector(this.overlaySelector)
   }

   /**
   --------------------------------------------------------------------------
   @method _openModal
   --------------------------------------------------------------------------
   */
   _openModal (eventTarget, targetModal) {
      eventTarget.setAttribute("aria-expanded", true)
      eventTarget.setAttribute(this.attr.openState, "")
      if (targetModal) {
         targetModal.setAttribute(this.attr.openState, "")
         if (this.overlay) showOverlay(this.overlay, this.attr.openState)
         trapFocus(targetModal, this.focusOnFirstFocusable)
      }
   }

   /**
   --------------------------------------------------------------------------
   @method _closeModal
   --------------------------------------------------------------------------
   */
   _closeModal () {
      const OPEN_MODAL = document.querySelector(`[${this.attr.modalBox}][${this.attr.openState}]`)
      const OPEN_BUTTON = document.querySelector(`[${this.attr.modalButton}][${this.attr.openState}]`)
      // open button
      if (OPEN_BUTTON) {
         OPEN_BUTTON.removeAttribute(this.attr.openState)
         OPEN_BUTTON.setAttribute("aria-expanded", false)
         OPEN_BUTTON.focus() // reset focus to the modal open button
      }
      if (OPEN_MODAL) OPEN_MODAL.removeAttribute(this.attr.openState)
      if (this.overlay) hideAllOverlay(this.attr.openState)
   }

   /**
   --------------------------------------------------------------------------
    @method init
   --------------------------------------------------------------------------
   */
   init () {
      if (this.modalOpenButtons) {
         this.modalOpenButtons.forEach(modalButton => {
            const TARGET_MODAL = document.getElementById(modalButton.getAttribute(this.attr.target))
            const CLOSE_BUTTON = TARGET_MODAL.querySelector(`[${this.attr.modalClose}]`)

            modalButton.addEventListener("click", (event) => {
               this._openModal(event.target, TARGET_MODAL)
            })

            if (CLOSE_BUTTON) {
               CLOSE_BUTTON.addEventListener("click", (event) => { this._closeModal() })
            }
         })
         document.addEventListener("keydown", event => { if (event.key === "Escape") { this._closeModal() } })
      }
      if (this.overlay) this.overlay.addEventListener("click", () => { this._closeModal() })
   }
}
