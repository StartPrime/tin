const readline = require('readline')

// Создаем интерфейс для чтения ввода с клавиатуры
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

// Функция для генерации степеней двойки
function* generatePowers() {
	for (let i = 0; i < 60; i++) {
		yield BigInt(1) << BigInt(i)
	}
}

// Функция для генерации всех сумм вида 2^i + 2^j + 2^k (i < j < k)
function* generateSums() {
	const powers = generatePowers()
	const powerArray = Array.from(powers)

	for (let i = 0; i < 60; i++) {
		for (let j = i + 1; j < 60; j++) {
			for (let k = j + 1; k < 60; k++) {
				yield powerArray[i] + powerArray[j] + powerArray[k]
			}
		}
	}
}

// Функция для решения задачи
function solve() {
	// 1) Генерация всех сумм вида 2^i + 2^j + 2^k (i < j < k)
	const sums = Array.from(generateSums())

	// 2) Сортировка сумм
	sums.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))

	// 3) Запрашиваем количество дней
	rl.question('', nInput => {
		const n = parseInt(nInput, 10) // Количество дней
		const aList = [] // Бюджеты для каждого дня

		let count = 0

		// 4) Функция для запроса бюджета на каждый день
		const askDay = () => {
			if (count < n) {
				rl.question('', aInput => {
					const a = BigInt(aInput) // Используем BigInt для точности
					aList.push(a)
					count++
					askDay() // Рекурсивно запрашиваем следующий день
				})
			} else {
				// 5) Обработка всех дней
				const output = []
				for (const money of aList) {
					// Бинарный поиск для нахождения максимальной суммы <= money
					let left = 0
					let right = sums.length - 1
					let result = BigInt(-1)

					while (left <= right) {
						const mid = Math.floor((left + right) / 2)
						if (sums[mid] <= money) {
							result = sums[mid]
							left = mid + 1
						} else {
							right = mid - 1
						}
					}

					output.push(result === BigInt(-1) ? '-1' : result.toString())
				}

				// 6) Вывод результатов
				console.log(output.join('\n'))

				// Закрываем интерфейс
				rl.close()
			}
		}

		// Запускаем запрос бюджетов
		askDay()
	})
}

// Запуск решения
solve()
