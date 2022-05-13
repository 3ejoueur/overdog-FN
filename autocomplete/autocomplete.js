/**
--------------------------------------------------------------------------
  @class Autocomplete
  @author Ian Reid Langevin @3ejoueur
--------------------------------------------------------------------------
*/

import { labels } from "../labels"

export class Autocomplete {
   /**
   --------------------------------------------------------------------------
   @method constructor
   @param {string} elem - CSS selector
   @param {integer} options.textLength - Integer - length before searching in the json
   @param {array} options.endpoints - Array of objects
   @param {array} options.fieldsToSearch - Array of your Craft CMS fields to search in JSON endpoint
   @param {object} options.cssClasses - Object with keys link (string) and highligth(string)
   --------------------------------------------------------------------------
  */
   constructor (elem, options) {
      const DEFAULT_OPTIONS = {
         textLength: 2,
         endpoints: null,
         cssClasses: {
            link: "block p-1 hover:bg-gray-[#e0e2e7] focus:bg-[#d7e4f4]",
            highlight: "font-bold text-[#084b83]"
         }
      }

      Object.assign(this, DEFAULT_OPTIONS, options)

      this.searchForm = document.querySelector(elem)

      if (this.searchForm) {
         this.inputWrapper = this.searchForm.querySelector(`[${labels.autocompleteWrapper}]`)
         this.inputField = this.searchForm.querySelector(`[${labels.autocompleteInput}]`)
         this.submitButton = this.searchForm.querySelector(`[${labels.autocompleteSubmit}]`)
         this.resultsDiv = this.searchForm.querySelector(`[${labels.autocompleteResults}]`)
         this.resultsDivInner = this.searchForm.querySelector(`[${labels.autocompleteResultsInner}]`)
         this.jsonUrl = window.location.origin + this.endpoints.find(element => element.langCode === document.documentElement.lang).slug
      }
   }

   /**
   --------------------------------------------------------------------------
   @method _initialCacheJson
   @desc Fetch json and add to sessionStorage
   --------------------------------------------------------------------------
   */
   async _initialCacheJson () {
      if (!sessionStorage.getItem(this.jsonUrl)) {
         await fetch(this.jsonUrl)
            .then(response => response.json())
            .then(json => {
               sessionStorage.setItem(this.jsonUrl, JSON.stringify(json))
            })
            .catch(error => { console.log("The json endpoint is not available. Fallback to a classic search.", error) })
      }
      this._showResultsDiv()
   }

   /**
   --------------------------------------------------------------------------
   @method handleEvent
   @param {event} event
   @desc Default event hub for init method
   --------------------------------------------------------------------------
   */
   handleEvent (event) {
      switch (event.type) {
      case "input": {
         const INPUT_VAL = event.target.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
         /**
            Set the length that you want before autocomplete is activated
         */
         if (this.inputField.value.length < this.textLength) {
            this._hideResultsDiv()
            this.submitButton.setAttribute("disabled", true)
            return
         }
         this.submitButton.removeAttribute("disabled")
         /**
            Find for the json in the localStorage Cache
         */
         const JSON_IN_LOCAL_STORAGE = sessionStorage.getItem(this.jsonUrl)
         if (!JSON_IN_LOCAL_STORAGE) {
            console.log("Sorry, no autocomplete results in your cache. Fallback to a classic search.")
            return
         }
         /**
            Create a JS object with Parse and find a match for the input in the response
         */
         const RESPONSE = JSON.parse(JSON_IN_LOCAL_STORAGE)
         const INPUT_VAL_REGEX = new RegExp(INPUT_VAL, "i")
         // check if a match in the json
         if (!RESPONSE) return
         const FIELDS_TO_SEARCH = Object.keys(RESPONSE.data[0])
         const RESULTS = RESPONSE.data.filter(obj => {
            let matchedValue
            FIELDS_TO_SEARCH.forEach(key => { matchedValue = obj[key].match(INPUT_VAL_REGEX) })
            return matchedValue
         })
         // if no match - empty the results html and end function
         if (RESULTS.length === 0) {
            this._hideResultsDiv()
            return
         }

         this.resultsDivInner.innerHTML = RESULTS.map(suggestion => {
            this._showResultsDiv()
            // only useful for highlight on input value
            const RETURNED_TITLE = suggestion.title.replace(INPUT_VAL_REGEX, `<span class="${this.cssClasses.highlight}">${INPUT_VAL}</span>`)
            return `<a class="${this.cssClasses.link}" href="${suggestion.url}?r=${INPUT_VAL}">${RETURNED_TITLE}</a>`
         }).join("")
      }
         break

      // close results div on click outside
      case "click":
         if (!(this.resultsDiv && this.inputField).contains(event.target)) {
            this.resultsDiv.style.display = "none"
         }
         break

      // results keyboard nav with arrow - trap focus
      case "keydown": {
         const FOCUSABLE_INPUTS = this.inputWrapper.querySelectorAll("input, a")
         const FOCUSABLE_INPUTS_ARRAY = [...FOCUSABLE_INPUTS]
         // get the index of current item
         const index = FOCUSABLE_INPUTS_ARRAY.indexOf(document.activeElement)
         // Create a variable to store the idex of next item to be focus
         let nextIndex = 0
         // up arrow
         if (event.key === "ArrowUp") {
            event.preventDefault()
            nextIndex = index > 0 ? index - 1 : 0
            FOCUSABLE_INPUTS[nextIndex].focus()
         } else if (event.key === "ArrowDown") {
            event.preventDefault()
            nextIndex = index + 1 < FOCUSABLE_INPUTS_ARRAY.length ? index + 1 : index
            FOCUSABLE_INPUTS[nextIndex].focus()
         }
      }
         break
      }
   }

   /**
   --------------------------------------------------------------------------
   @method _hideResultsDiv
   --------------------------------------------------------------------------
   */
   _hideResultsDiv () {
      this.resultsDivInner.innerHTML = ""
      this.resultsDiv.style.display = "none"
   }

   /**
   --------------------------------------------------------------------------
   @method _showResultsDiv
   --------------------------------------------------------------------------
   */
   _showResultsDiv () {
      this.resultsDiv.style.display = "block"
   }

   /**
   --------------------------------------------------------------------------
   @method init
   @desc Use this to init your class instance
   --------------------------------------------------------------------------
   */
   init () {
      if (this.searchForm) {
         if (this.inputField && this.resultsDiv && this.submitButton) {
            this.inputField.addEventListener("focusin", this._initialCacheJson.bind(this))
            this.inputField.addEventListener("input", this) // event handled by handleEvent()
            // focus and click outside
            document.addEventListener("keydown", this) // event handled by handleEvent()
            document.addEventListener("click", this) // event handled by handleEvent()
         } else {
            console.error("Hey, an element with data-fn-autocomplete is missing in your HTML structure, take a look at the example template.")
         }
      }
   }
}
