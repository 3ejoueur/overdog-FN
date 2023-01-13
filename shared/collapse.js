/**
--------------------------------------------------------------------------
  Collapse functions
  @author Ian Reid Langevin
--------------------------------------------------------------------------
*/

export { showContent, hideContent, collapseAll, openAll }

/**
--------------------------------------------------------------------------
   @function showContent
   @param {HTMLElement} accordion - Dom element
   @param {HTMLElement} heading - Dom element
   @param {HTMLElement} targetContent - Dom element
--------------------------------------------------------------------------
*/
function showContent (accordion, heading, targetContent, openAttribute = "data-fn-is-open") {
   targetContent.style.height = targetContent.scrollHeight + "px"
   accordion.setAttribute(openAttribute, "")
   heading.setAttribute("aria-expanded", true)
   // Set height to auto for resizing or dynamic height change after on transition end
   targetContent.addEventListener("transitionend", () => {
      if (accordion.hasAttribute(openAttribute)) {
         targetContent.style.height = "auto"
      }
   })
}

/**
--------------------------------------------------------------------------
   @function hideContent
   @param {HTMLElement} accordion - Dom element
   @param {HTMLElement} heading - Dom element
   @param {HTMLElement} targetContent - Dom element
--------------------------------------------------------------------------
*/
function hideContent (accordion, heading, targetContent, openAttribute = "data-fn-is-open") {
   targetContent.style.height = targetContent.scrollHeight + "px"
   accordion.removeAttribute(openAttribute)
   heading.setAttribute("aria-expanded", false)
   // wait for height from auto to the scrollHeight, and then reset to 0 for smooth transition
   setTimeout(() => { targetContent.style.height = 0 }, 30)
}

/**
--------------------------------------------------------------------------
   @function collapseAll
   @desc clopse all accordions
   @param {HTMLElement} wrapper - Dom element
--------------------------------------------------------------------------
*/
function collapseAll (item, targetAttribute = "data-fn-target", openAttribute = "data-fn-is-open") {
   const OPEN_ACCORDIONS = item.querySelectorAll(`[${openAttribute}]`)
   if (OPEN_ACCORDIONS) {
      OPEN_ACCORDIONS.forEach(accordion => {
         const HEADING = accordion.querySelector("button")
         const OPEN_TARGET = document.getElementById(HEADING.getAttribute(targetAttribute))
         hideContent(accordion, HEADING, OPEN_TARGET, openAttribute)
      })
   }
}

/**
--------------------------------------------------------------------------
   @function openAll
   @desc Open all accordions
   @note Not used by FN but available as stand alone function
   @param {HTMLElement} wrapper - Dom element
--------------------------------------------------------------------------
*/
function openAll (wrapper, attributes = { openAttribute: "data-fn-is-open", accordions: "data-fn-accordion", target: "data-fn-target" }) {
   const CLOSED_ACCORDIONS = wrapper.querySelectorAll(`[${attributes.accordions}]`)
   if (CLOSED_ACCORDIONS) {
      CLOSED_ACCORDIONS.forEach(accordion => {
         const HEADING = accordion.querySelector("button")
         const TARGET_CONTENT = document.getElementById(HEADING.getAttribute(attributes.target))
         showContent(accordion, HEADING, TARGET_CONTENT, attributes.openAttribute)
      })
   }
}
