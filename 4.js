class Pair {
	constructor(cost, idx) {
		this.cost = cost
		this.idx = idx
	}
}

function getCost(val, d) {
	const r = val % d
	if (r === BigInt(0)) return BigInt(0)
	return d - r
}

function lcm(x, y) {
	return (x / gcd(x, y)) * y
}

function gcd(a, b) {
	while (b !== BigInt(0)) {
		const t = a % b
		a = b
		b = t
	}
	return a
}

function getTop3(arr) {
	const buf = arr.map((cost, idx) => new Pair(cost, idx))
	buf.sort((a, b) => Number(a.cost - b.cost))
	return buf.slice(0, Math.min(3, buf.length))
}

function combineTwoSets(bestA, bestB, bestUnion) {
	let res = BigInt(Number.MAX_SAFE_INTEGER) // Используем большое значение для bigint

	// Случай i != j
	for (const pA of bestA) {
		for (const pB of bestB) {
			if (pA.idx !== pB.idx) {
				const sum = pA.cost + pB.cost
				if (sum < res) {
					res = sum
				}
			}
		}
	}

	// Случай i = j => покрытие одним элементом (XYZ)
	if (bestUnion.length > 0) {
		const unionCost = bestUnion[0].cost
		if (unionCost < res) {
			res = unionCost
		}
	}

	return res
}

function combineThreeDistinct(bestX, bestY, bestZ) {
	let res = BigInt(Number.MAX_SAFE_INTEGER) // Используем большое значение для bigint

	// Перебор всех троек из top-3 X, Y, Z
	for (const px of bestX) {
		for (const py of bestY) {
			for (const pz of bestZ) {
				if (px.idx !== py.idx && py.idx !== pz.idx && px.idx !== pz.idx) {
					const costSum = px.cost + py.cost + pz.cost
					if (costSum < res) {
						res = costSum
					}
				}
			}
		}
	}

	return res
}

function main() {
	const readline = require('readline')
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
			const [nStr, xStr, yStr, zStr] = inputLines[0].trim().split(/\s+/)
			const n = parseInt(nStr, 10)
			const x = BigInt(xStr)
			const y = BigInt(yStr)
			const z = BigInt(zStr)
			const a = inputLines[1].trim().split(/\s+/).map(BigInt)

			// Быстрое вычисление НОК (lcm) с защитой от переполнений
			const xy = lcm(x, y)
			const xz = lcm(x, z)
			const yz = lcm(y, z)
			const xyz = lcm(xy, z) // это lcm(x, y, z)

			// Массивы стоимостей
			const costX = a.map(ai => getCost(ai, x))
			const costY = a.map(ai => getCost(ai, y))
			const costZ = a.map(ai => getCost(ai, z))
			const costXY = a.map(ai => getCost(ai, xy))
			const costXZ = a.map(ai => getCost(ai, xz))
			const costYZ = a.map(ai => getCost(ai, yz))
			const costXYZ = a.map(ai => getCost(ai, xyz))

			// coverageSets[0] = costX, coverageSets[1] = costY и т.д.
			const coverageSets = [
				costX,
				costY,
				costZ,
				costXY,
				costXZ,
				costYZ,
				costXYZ,
			]

			// Список (минимальные три значения + индексы) для каждого из 7 массивов
			const best = []
			for (let c = 0; c < 7; c++) {
				best[c] = getTop3(coverageSets[c])
			}

			// -----------------
			// СЛУЧАЙ A: Один элемент покрывает {x,y,z}, то есть нужен кратный lcm(x,y,z).
			const ansA = best[6].length === 0 ? Infinity : Number(best[6][0].cost)

			// -----------------
			// СЛУЧАЙ B: Два элемента покрывают троицу.
			let ansB = Infinity
			// 1) (XY) + (Z)
			ansB = Math.min(ansB, Number(combineTwoSets(best[3], best[2], best[6])))
			// 2) (XZ) + (Y)
			ansB = Math.min(ansB, Number(combineTwoSets(best[4], best[1], best[6])))
			// 3) (YZ) + (X)
			ansB = Math.min(ansB, Number(combineTwoSets(best[5], best[0], best[6])))

			// -----------------
			// СЛУЧАЙ C: Три элемента, каждый отвечает за X, Y, Z по отдельности.
			const ansC = Number(combineThreeDistinct(best[0], best[1], best[2]))

			// Итоговый ответ - минимум из трёх случаев
			const answer = Math.min(ansA, Math.min(ansB, ansC))
			console.log(answer)
		}
	})
}

main()
