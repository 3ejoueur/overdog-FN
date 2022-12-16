/*
--------------------------------------------------------------------------
  Lazyload images with native lazy attribute if supported
--------------------------------------------------------------------------
  Based on a snippet from frontmend.com and adapted with the web.dev recommandations
  Opinionated by Ian Reid Langevin - 2020 - Updated in 2022
*/

export function renameDataSet (element) {
   const dataSrcSet = element.getAttribute("data-srcset")
   const dataSrc = element.getAttribute("data-src")

   if (dataSrcSet) {
      element.srcset = element.dataset.srcset
      element.removeAttribute("data-srcset") // optionnal - clean html after
   }
   if (dataSrc) {
      element.src = element.dataset.src
      element.removeAttribute("data-src") // optionnal - clean html after
   }
}

export function lazyload () {
   const LAZY_IMAGES = document.querySelectorAll("[loading=\"lazy\"]")

   // if IntersectionObserver IS support but NOT native lazy loading
   // (Safari, old Chromium)
   if ("IntersectionObserver" in window && !("loading" in HTMLImageElement.prototype)) {
      // imageObserver function
      const IMAGE_OBSERVER = new IntersectionObserver(entries => {
         entries.forEach(entry => {
            if (entry.isIntersecting) {
               renameDataSet(entry.target) // execute function for target
               IMAGE_OBSERVER.unobserve(entry.target)
            }
         })
      },
      { rootMargin: "300px 0px" })

      // execute imageObserver function
      LAZY_IMAGES.forEach(img => {
         IMAGE_OBSERVER.observe(img)
      })

   // else native lazy loading IS supported OR IntersectionObserver is NOT
   // (very new or very old browsers)
   } else {
      LAZY_IMAGES.forEach(img => {
         renameDataSet(img)
      })
   }
}