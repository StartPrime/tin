function gcd(a: bigint, b: bigint): bigint {
	if (b === 0n) return a < 0n ? -a : a // Возвращаем абсолютное значение
	return gcd(b, a % b)
}

function main(): void {
	const readline = require('readline')
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	})

	let n: number
	const points: { x: bigint; y: bigint }[] = []

	let lineCount = 0
	rl.on('line', (line: string) => {
		if (lineCount === 0) {
			// Первая строка — количество точек
			n = parseInt(line.trim(), 10)
		} else {
			// Последующие строки — координаты точек
			const [xStr, yStr] = line.trim().split(/\s+/)
			points.push({ x: BigInt(xStr), y: BigInt(yStr) })
		}

		lineCount++

		// Если все точки считаны, закрываем ввод и обрабатываем данные
		if (lineCount === n + 1) {
			rl.close()

			// Специальные случаи:
			// 1) Если n < 3, то треугольников не может быть вообще.
			if (n < 3) {
				console.log(0)
				return
			}

			// 2) Найдём L — максимальное число точек, лежащих на одной прямой.
			let L = 1 // гарантированно хотя бы 1

			for (let i = 0; i < n; i++) {
				// Map для наклона (dx, dy) -> количество
				const slopeCount = new Map<string, number>()

				for (let j = i + 1; j < n; j++) {
					let dx = points[j].x - points[i].x
					let dy = points[j].y - points[i].y

					// нормализуем (dx, dy):
					if (dx === 0n) {
						// вертикальная линия
						dy = 1n
					} else if (dy === 0n) {
						// горизонтальная линия
						dx = 1n
					} else {
						// general case
						const g = gcd(dx, dy)
						dx /= g
						dy /= g
						// приведём к какому-то каноническому знаку
						if (dx < 0n) {
							dx = -dx
							dy = -dy
						} else if (dx === 0n && dy < 0n) {
							// если dx=0, то пусть dy>0 (обработка вертикали)
							dy = -dy
						}
					}

					const key = `${dx}_${dy}`
					slopeCount.set(key, (slopeCount.get(key) || 0) + 1)
				}

				// находим локальный максимум
				let localMax = 0
				for (const val of slopeCount.values()) {
					if (val > localMax) {
						localMax = val
					}
				}
				// +1, т.к. учитываем точку i
				localMax += 1

				if (localMax > L) {
					L = localMax
				}
			}

			// 3) Если все n точек на одной прямой, ответ 0
			if (L === n) {
				console.log(0)
				return
			}

			// 4) Если нет прямой с тремя и более точками (L < 3), то нет коллинеарных троек
			//    => любой набор троек будет невырожденным => максимум floor(n/3).
			if (L < 3) {
				console.log(Math.floor(n / 3))
				return
			}

			// 5) Общий случай:
			// Перебираем i, j, k:
			//   - i = число треугольников, где 2 точки взяты из линии с L точками
			//   - j = число треугольников, где 1 точка взята из этой линии
			//   - k = число треугольников, в которых из этой линии не берем ни одной точки
			//
			// Ограничения:
			//   2i + j <= L          (не более L точек с "главной" прямой)
			//   i + 2j + 3k <= n - L (не более (n-L) "внешних" точек)
			//   i + j + k <= floor(n/3)
			//
			// Максимизируем (i + j + k).

			let answer = 0
			const maxTriangles = Math.floor(n / 3) // верхняя граница по общему числу

			// В самых грубых пределах i не может превышать L/2, j не может превышать L
			// (иначе 2i + j > L), k не может превышать (n-L)/3.
			// Но мы включим и ограничение i + j + k <= maxTriangles.

			for (let i = 0; i <= Math.floor(L / 2); i++) {
				for (let j = 0; j <= L; j++) {
					// проверим лимит по линийным точкам
					if (2 * i + j > L) {
						break // т.к. j только растёт, можно прервать этот цикл
					}

					// Сколько уже трёхточек мы набираем? i + j
					if (i + j > maxTriangles) {
						break // смысла расти нет
					}

					// Сколько внешних точек нужно? i + 2j
					const usedOutside = i + 2 * j
					if (usedOutside > n - L) {
						break
					}

					// Сколько внешних точек остаётся? (n-L) - (i + 2j)
					const remainOutside = n - L - usedOutside

					// Максимум k, который укладывается в оставшиеся внешние точки:
					const maxKbyOutside = Math.floor(remainOutside / 3)

					// Также учтём лимит по общему числу троек (i + j + k <= maxTriangles).
					// => k <= maxTriangles - (i + j).
					const maxKbyTotal = maxTriangles - (i + j)

					const possibleK = Math.min(maxKbyOutside, maxKbyTotal)

					const totalTriangles = i + j + possibleK
					if (totalTriangles > answer) {
						answer = totalTriangles
					}
				}
			}

			console.log(answer)
		}
	})
}

main()
