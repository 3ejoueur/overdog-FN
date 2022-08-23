/*
--------------------------------------------------------------------------
  Lazyload images with native lazy attribute if supported
--------------------------------------------------------------------------

  Based on a snippet from frontmend.com and adapted with the web.dev recommandations
  Opinionated by Ian Reid Langevin - 2020

*/

export function lazyload () {
   const LAZY_IMAGES = document.querySelectorAll("[loading=\"lazy\"]")

   function renameDataSet (element) {
      element.srcset = element.dataset.srcset
      element.src = element.dataset.src
      // optionnal - clean html after
      element.removeAttribute("data-srcset")
      element.removeAttribute("data-src")
   }

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
