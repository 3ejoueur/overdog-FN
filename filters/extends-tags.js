/**
--------------------------------------------------------------------------
@class MultipleFiltersWithTags for Craft CMS
@classdesc MultipleFiltersWithTags extends MultipleFilters class to add tags for filters
@author Ian Reid Langevin @3ejoueur
--------------------------------------------------------------------------
*/

import { MultipleFilters } from "./multiple-filters"
import { fetchContent } from "./fetch-content"
import { labels } from "../labels.js"

export class MultipleFiltersWithTags extends MultipleFilters {
   constructor (elem, options) {
      super(elem, options)
      // use this.priceform to query element to scope it to the tab
      if (this.filtersWrapper) {
         this.allTags = this.filtersWrapper.querySelectorAll(`[${labels.tagId}]`)
         this.tagTemplate = document.querySelector(`[${labels.tagTemplate}]`) // the template to use for tags
      }
   }

   /**
   --------------------------------------------------------------------------
   @method _getGroupsData
   @param  {} input
   @desc - Create tag if input is checked
   --------------------------------------------------------------------------
   */
   _createTag (input) {
      if (!input.checked) {
         const RELATED_TAG = document.querySelector(`[${labels.tagId}="${input.id}"]`)
         // removeEventListener first to avoid keeping in memory
         RELATED_TAG.removeEventListener("click", this._removeTag, true)
         RELATED_TAG.remove()
         return
      }
      const TAG_TEMPLATE_CLONE = document.importNode(this.tagTemplate.content, true)
      const RELATED_TAGS_ROW = document.getElementById(input.getAttribute(labels.tagRow))
      // get data-attribute from the clone and it child div
      const NEW_TAG = TAG_TEMPLATE_CLONE.querySelector(`[${labels.tagId}]`)
      const NEW_TAG_CONTENT = TAG_TEMPLATE_CLONE.querySelector(`[${labels.tagContent}]`)
      // set cat name as textContent
      NEW_TAG_CONTENT.innerText = input.labels[0].textContent
      NEW_TAG.setAttribute(labels.tagId, input.id)
      RELATED_TAGS_ROW.appendChild(NEW_TAG)
      // add an event listener on it for click
      NEW_TAG.addEventListener("click", this._removeTag.bind(this))
   }

   /**
   --------------------------------------------------------------------------
   @method _removeTag
   @param  {event} event
   @desc - Remove tag
   --------------------------------------------------------------------------
   */
   _removeTag (event) {
      event.currentTarget.removeEventListener("click", this._removeTag, true)
      event.currentTarget.remove()
      const RELATED_INPUT = document.getElementById(event.currentTarget.getAttribute(labels.tagId))
      if (RELATED_INPUT) RELATED_INPUT.checked = false
      if (this.submitButton) this.submitButton.disabled = false
      const HREF = super._createUrl()
      history.pushState(null, null, HREF)
      if (!this.fetchOnlyOnSubmit) fetchContent(HREF, this.divIds)
   }

   /**
   --------------------------------------------------------------------------
   @method _resetTags
   @desc - Reset methods used by clear all button
   --------------------------------------------------------------------------
   */
   _resetTags () {
      const ALL_TAGS_LIST = document.querySelectorAll(`[${labels.tagId}]`)
      ALL_TAGS_LIST.forEach(tag => {
         tag.removeEventListener("click", this._removeTag, true) // removeEventListener first to avoid keeping in memory
         tag.remove()
      })
   }

   /**
   --------------------------------------------------------------------------
   @method init
   @desc - Use this to init your class instance
   --------------------------------------------------------------------------
   */
   init () {
      super.init() // init parent class
      if (this.filtersWrapper) {
         this.filtersWrapper.addEventListener("change", event => {
            if (event.target.hasAttribute(labels.tagRow)) this._createTag(event.target)
         })
         // add click EventListener on all tags if exists on page load
         if (this.allTags) this.allTags.forEach(tag => { tag.addEventListener("click", this._removeTag.bind(this)) })
      }
   }
}
