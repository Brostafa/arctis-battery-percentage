var HID = require('node-hid')
HID.setDriverType('libusb')

var devices = HID.devices()

const series = [
	[4152, 0x12ad], // Arctis 7 2019
	[4152, 0x1260], // Arctis 7 2017
	[4152, 0x1252], // Arctis Pro
	[4152, 0x12b3], // Actris 1 Wireless
	[4152, 0x12C2] // Arctis 9
]

function getPercentage(callback) {
	devices
		.filter((d) => {
			return series.some((s) => {
				return d.vendorId === s[0] && d.productId === s[1] && d.usage !== 1
			})
		})
		.forEach((deviceInfo) => {
			var device = new HID.HID(deviceInfo.path)

			if (!device) {
				console.log('Could not find device :(')
				process.exit(1)
			}

			try {
				device.write([0x06, 0x18])
				var report = device.readSync()
				callback(deviceInfo, report[2])
			} catch (error) {
				console.log('Error: Cannot write to Arctis Wireless device. Please replug the device.')
			}

			device.close()
		})
}

getPercentage((device, percentage) => {
  console.log(percentage > 100 ? 100 : percentage < 0 ? 0 : percentage)
})