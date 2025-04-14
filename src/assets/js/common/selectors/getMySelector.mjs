
function $getMySelector($target) {

  if(document.querySelector($target)) {

    return document.querySelector($target)

  } else {

    if(window.deepoBSDebug) console.warn(`The function $getMySelector do not found the element "${$target}".`)

    return false

  }

}

export default $getMySelector
