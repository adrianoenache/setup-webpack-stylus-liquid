function $getMySelectors($targets) {

  if(document.querySelector($targets)) {

    return document.querySelectorAll($targets)

  } else {

    if(window.deepoBSDebug) console.warn(`The function $getMySelector do not found the elements "${$targets}".`)

    return false

  }

}

export default $getMySelectors
