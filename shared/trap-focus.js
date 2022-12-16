/**
--------------------------------------------------------------------------
   @function trapFocus
   @param {HTMLElement} elem - Dom element
   @param {Boolean} focusOnFirstFocusable - Boolean
--------------------------------------------------------------------------
*/

export function trapFocus (elem, focusOnFirstFocusable = true) {
   const focusableElements = "button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])"
   const focusableContent = elem.querySelectorAll(focusableElements)
   const lastFocusableElement = focusableContent[focusableContent.length - 1]
   const firstFocusableElement = elem.querySelectorAll(focusableElements)[0]

   if (focusOnFirstFocusable === true) firstFocusableElement.focus() // set focus inside modal on first element

   document.addEventListener("keydown", event => {
      if (!(event.key === "Tab")) {
         return
      }
      // if shift key pressed for shift + tab combination to go back
      if (event.shiftKey) {
         if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus()
            event.preventDefault()
         }
         return
      }
      // regular tab nav
      if (document.activeElement === lastFocusableElement) {
         firstFocusableElement.focus()
         event.preventDefault()
      }
   })
}
