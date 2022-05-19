/**
--------------------------------------------------------------------------
  Show and hide overlay functions
  @author Ian Reid Langevin @3ejoueur
--------------------------------------------------------------------------
*/

import { labels } from "../labels.js"
export { showOverlay, hideAllOverlay }

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
   @method _hideAllOverlay
--------------------------------------------------------------------------
*/
function hideAllOverlay () {
   const OVERLAYS = document.querySelectorAll(`[${labels.overlay}]`)
   if (OVERLAYS) {
      OVERLAYS.forEach(overlay => {
         overlay.removeAttribute(labels.openState)
         overlay.addEventListener("transitionend", () => {
            if (!overlay.hasAttribute(labels.openState)) overlay.style.display = "none"
         })
      })
   }
}
