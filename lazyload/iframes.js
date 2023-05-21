/**
--------------------------------------------------------------------------
  @function lazyloadIframes
  @desc
  External scripts from iframes are executes on load by the browsers.
  This happens even tough the iframes has the loading attribute set to lazy.
  This small function allow to really lazy-load iFrames by replacing a div tag
  by an iframe tag when element is close to viewport.
  @author Ian Reid Langevin
--------------------------------------------------------------------------
*/

export function lazyloadIframes () {
   const LAZY_IFRAMES = document.querySelectorAll("[data-lazy-iframe=\"wrapper\"]")

   if (LAZY_IFRAMES) {
      const imageObserver = new IntersectionObserver(entries => {
         entries.forEach(entry => {
            if (entry.isIntersecting) {
               const iframeContent = entry.target.querySelector("lazy-iframe")
               if (iframeContent) {
                  // 1 - Get all the attributes of the data-lazy-iframe content div
                  const attrs = iframeContent.getAttributeNames().reduce((acc, name) => {
                     return { ...acc, [name]: iframeContent.getAttribute(name) }
                  }, {})
                  // 2 - Create a new HTML element with the iframe tag */
                  const iframe = document.createElement("iframe")
                  // 3 - Assign attributes from the old div to the new iframe element
                  Object.entries(attrs).forEach(([k, v]) => iframe.setAttribute(k, v))
                  // 4 - Replace this old div with the new iframe so the browser load the scripts
                  entry.target.replaceChild(iframe, iframeContent)
               }
               imageObserver.unobserve(entry.target)
            }
         })
      },
      { rootMargin: "100px 0px" })
      // execute imageObserver function
      LAZY_IFRAMES.forEach(iframe => { imageObserver.observe(iframe) })
   }
}
