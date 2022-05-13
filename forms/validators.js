
export const validators = [
   {
      format: "phone",
      regex: /^[+]?[(]?[0-9]{3}[)]?[-s. ]?[0-9]{3}[-s. ]?[0-9]{4,6}$/im
   },
   {
      format: "email",
      regex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]*.[a-z]\.([a-z]+)(\/?)?$/
   },
   {
      format: "alpha",
      regex: /^[ a-zA-Z]+$/
   },
   {
      format: "alpha-extended",
      regex: /^[ a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'`'-]+$/
   },
   {
      format: "numeric",
      regex: /^[ 0-9]+$/
   },
   {
      format: "alphanumeric",
      regex: /^[ 0-9a-zA-Z]+$/
   },
   {
      format: "alphanumeric-extended",
      regex: /^[ a-zA-Z0-9àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'`'-]+$/
   },
   {
      format: "url",
      regex: /^(http:\/\/|https:\/\/)?(www.)?([a-zA-Z0-9]+).[a-zA-Z0-9]*.[a-z]{3}\.([a-z]+)(\/?)?$/
   }
]
