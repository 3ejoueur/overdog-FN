/**
--------------------------------------------------------------------------
  Show and hide overlay functions
  @author Ian Reid Langevin
--------------------------------------------------------------------------
*/

export { showOverlay, hideAllOverlay }

/**
   --------------------------------------------------------------------------
   @method _showOverlay
   --------------------------------------------------------------------------
   */
function showOverlay (overlay, openAttribute = "data-fn-is-open") {
   if (overlay) {
      overlay.style.display = "block"
      setTimeout(() => { overlay.setAttribute(openAttribute, "") }, 20)
   }
}

/**
--------------------------------------------------------------------------
   @method _hideAllOverlay
--------------------------------------------------------------------------
*/
function hideAllOverlay (openAttribute = "data-fn-is-open") {
   const OVERLAYS = document.querySelectorAll("[data-fn-overlay]")
   if (OVERLAYS) {
      OVERLAYS.forEach(overlay => {
         overlay.removeAttribute(openAttribute)
         overlay.addEventListener("transitionend", () => {
            if (!overlay.hasAttribute(openAttribute)) overlay.style.display = "none"
         })
      })
   }
}
