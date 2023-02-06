/**
--------------------------------------------------------------------------
  @async Fetch function for multiple or single filter
  @author Ian Reid Langevin
--------------------------------------------------------------------------
*/

import { renameDataSet } from "../lazyload/images"

export async function fetchContent (href, divIds, loadingAttribute = "data-fn-is-loading") {
   document.body.setAttribute(loadingAttribute, "")

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
            FETCHED_CONTENT.querySelectorAll("[loading=\"lazy\"]").forEach(element => { renameDataSet(element) })
            // replace the actual content in the current page with the new one
            ACTUAL_CONTENT.innerHTML = FETCHED_CONTENT.innerHTML
         }
      })
   }

   document.body.removeAttribute(loadingAttribute)
}
