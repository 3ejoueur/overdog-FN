/**
--------------------------------------------------------------------------
  Collapse functions
  @author Ian Reid Langevin @3ejoueur
--------------------------------------------------------------------------
*/

import { labels } from "../labels.js"
export { showContent, hideContent, collapseAll }
/*
  Show function
*/
function showContent (accordion, heading, targetContent) {
   targetContent.style.height = targetContent.scrollHeight + "px"
   accordion.setAttribute(labels.openState, "")
   heading.setAttribute("aria-expanded", true)
   // Set height to auto for resizing or dynamic height change after on transition end
   targetContent.addEventListener("transitionend", () => {
      if (accordion.hasAttribute(labels.openState)) {
         targetContent.style.height = "auto"
      }
   })
}
/*
  Hide function
*/
function hideContent (accordion, heading, targetContent) {
   targetContent.style.height = targetContent.scrollHeight + "px"
   accordion.removeAttribute(labels.openState)
   heading.setAttribute("aria-expanded", false)
   // wait for height from auto to the scrollHeight, and then reset to 0 for smooth transition
   setTimeout(() => { targetContent.style.height = 0 }, 30)
}
/*
  Reset function - Used by the alternate mode
*/
function collapseAll (item) {
   const OPEN_ACCORDIONS = item.querySelectorAll(`[${labels.openState}]`)
   if (OPEN_ACCORDIONS) {
      OPEN_ACCORDIONS.forEach(accordion => {
         const HEADING = accordion.querySelector("button")
         const OPEN_TARGET = document.getElementById(HEADING.getAttribute(labels.target))
         hideContent(accordion, HEADING, OPEN_TARGET)
      })
   }
}
