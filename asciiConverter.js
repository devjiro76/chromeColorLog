import { aalib } from './aalib.js'

export default class {
  constructor(src) {
    this.src = src
  }

  get(option) {
    const self = this

    return new Promise(resolve => {
      self.loadImage()
        .then(res => {
          const {
            tempWrapper,
            tempImage,
          } = res

          const ratio = self.getRatio(tempImage.clientWidth, option)
          const width = Math.round(tempImage.clientWidth * ratio)
          const height = Math.round(tempImage.clientHeight / 2 * ratio)

          tempWrapper.remove()
          return self.createAsciiElement(width, height)
        })
        .then(res => resolve(res))
        .catch(e => {
          throw e
        })
    })
  }

  loadImage() {
    const self = this
    return new Promise(resolve => {
      const tempWrapper = document.createElement('div')
      tempWrapper.style.cssText = `position: fixed; \
                                  display: block; \
                                  height: 1px; \
                                  overflow: hidden`
      const tempImage = document.createElement('img')
      tempImage.src = self.src

      tempWrapper.appendChild(tempImage)
      document.body.appendChild(tempWrapper)
      tempImage.onload = () => resolve({
        tempWrapper,
        tempImage
      })
    })
  }

  getRatio(imageWidth, _option) {
    const option = Object.assign({
      ratio: null,
      targetWidth: 60,
    }, _option)
    let ratio = 1

    console.log('getRatio: ', option)
    if (option.ratio) {
      ratio = option.ratio
    } else if (option.targetWidth) {
      ratio = (option.targetWidth / imageWidth).toFixed(2)
    }
    return ratio
  }

  createAsciiElement(asciiWidth, asciiHeight) {
    const self = this
    const tempWrapper = document.createElement('pre')

    return new Promise(resolve =>
      aalib.read.image.fromURL(self.src)
      .map(aalib.aa({
        fontSize: 12,
        width: asciiWidth,
        height: asciiHeight,
        colored: true
      }))
      .map(aalib.render.html({
        el: tempWrapper
      }))
      .subscribe(res => resolve(res))
    )
  }
}