const readline = require('readline')

// Создаем интерфейс для чтения ввода с клавиатуры
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

function solve() {
	let n, m
	let a = []

	// Шаг 1: Ввод первой строки (n и m)
	rl.question('', firstLine => {
		const [nInput, mInput] = firstLine.trim().split(/\s+/)
		n = parseInt(nInput, 10)
		m = parseInt(mInput, 10)

		// Шаг 2: Ввод второй строки (a1, a2, ..., an)
		rl.question('', secondLine => {
			a = secondLine.trim().split(/\s+/).map(Number)

			// Шаг 3: Обработка данных
			const D = a.slice(2) // Дни с 3-го по n-й
			D.sort((x, y) => x - y)

			// Шаг 4: Поиск минимального количества корректировок
			let ans = Infinity

			for (let i = 0; i <= D.length - m; i++) {
				const left = D[i]
				const right = D[i + m - 1]

				const costLeft = Math.max(0, a[0] - left) // Корректировка a[0]
				const costRight = Math.max(0, right - a[1]) // Корректировка a[1]

				const costTotal = costLeft + costRight
				if (costTotal < ans) {
					ans = costTotal
				}
			}

			// Шаг 5: Вывод результата
			console.log(ans)

			// Закрываем интерфейс
			rl.close()
		})
	})
}

// Запуск решения
solve()
