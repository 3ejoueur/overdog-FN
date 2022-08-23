/**
--------------------------------------------------------------------------
  @class Autocomplete
  @author Ian Reid Langevin
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
   ( important if you do not want to search in all fields returned in your endpoint )
   @param {string} options.fieldToHighlight - Key in your data that is highlight
   @param {string} options.highlightClasses - CSS classes for the highlight span tag
   --------------------------------------------------------------------------
  */
   constructor (elem, options) {
      const DEFAULT_OPTIONS = {
         textLength: 2,
         endpoints: null,
         fieldsToSearch: ["title", "url", "titleToAscii"],
         fieldToHighlight: "title",
         highlightClasses: "font-bold text-[#084b83]"
      }

      Object.assign(this, DEFAULT_OPTIONS, options)

      this.searchForm = document.querySelector(elem)

      if (this.searchForm) {
         this.inputWrapper = this.searchForm.querySelector(`[${labels.autocompleteWrapper}]`)
         this.inputField = this.searchForm.querySelector(`[${labels.autocompleteInput}]`)
         this.submitButton = this.searchForm.querySelector(`[${labels.autocompleteSubmit}]`)
         this.resultsDiv = this.searchForm.querySelector(`[${labels.autocompleteResults}]`)
         this.resultsDivInner = this.searchForm.querySelector(`[${labels.autocompleteResultsInner}]`)
         this.suggestionTemplate = document.querySelector(`[${labels.autocompleteTemplate}]`)
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

         // Set the length that you want before autocomplete is activated
         if (this.inputField.value.length < this.textLength) {
            this._hideResultsDiv()
            this.submitButton.setAttribute("disabled", true)
            return
         }
         this.submitButton.removeAttribute("disabled")

         // Find for the json in the localStorage Cache
         const JSON_IN_LOCAL_STORAGE = sessionStorage.getItem(this.jsonUrl)
         if (!JSON_IN_LOCAL_STORAGE) {
            console.log("No autocomplete results in your local storage cache. Fallback to a classic search.")
            return
         }

         // Create a JS object with Parse
         const RESPONSE = JSON.parse(JSON_IN_LOCAL_STORAGE)
         if (!RESPONSE) return
         const INPUT_VAL_REGEX = new RegExp(INPUT_VAL, "i")
         // Search in the this.fieldsToSearch option - keys must match your json endpoint
         const RESULTS = RESPONSE.data.filter(obj => {
            let matchedValue = ""
            this.fieldsToSearch.forEach(key => {
               if (obj[key]) matchedValue = obj[key].match(INPUT_VAL_REGEX)
            })
            return matchedValue
         })

         // If no match - empty the results html and end function
         if (RESULTS.length === 0) {
            this._hideResultsDiv()
            return
         }

         // Create the suggestion content
         const SUGGESTION_HTML = this._createSuggestionNode(RESULTS, INPUT_VAL_REGEX, INPUT_VAL)
         this.resultsDivInner.innerHTML = SUGGESTION_HTML
         this._showResultsDiv()
      }
         break

      // Close results div on click outside
      case "click":
         if (!(this.resultsDiv && this.inputField).contains(event.target)) {
            this.resultsDiv.style.display = "none"
         }
         break

      // Results keyboard nav with arrow - trap focus
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
   @method _createSuggestionNode
   --------------------------------------------------------------------------
   */
   _createSuggestionNode (results, inputValueRegex, inputValue) {
      const HTML = results.map(item => {
         const TEMPLATE_CLONE = this.suggestionTemplate.cloneNode(true)
         let SUGGESTION_STRING = TEMPLATE_CLONE.innerHTML.toString()
         const PLACEHOLDERS = SUGGESTION_STRING.match(/\$(.*?)\$/g)

         if (this.fieldToHighlight) item[this.fieldToHighlight].replace(inputValueRegex, `<span class="${this.highlightClasses}">${inputValue}</span>`)

         PLACEHOLDERS.forEach(placeholder => {
            // placeholder - $title$
            const STRIPPED_KEY = placeholder.substring(1, placeholder.length - 1)
            // STRIPPED_KEY = title
            if (item[STRIPPED_KEY]) {
               const NEW_VALUE = STRIPPED_KEY === this.fieldToHighlight ? item[this.fieldToHighlight].replace(inputValueRegex, `<span class="${this.highlightClasses}">${inputValue}</span>`) : item[STRIPPED_KEY]
               SUGGESTION_STRING = SUGGESTION_STRING.replace(placeholder, NEW_VALUE)
            }
         })

         return SUGGESTION_STRING
      }).join("")

      return HTML
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
         // console message management
         if (!this.inputField) {
            console.warn(`Overdog Autocomplete - A input with the ${labels.autocompleteInput} attribute is missing in your template`)
            return
         }
         if (!this.resultsDiv) {
            console.warn(`Overdog Autocomplete - A div with the ${labels.autocompleteResults} attribute is missing in your template`)
            return
         }
         if (!this.submitButton) {
            console.warn(`Overdog Autocomplete - A button with the ${labels.autocompleteSubmit} attribute is missing in your template`)
            return
         }
         if (!this.resultsDivInner) {
            console.warn(`Overdog Autocomplete - A div with the ${labels.autocompleteResultsInner} attribute is missing in your template`)
            return
         }
         if (!this.suggestionTemplate) {
            console.warn(`Overdog Autocomplete - A template tag with the ${labels.suggestionTemplate} attribute is missing in your template`)
            return
         }
         // events listeners
         this.inputField.addEventListener("focusin", this._initialCacheJson.bind(this))
         this.inputField.addEventListener("input", this)
         document.addEventListener("keydown", this)
         document.addEventListener("click", this)
      }
   }
}
