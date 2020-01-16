// Checker object
const emailCheck = {
  knownDomains: [
    'gmail.com',
    'seznam.cz',
    'azet.sk',
    'centrum.sk',
    'centrum.cz',
    'email.cz',
    'zoznam.sk',
    'yahoo.com',
    'hotmail.com',
    'post.sk',
    'volny.cz',
    'icloud.com',
    'pobox.sk',
    'pobox.cz',
    'post.cz',
    'atlas.cz',
    'me.com',
    'atlas.sk'
  ],

  levenshteinDistance: function(a, b) {
    // Borrowed from: https://gist.github.com/andrei-m/982927
    if(a.length == 0) return b.length; 
    if(b.length == 0) return a.length; 

    var matrix = [];

    // increment along the first column of each row
    var i;
    for(i = 0; i <= b.length; i++){
      matrix[i] = [i];
    }

    // increment each column in the first row
    var j;
    for(j = 0; j <= a.length; j++){
      matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for(i = 1; i <= b.length; i++){
      for(j = 1; j <= a.length; j++){
        if(b.charAt(i-1) == a.charAt(j-1)){
          matrix[i][j] = matrix[i-1][j-1];
        } else {
          matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                  Math.min(matrix[i][j-1] + 1, // insertion
                                           matrix[i-1][j] + 1)); // deletion
        }
      }
    }

    return matrix[b.length][a.length];
  },

  suggestDomain: function(domain) {
    var suggestedDomain = null

    if(!this.knownDomains.includes(domain)) {
      this.knownDomains.forEach(knownDomain => {
        if (this.levenshteinDistance(domain, knownDomain) === 1) {
          suggestedDomain = knownDomain
        }
      })
    }

    return suggestedDomain
  },

  correctAddress: function(address) {
    const addressAsArray = address.split('@')
    const domain = addressAsArray[addressAsArray.length - 1]

    const suggestedDomain = this.suggestDomain(domain)

    if(suggestedDomain) {
      return addressAsArray[0] + '@' + suggestedDomain
    }
  }
}

// WooCommerce Integration
const woocommerceEmailCheck = {
  init: function() {
    this.formRow = document.getElementById('billing_email_field'),
    this.field = document.getElementById('billing_email'),
    this.errorOutput = this.constructError()

    this.field.addEventListener('input', () => {
      const correction = emailCheck.correctAddress(this.field.value)
      if(correction) {
        this.printErrorLazy(correction)
      } else {
        this.clearError()
      }
    })
  },

  constructError: function() {
    const errorOutput = document.createElement('div')
    errorOutput.style.color = 'red'
    this.formRow.appendChild(errorOutput)
    return errorOutput
  },

  printErrorLazy: debounce(function(correction) {
    this.errorOutput.innerText = translations.dym + ' ' + correction + '?'
  }, 200),

  printError: function(correction) {
    this.errorOutput.innerText = translations.dym + ' ' + correction + '?'
  },

  clearError: function() {
    this.errorOutput.innerText = ''
  }
}

function debounce(func, wait, immediate) {
  // Borrowed from: https://davidwalsh.name/javascript-debounce-function
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

woocommerceEmailCheck.init()
