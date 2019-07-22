// http://codahale.com/a-lesson-in-timing-attacks/
export const constantTimeCompare = function(val1, val2){
  if (val1 == null && val2 != null){
    return false
  } else if (val2 == null && val1 != null){
    return false
  } else if (val1 == null && val2 == null){
    return true
  }

  if (val1.length != val2.length){
    return false
  }

  var result = 0

  for (var i = 0; i < val1.length; i++) {
    result |= val1.charCodeAt(i) ^ val2.charCodeAt(i) //Don't short circuit
  }

  return result === 0
}
