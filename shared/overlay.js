/**
--------------------------------------------------------------------------
  Show and hide overlay functions
  @author Ian Reid Langevin @3ejoueur
--------------------------------------------------------------------------
*/

import { labels } from "../labels.js"
export { showOverlay, hideOverlay }

/**
   --------------------------------------------------------------------------
   @method _showOverlay
   --------------------------------------------------------------------------
   */
function showOverlay (overlay) {
   if (overlay) {
      overlay.style.display = "block"
      setTimeout(() => { overlay.setAttribute(labels.openState, "") }, 20)
   }
}

/**
   --------------------------------------------------------------------------
    @method hideOverlay
    @note transitionend check for activeClass to only run in one way
   --------------------------------------------------------------------------
   */
function hideOverlay (overlay) {
   if (overlay) {
      overlay.removeAttribute(labels.openState)
      overlay.addEventListener("transitionend", () => {
         if (!overlay.hasAttribute(labels.openState)) overlay.style.display = "none"
      })
   }
}
