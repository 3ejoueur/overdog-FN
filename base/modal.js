/**
--------------------------------------------------------------------------
  @class Modal with overlay or blurred background
  @classdesc Modal class function with some options - see docs
  @author Ian Reid Langevin
--------------------------------------------------------------------------
*/

import { showOverlay, hideAllOverlay } from "../shared/overlay"
import { labels } from "../labels"
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
         focusOnFirstFocusable: true
      }

      Object.assign(this, DEFAULT_OPTIONS, options)

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
      eventTarget.setAttribute(labels.openState, "")
      if (targetModal) {
         targetModal.setAttribute(labels.openState, "")
         if (this.overlay) showOverlay(this.overlay)
         trapFocus(targetModal, this.focusOnFirstFocusable)
      }
   }

   /**
   --------------------------------------------------------------------------
   @method _closeModal
   --------------------------------------------------------------------------
   */
   _closeModal () {
      const OPEN_MODAL = document.querySelector(`[${labels.modalBox}][${labels.openState}]`)
      const OPEN_BUTTON = document.querySelector(`[${labels.modalButton}][${labels.openState}]`)
      // open button
      if (OPEN_BUTTON) {
         OPEN_BUTTON.removeAttribute(labels.openState)
         OPEN_BUTTON.setAttribute("aria-expanded", false)
         OPEN_BUTTON.focus() // reset focus to the modal open button
      }
      if (OPEN_MODAL) OPEN_MODAL.removeAttribute(labels.openState)
      if (this.overlay) hideAllOverlay()
   }

   /**
   --------------------------------------------------------------------------
    @method init
   --------------------------------------------------------------------------
   */
   init () {
      if (this.modalOpenButtons) {
         this.modalOpenButtons.forEach(modalButton => {
            const TARGET_MODAL = document.getElementById(modalButton.getAttribute(labels.target))
            const CLOSE_BUTTON = TARGET_MODAL.querySelector(`[${labels.modalClose}]`)

            modalButton.addEventListener("click", (event) => {
               this._openModal(event.target, TARGET_MODAL)
            })

            if (CLOSE_BUTTON) {
               CLOSE_BUTTON.addEventListener("click", (event) => { this._closeModal() })
            }
         })
         // Close modal on escape touch
         document.addEventListener("keydown", event => { if (event.key === "Escape") { this._closeModal() } })
      }

      if (this.overlay) this.overlay.addEventListener("click", () => { this._closeModal() })
   }
}
