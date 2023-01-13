/**
--------------------------------------------------------------------------
  @class MultipleFilters
  @author Ian Reid Langevin
--------------------------------------------------------------------------
*/

import { fetchContent } from "./fetch-content"
import { labels } from "../labels.js"

export class MultipleFilters {
   /**
   --------------------------------------------------------------------------
   @method constructor
   @param {string} elem - CSS selector
   @param {array} options.divIds - Array of ID to replace from the fetch url
   @param {boolean} options.fetchOnlyOnSubmit - Set true if you want to use a submit button to fetch content
   @param {string} options.clearAllButtonId - ID of the clear all button - optionnal
    @param {string} options.paramToRemove - Param in URL that you want to remove on change (ex:a load more pagination)
   @param {Regex} options.regexToRemove - Regex Expression to remove from URL on filter events
   --------------------------------------------------------------------------
  */
   constructor (elem, options) {
      const DEFAULT_OPTIONS = {
         divIds: ["listing"],
         fetchOnlyOnSubmit: false,
         clearAllButtonId: null,
         paramToRemove: null,
         regexToRemove: /\/p[0-9]+/
      }
      Object.assign(this, DEFAULT_OPTIONS, options)

      this.filtersWrapper = document.querySelector(elem)

      if (this.filtersWrapper) this.groupsListDataArray = this._getGroupsData()
      if (this.clearAllButtonId) this.clearAllButtonEl = document.getElementById(this.clearAllButtonId)
   }

   /**
   --------------------------------------------------------------------------
   @method _getGroupsData
   @desc - Get the urlName and the inputs for each group in filter
   --------------------------------------------------------------------------
   */
   _getGroupsData () {
      const GROUP_LIST = this.filtersWrapper.querySelectorAll(`[${labels.filterGroup}]`)
      const GROUPS_LIST_DATA = []
      GROUP_LIST.forEach(group => {
         const GROUP_DATA = {}
         GROUP_DATA.urlName = group.getAttribute(labels.filterGroup)
         GROUP_DATA.inputs = group.querySelectorAll("input")
         GROUPS_LIST_DATA.push(GROUP_DATA)
      })
      return GROUPS_LIST_DATA
   }

   /**
   --------------------------------------------------------------------------
   @method handleEvent
   @desc - Main event handling
   --------------------------------------------------------------------------
   */
   handleEvent (event) {
      let getValue = true
      let href = ""
      let fetchContentAfterEvent = !this.fetchOnlyOnSubmit

      switch (event.type) {
      // event type used by radio buttons, checkboxes, etc
      case "change":
         /*
          If the event target for change is a search or text input, do nothing.
          This allow a custom event listener like keyUp or submit on the search field
          while keeping a single change listener on all the groups.
        */
         if (event.target.type === "search" || event.target.type === "text") {
            getValue = false
            return
         }
         break
      // event type used with text or search fields
      case "submit":
         event.preventDefault()
         fetchContentAfterEvent = true // always true for submit
         break
      // reset event type is used to remove text from search input
      case "reset":
         event.target.querySelector("input").value = ""
         break
      // click event is used for clear all button - reset everything
      case "click": {
         const CHECKED_INPUTS = this.filtersWrapper.querySelectorAll("input:checked")
         const TEXT_INPUTS = this.filtersWrapper.querySelectorAll("input[type=\"text\"], input[type=\"search\"]")

         CHECKED_INPUTS.forEach(input => { input.checked = false })
         TEXT_INPUTS.forEach(input => { input.value = "" })
         break
      }
      }
      // create URL and fetch content
      if (getValue) {
         href = this._createUrl()
         history.pushState(null, null, href)
      }
      if (fetchContentAfterEvent) fetchContent(href, this.divIds)
   }

   /**
   --------------------------------------------------------------------------
   @method _createUrl
   @desc - Get the values from all group inputs, update address bar and fetch content
   --------------------------------------------------------------------------
   */
   _createUrl () {
      // get the params from the menu bar
      const PARAMS = new URLSearchParams(window.location.search)

      this.groupsListDataArray.forEach(group => {
         const GROUP_INPUTS_VALUES = [] // if multiple options selected

         group.inputs.forEach(input => {
            switch (input.type) {
            case "search":
            case "text" :
               if (input.value.length > 0) GROUP_INPUTS_VALUES.push(input.value)
               break
            case "radio":
            case "checkbox":
               if (input.checked === true) GROUP_INPUTS_VALUES.push(input.value)
               break
            case "hidden":
               GROUP_INPUTS_VALUES.push(input.value)
            }
         })
         // Remove param already in URL (if set)
         if (this.paramToRemove) PARAMS.delete(this.paramToRemove)
         // Set new params from filter group and delete empty ones
         if (GROUP_INPUTS_VALUES.length > 0) {
            PARAMS.set(group.urlName, GROUP_INPUTS_VALUES)
         } else {
            PARAMS.delete(group.urlName)
         }
      })
      // the regex allow to remove anything from the address bar, for example, a pagination
      const URL = (window.location.href.replace(this.regexToRemove, "").split("?")[0] + "?" + PARAMS.toString())

      return URL
   }

   /**
   --------------------------------------------------------------------------
   @method init
   --------------------------------------------------------------------------
   */
   init () {
      if (this.filtersWrapper) {
      // hard refresh when browser back button is pressed to refresh the listing
         window.addEventListener("popstate", () => { window.location.href = window.location })
         // on input change function
         this.filtersWrapper.addEventListener("change", this)
         // eventlisteners for submit button or reset search field - useful if you have a hidden input with submit too
         this.filtersWrapper.addEventListener("submit", this)
         this.filtersWrapper.addEventListener("reset", this)
         // eventlisteners on clear button only if not null in options
         if (this.clearAllButtonEl) this.clearAllButtonEl.addEventListener("click", this)
      }
   }
}
