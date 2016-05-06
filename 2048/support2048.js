// 手机上用的
documentWidth = window.screen.availWidth;
gridContainerWidth = 0.92 * documentWidth; // 大方块的宽度
cellSideLength = 0.18 * documentWidth; // 小方块
cellSpace = 0.04 * documentWidth; // 小方块的间距

function getPosTop (i, j) {
	return cellSpace + i*(cellSpace+cellSideLength);
}

function getPosLeft (i, j) {
	return cellSpace + j*(cellSpace+cellSideLength);
}

function getNumberBackgroudColor (number) {
	switch (number) {
		case 2: return "#eee4da"; break;
		case 4: return "#ede0c8"; break;
		case 8: return "#f2b179"; break;
		case 16: return "#f59563"; break;
		case 32: return "#f67c5f"; break;
		case 64: return "#f65e3b"; break;
		case 128: return "#edcf72"; break;
		case 256: return "#edcc61"; break;
		case 512: return "#9c0"; break;
		case 1024: return "#33b5e5"; break;
		case 2048: return "#09c"; break;
		case 4096: return "#a6c"; break;
		case 8192: return "#93c"; break;
	}
	return "black";
}

function getNumberColor (number) {
	if (number <= 4)
		return "#776e65";

	return "white";
}

function nospace (board) {
	// 找是否有为0的元素
	for (var i = 0; i < 4; i++)
		for (var j = 0; j < 4; j++)
			if (board[i][j] == 0)
				return false;

	return true;
}

function canMoveLeft (borad) {
	// 最左边一列的格子都不能左移，无需判断
	// 只需判断另外3*4=12个格子
	// 左移的条件：
	// 1. 左边无数字
	// 2. 有数字，并且与自己相同
	for (var i = 0; i < 4; i++)
		for (var j = 1; j < 4; j++)
			if (board[i][j] != 0)
				if (board[i][j-1] == 0 || board[i][j-1] == board[i][j])
					return true;
	return false;
}

function canMoveRight (borad) {
	for (var i = 0; i < 4; i++)
		for (var j = 2; j >= 0; j--)
			if (board[i][j] != 0)
				if (board[i][j+1] == 0 || board[i][j+1] == board[i][j])
					return true;
	return false;
}

function canMoveUp (borad) {
	// 上移
	for (var j = 0; j < 4; j++)
		for (var i = 1; i < 4; i++)		
			if (board[i][j] != 0)
				if (board[i-1][j] == 0 || board[i-1][j] == board[i][j])
					return true;
	return false;
}

function canMoveDown (board) {
	for (var j = 0; j < 4; j++)
		for (var i = 2; i >= 0; i--)
			if (board[i][j] != 0)
				if (board[i+1][j] == 0 || board[i+1][j] == board[i][j])
					return true;
	return false;
}

function noBlockHorizontal (row, col1, col2, board) {
	for (var i = col1+1; i < col2; i++)
		if (board[row][i] != 0)
			return false;
	return true;
}

function noBlockVertical (col, row1, row2, board) {
	for (var i = row1+1; i < row2; i++)
		if (board[i][col] != 0)
			return false;
	return true;
}

function noMove(board) {
	if (canMoveLeft(board) || canMoveRight(board) || 
		canMoveUp(board) || canMoveDown(board))
		return false;
	return true;
}