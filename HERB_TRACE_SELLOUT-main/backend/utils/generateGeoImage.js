const StaticMaps = require("staticmaps")
const path = require("path")

async function generateGeoImage(lat,lon,batchId){

 const options = {
  width:600,
  height:300
 }

 const map = new StaticMaps(options)

 const marker = {
  coord:[lon,lat],
  img:"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  height:41,
  width:25
 }

 map.addMarker(marker)

 const fileName = `geo-${batchId}.png`

 const filePath = path.join(__dirname,"../uploads",fileName)

 await map.render([lon,lat],13)

 await map.image.save(filePath)

 return `/uploads/${fileName}`

}

module.exports = generateGeoImage