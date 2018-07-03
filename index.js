export default function (arg) {
  const argType = () => Object.prototype.toString.call(arguments[0])

  const htmlDecode = (input) => {
    const doc = new DOMParser().parseFromString(input, "text/html")
    return doc.documentElement.textContent
  }

  const getSpanArray = (param) => {
    let tempArray = []
    if (param instanceof HTMLElement) {
      switch (argType(param)) {
        case '[object HTMLSpanElement]':
          tempArray.push(param.outerHTML)
          break
        case '[object NodeList]':
        case '[object Array]':
          Array.from(param).forEach(node => {
            if (argType(node) === '[object HTMLSpanElement]') {
              tempArray.push(node.innerHTML)
            }
          })
          break
        default:
          tempArray = param.innerHTML.split(/\r|\n/)
          break
      }
    } else if (param instanceof String) {
      tempArray = param.split(/\r|\n/)
    }

    return tempArray
  }

  const consoleDrawing = (spanArray) => {
    if (spanArray.length) {
      const tags = []
      const contents = []
      var startTagRe = /<span\s+style=(['"])([^'"]*)\1\s*>(.*?)<\/span>/gi

      for (var i = 0, l = spanArray.length; i < l; i++) {
        tags.push(spanArray[i].replace(startTagRe, '%c%s%c'))

        var reResultArray
        while (reResultArray = startTagRe.exec(spanArray[i])) {
          contents.push(reResultArray[2])
          contents.push(reResultArray[3] === " " ? " " : htmlDecode(reResultArray[3]))
          contents.push('')
        }

        tags.push('%O')
        contents.push('\n')
      }
      const res = Array.prototype.concat(tags.join(''), contents)
      console.log.apply(console, res)
    }
  }

  consoleDrawing(getSpanArray(arg))
}