/**
--------------------------------------------------------------------------
  @async Fetch function for multiple or single filter
  @author Ian Reid Langevin
--------------------------------------------------------------------------
*/

import { labels } from "../labels.js"

export async function fetchContent (href, divIds) {
   document.body.setAttribute(labels.loadingState, "")

   const RESPONSE = await fetch(href)

   if (RESPONSE.ok) {
      const DATA = await RESPONSE.text()
      const PARSER = new DOMParser()
      const DOC = PARSER.parseFromString(DATA, "text/html")
      // Get content to replace
      divIds.forEach(id => {
      // Get the actual html
         const ACTUAL_CONTENT = document.getElementById(id)
         // Get the external html
         const FETCHED_CONTENT = DOC.getElementById(id)
         if (FETCHED_CONTENT) {
            // replace data-src on images - lazyload - will be optimize in future
            FETCHED_CONTENT.querySelectorAll("[loading=\"lazy\"]").forEach(img => {
               img.srcset = img.dataset.srcset
               img.src = img.dataset.src
            })
            // replace the actual content in the current page with the new one
            ACTUAL_CONTENT.innerHTML = FETCHED_CONTENT.innerHTML
         }
      })
   }

   document.body.removeAttribute(labels.loadingState)
}
