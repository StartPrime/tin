const MOD = 998244353
const INV2 = (MOD + 1) / 2 // Обратное к 2

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
			const [nStr, kStr] = inputLines[0].trim().split(/\s+/)
			const n = parseInt(nStr, 10)
			const k = parseInt(kStr, 10)
			const arr = inputLines[1].trim().split(/\s+/).map(Number)

			// 1) S(r) для r=0..k
			//    S(0) = n, т.к. a^0=1
			const S = new Array(k + 1).fill(0)
			S[0] = n
			for (const x of arr) {
				let pwr = 1
				for (let r = 1; r <= k; r++) {
					pwr = (pwr * x) % MOD
					S[r] = (S[r] + pwr) % MOD
				}
			}

			// 2) Биномиальные коэффициенты C[p][m], 0<=p<=k
			const C = new Array(k + 1)
			for (let i = 0; i <= k; i++) {
				C[i] = new Array(k + 1).fill(0)
				C[i][0] = 1
				for (let j = 1; j <= i; j++) {
					C[i][j] = (C[i - 1][j - 1] + C[i - 1][j]) % MOD
				}
			}

			// 3) Степени двойки
			const pow2 = new Array(k + 1)
			pow2[0] = 1
			for (let p = 1; p <= k; p++) {
				pow2[p] = (pow2[p - 1] * 2) % MOD
			}

			// 4) f(p) = 1/2 * [ sum_{m=0..p} C[p][m]*S(m)*S(p-m)  -  2^p * S(p) ]
			const sb = []
			for (let p = 1; p <= k; p++) {
				let total = 0
				for (let m = 0; m <= p; m++) {
					let tmp = C[p][m]
					tmp = (tmp * S[m]) % MOD
					tmp = (tmp * S[p - m]) % MOD
					total = (total + tmp) % MOD
				}
				// вычесть 2^p * S(p)
				total = (total - ((pow2[p] * S[p]) % MOD) + MOD) % MOD

				// умножить на inv2 (1/2 по модулю)
				total = (total * INV2) % MOD

				sb.push(total.toString())
			}

			console.log(sb.join('\n'))
		}
	})
}

main()
