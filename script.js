var arr = [[], [], [], [], [], [], [], [], []]

for (var i = 0; i < 9; i++) {
	for (var j = 0; j < 9; j++) {
		arr[i][j] = document.getElementById(i * 9 + j);

	}
}


var board = Array.from({ length: 9 }, () => Array(9).fill(0))

const lastSolveEl = document.getElementById('lastSolve')
const avgSolveEl = document.getElementById('avgSolve')
const solveCountEl = document.getElementById('solveCount')

let totalSolveTimeMs = 0
let solvedPuzzleCount = 0

function formatMs(value) {
	return `${value.toFixed(2)} ms`
}

function updateSolveStats(latestSolveTime) {
	if (typeof latestSolveTime !== 'number' || Number.isNaN(latestSolveTime)) {
		return
	}
	solvedPuzzleCount += 1
	totalSolveTimeMs += latestSolveTime

	lastSolveEl.innerText = formatMs(latestSolveTime)
	avgSolveEl.innerText = formatMs(totalSolveTimeMs / solvedPuzzleCount)
	solveCountEl.innerText = solvedPuzzleCount
}

function FillBoard(board) {
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			if (board[i][j] != 0) {
				arr[i][j].innerText = board[i][j]
			}

			else
				arr[i][j].innerText = ''
		}
	}
}

let GetPuzzle = document.getElementById('GetPuzzle')
let SolvePuzzle = document.getElementById('SolvePuzzle')

GetPuzzle.onclick = function () {
	var xhrRequest = new XMLHttpRequest()
	xhrRequest.onload = function () {
		var response = JSON.parse(xhrRequest.response)
		console.log(response)
		board = response.newboard.grids[0].value
		FillBoard(board)
	}
	xhrRequest.open('get', 'https://sudoku-api.vercel.app/api/dosuku')
	//we can change the difficulty of the puzzle the allowed values of difficulty are easy, medium, hard and random
	xhrRequest.send()
}

SolvePuzzle.onclick = () => {
	const startTime = performance.now();
	const solved = SudokuSolver(board, 0, 0, 9);
	const endTime = performance.now();
	const solveTime = endTime - startTime;
	if (solved) {
		console.log(`Solve time: ${solveTime.toFixed(2)}ms`);
		updateSolveStats(solveTime);
	} else {
		console.warn('Unable to solve the current puzzle.');
	}
};

function isValid( board, i,j, num, n)

{
	//row column
	for(let x=0; x<n; x++)
	{
		if(board[i][x] == num || board[x][j] == num)
		{
			return false;
		}
	}
	let rn = Math.sqrt(n);
	let si = i - (i%rn);
	let sj = j - (j%rn);
	for(let x=si;x< si + rn; x++){
		for(let y = sj; y<sj + rn; y++)
		{
			if(board[x][y]==num)
			{
				return false;
			}			
		}
	}
	return true;
}


function SudokuSolver( board, i, j , n)
	{
	if(i==n)
	{
		FillBoard(board)
		return true;
	}

	//outside board
	if(j==n)
	{
		return SudokuSolver(board,i+1,0,n);
	}

	//cell alr filled
	if(board[i][j] != 0)
	{
		return SudokuSolver(board,i,j+1,n);
	}

	for(let num=1; num<=9;num++){
		if(isValid(board,i,j,num,n)){
			board[i][j]=num;
			let subAns = SudokuSolver(board,i,j+1,n);
			if(subAns){
				return true;
			}
			board[i][j]=0;
		}
	}
	return false;
}
