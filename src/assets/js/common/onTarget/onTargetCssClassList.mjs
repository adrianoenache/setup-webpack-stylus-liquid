function onTargetCssClassList($target, cssClass, doAction = 'toggle') {

  if(doAction == 'toggle') $target.classList.toggle(cssClass)
  if(doAction == 'add') $target.classList.add(cssClass)
  if(doAction == 'remove') $target.classList.remove(cssClass)
  if(doAction == 'contains') return $target.classList.contains(cssClass)

}

export default onTargetCssClassList
