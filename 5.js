const readline = require('readline')

function main() {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	})

	let inputLines = []
	rl.on('line', line => {
		inputLines.push(line)
		if (inputLines.length === 2) {
			rl.close()

			// Парсим входные данные
			const [nStr, sStr] = inputLines[0].trim().split(/\s+/)
			const n = parseInt(nStr, 10)
			const s = BigInt(sStr)
			const a = inputLines[1].trim().split(/\s+/).map(BigInt)

			// Добавляем фиктивный элемент в начало массива для удобства (индексация с 1)
			a.unshift(BigInt(0))

			// Префиксные суммы
			const prefix = new Array(n + 1).fill(BigInt(0))
			for (let i = 1; i <= n; i++) {
				prefix[i] = prefix[i - 1] + a[i]
			}

			// Массив nextPos
			const nextPos = new Array(n + 1).fill(0)
			let r = 1
			for (let i = 1; i <= n; i++) {
				// Двигаем r, пока это возможно
				while (r <= n && prefix[r] - prefix[i - 1] <= s) {
					r++
				}
				// После цикла r либо вышел за n, либо уже нельзя брать r в отрезок
				nextPos[i] = r - 1
				// r не нужно сбрасывать, т.к. следующий i не может иметь меньший nextPos
			}

			// Массив sumF
			const sumF = new Array(n + 2).fill(BigInt(0))
			sumF[n + 1] = BigInt(0)

			// Считаем sumF по формуле sumF(i) = (n - i + 1) + sumF(nextPos[i] + 1), идя с конца
			for (let i = n; i >= 1; i--) {
				sumF[i] = BigInt(n - i + 1) + sumF[nextPos[i] + 1]
			}

			// Финальный ответ = сумма sumF(i) по i=1..n
			let answer = BigInt(0)
			for (let i = 1; i <= n; i++) {
				answer += sumF[i]
			}

			// Выводим ответ
			console.log(answer.toString())
		}
	})
}

main()
