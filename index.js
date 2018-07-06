import chromeColorLog from './chromeColorLog.js'
import asciiConverter from './asciiConverter.js'

new Vue({
  el: "#app",
  template: `
    <div>
      <h4>Open your console and select a image file</h4>
      <input type="file" @change="fileChange" accept="image/*" />
      <div>
        <pre v-html="ascii"></pre>
      </div>
    </div>
  `,
  data() {
    return {
      ascii: ''
    }
  },
  methods: {
    fileChange(e) {
      const self = this
      const myFile = Array.from(e.target.files).pop()
      const url = URL.createObjectURL(myFile)

      const asiiImage = new asciiConverter(url)

      asiiImage.get({
        targetWidth: 120,
      })
        .then(res => {
          chromeColorLog(res)
          self.ascii = res.innerHTML
        })
    }
  }
})
