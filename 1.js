const readline = require('readline')

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

function isCorrectString(s) {
	const indexR = s.indexOf('R')
	const indexM = s.indexOf('M')

	if (indexR < indexM) {
		return 'Yes'
	} else {
		return 'No'
	}
}

rl.on('line', input => {
	const result = isCorrectString(input)
	console.log(result)
	rl.close()
})
