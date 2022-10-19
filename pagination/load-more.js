/**
--------------------------------------------------------------------------
  @class Single choice filter for Craft CMS
  @author Ian Reid Langevin
--------------------------------------------------------------------------
*/

import { labels } from "../labels.js"

export class LoadMore {
   /**
   --------------------------------------------------------------------------
   @method constructor
   @param {string} elem - CSS selector
   @param {array} options.loadMoreButtonId - ID of the load more button
   --------------------------------------------------------------------------
  */

   constructor (elem, options) {
      const DEFAULT_OPTIONS = {
         loadMoreButtonId: "load-more-button"
      }
      Object.assign(this, DEFAULT_OPTIONS, options)
      this.pagesWrapper = document.querySelector(elem)
      this.buttonNode = document.getElementById(this.loadMoreButtonId)
   }

   _createUrl (nextPage) {
      const PARAMS = new URLSearchParams(window.location.search)
      PARAMS.set("page", nextPage)
      const URL = (window.location.href.split("?")[0] + "?" + PARAMS.toString())
      return URL
   }

   async _fetchContent (href, divToGet) {
      // get the created values filter url and fetch the html
      document.body.setAttribute(labels.loadingState, "")
      const RESPONSE = await fetch(href)
      if (RESPONSE.ok) {
         // get response in text for html
         const DATA = await RESPONSE.text()
         const PARSER = new DOMParser()
         const DOC = PARSER.parseFromString(DATA, "text/html")
         const FETCHED_DIV = DOC.querySelector(divToGet)
         // check if the loadMore button is present on the fetched URL
         const HAS_BUTTON = !!DOC.getElementById(this.loadMoreButtonId)
         // replace data-src on images - lazyload - will be remove in future
         FETCHED_DIV.querySelectorAll("[loading=\"lazy\"]").forEach(img => {
            img.srcset = img.dataset.srcset
            img.src = img.dataset.src
         })
         // append to wrapper div
         this.pagesWrapper.appendChild(FETCHED_DIV)
         // remove button from dom if not present on the fetched URL
         if (!HAS_BUTTON) this.buttonNode.remove()
      }
      document.body.removeAttribute(labels.loadingState)
   }

   /**
   --------------------------------------------------------------------------
   @method init
   --------------------------------------------------------------------------
   */
   init () {
      if (this.pagesWrapper && this.buttonNode) {
         // Hard refresh when browser back button is pressed to refresh the listing
         window.addEventListener("popstate", () => { window.location.href = window.location })
         this.buttonNode.addEventListener("click", (event) => {
            event.preventDefault()
            const CURRENT_PAGE = this.pagesWrapper.lastElementChild
            const NEXT_PAGE = parseInt(CURRENT_PAGE.getAttribute("data-fn-load-more-page")) + 1
            const DIV_TO_FETCH = `[${labels.loadMorePage}='${NEXT_PAGE}']`
            const HREF = this._createUrl(NEXT_PAGE)
            history.pushState(null, null, HREF)
            this._fetchContent(HREF, DIV_TO_FETCH)
         })
      }
   }
}
