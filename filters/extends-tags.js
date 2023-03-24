/**
--------------------------------------------------------------------------
   @class MultipleFiltersWithTags
   @author Ian Reid Langevin
--------------------------------------------------------------------------
*/

import { MultipleFilters } from "./multiple-filters"
import { fetchContent } from "./fetch-content"

export class MultipleFiltersWithTags extends MultipleFilters {
   constructor (elem, options) {
      super(elem, options)
      if (this.filtersWrapper) {
         this.tagsShownOnPageLoad = this.filtersWrapper.querySelectorAll(`[${this.attr.tagId}]`)
         this.tagTemplate = document.querySelector(`[${this.attr.tagTemplate}]`) // the template to use for tags
      }
   }

   /**
   --------------------------------------------------------------------------
   @method _getGroupsData
   @desc - Create tag if input is checked
   --------------------------------------------------------------------------
   */
   _createTag (input) {
      if (!input.checked) {
         const RELATED_TAG = document.querySelector(`[${this.attr.tagId}="${input.id}"]`)
         // removeEventListener first to avoid keeping in memory
         RELATED_TAG.removeEventListener("click", this._removeTag, true)
         RELATED_TAG.remove()
         return
      }
      const TAG_TEMPLATE_CLONE = document.importNode(this.tagTemplate.content, true)
      const RELATED_TAGS_ROW = document.getElementById(input.getAttribute(this.attr.tagRow))
      // get data-attribute from the clone and it child div
      const NEW_TAG = TAG_TEMPLATE_CLONE.querySelector(`[${this.attr.tagId}]`)
      const NEW_TAG_CONTENT = TAG_TEMPLATE_CLONE.querySelector(`[${this.attr.tagContent}]`)
      // attribute this.attr.tagTitle allow to pass a tag title distinct from node element. Can be useful if label has multiple span tags.
      const TAG_LABEL = input.labels[0].hasAttribute(this.attr.tagTitle) ? input.labels[0].getAttribute(this.attr.tagTitle) : input.labels[0].textContent
      NEW_TAG_CONTENT.innerText = TAG_LABEL
      NEW_TAG.setAttribute(this.attr.tagId, input.id)
      RELATED_TAGS_ROW.appendChild(NEW_TAG)
      // add an event listener on it for click
      NEW_TAG.addEventListener("click", this._removeTag.bind(this))
   }

   /**
   --------------------------------------------------------------------------
   @method _removeTag
   @desc - Remove tag
   --------------------------------------------------------------------------
   */
   _removeTag (event) {
      event.currentTarget.removeEventListener("click", this._removeTag, true)
      event.currentTarget.remove()
      const RELATED_INPUT = document.getElementById(event.currentTarget.getAttribute(this.attr.tagId))
      if (RELATED_INPUT) RELATED_INPUT.checked = false
      if (this.submitButton) this.submitButton.disabled = false
      const HREF = super._createUrl()
      history.pushState(null, null, HREF)
      if (!this.fetchOnlyOnSubmit) fetchContent(HREF, this.divIds, this.attr.loadingState)
   }

   /**
   --------------------------------------------------------------------------
   @method init
   --------------------------------------------------------------------------
   */
   init () {
      super.init() // init parent class
      if (this.filtersWrapper) {
         this.filtersWrapper.addEventListener("change", event => {
            if (event.target.hasAttribute(this.attr.tagRow)) this._createTag(event.target)
         })
         // add click EventListener on all tags if exists on page load
         if (this.tagsShownOnPageLoad) this.tagsShownOnPageLoad.forEach(tag => { tag.addEventListener("click", this._removeTag.bind(this)) })
      }
   }
}
