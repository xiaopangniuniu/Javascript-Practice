// game data
var board = new Array(); // 4x4 board
var score = 0;
var hasConflicted = new Array();

// touchStart + touchEnd
var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

// 学习jQuery的第一件事是：如果你想要一个事件运行在你的页面上，你必须在$(document).ready()里调用这个事件。
// 所有包括在$(document).ready()里面的元素或事件都将会在DOM完成加载之后立即加载，并且在页面内容加载之前。
// 注意ready里传入的是一个函数指针
$(document).ready(function () {
	prepareForMobile(); // 用于移动端的一些初始化工作
	newgame();
});

function newgame() {
	// 初始化棋盘格
	init();
	// 随机地在两个格子里生成数字
	generateOneNumber();
	generateOneNumber();
}

function init() {
	for (var i = 0; i < 4; i++)
		for (var j = 0; j < 4; j++) {
			// 通过id来取得每个小格子的位置
			var gridCell = $("#grid-cell-"+i+"-"+j);
			// $("#grid-cell-0-1").css 是jquery的function 用法通过console可查
			gridCell.css('top', getPosTop(i, j));
			gridCell.css('left', getPosLeft(i, j));
		}
	// board定义的时候是一维数组，需要改成二维数组
	for (var i = 0; i < 4; i++) {
		board[i] = new Array(); // 把board中每个元素都声明成数组，就变成二维的了
		hasConflicted[i] = new Array();
		for (var j = 0; j < 4; j++) {
			board[i][j] = 0;
			hasConflicted[i][j] = false;
		}
	}
	// 更新格子里的数字
	updateBoardView();
	score = 0;
	updateScore(score);
}

// 用户的每一次操作都要调用这个函数
function updateBoardView() {
	$(".number-cell").remove(); // 把所有number都移除
	for (var i = 0; i < 4; i++)
		for (var j = 0; j < 4; j++) {
			// append() 方法在被选元素的结尾插入指定内容
			// 注意这里单双引号的用法： +i+， +j+是在单引号之外的以下可以分解成：
			// '<div class="number-cell" id="number-cell-'这是一段
			// '-'是第二段
			// '"></div>'是最后一段，用+i+, +j+把三段连起来
			$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
			var theNumberCell = $("#number-cell-" + i + "-" + j); // current number cell

			if (board[i][j] == 0) {
				theNumberCell.css('width', '0px');
				theNumberCell.css('height', '0px');
				// 把theNumberCell放在每个grid-cell的中间
				theNumberCell.css('top', getPosTop(i, j) + cellSideLength/2);
				theNumberCell.css('left', getPosLeft(i, j) + cellSideLength/2);
			}
			else {
				// 用数字把grid-cell的格子覆盖掉
				theNumberCell.css('width', cellSideLength);
				theNumberCell.css('height', cellSideLength);
				theNumberCell.css('top', getPosTop(i, j));
				theNumberCell.css('left', getPosLeft(i, j));
				// 数字的值不同，背景色也不同
				theNumberCell.css('background-color', getNumberBackgroudColor( board[i][j] ));
				// 数字本身的颜色，也根据数字的值而变化
				theNumberCell.css('color', getNumberColor( board[i][j] ));
				// 數字的值不同，字体大小也不同
				theNumberCell.css('font-size', getNumberSize( border[i][j] ));
				// 把数值显示出来
				theNumberCell.text( board[i][j] );
			}

			hasConflicted[i][j] = false;
		}
	
	$('.number-cell').css('line-height', cellSideLength+'px');
	// $('.number-cell').css('font-size', 0.6*cellSideLength+'px');
}

function generateOneNumber() {
	// 去grid里找一个空闲的格子
	if (nospace( board ))
		return false;

	// 随机找到一个空闲的格子
	// random() 产生 0-1之间的浮点随机数
	// Math.floor向下取整
	// parseInt 强转成int, 得到0-4的随机整数
	var randx = parseInt( Math.floor(Math.random() * 4) );
	var randy = parseInt( Math.floor(Math.random() * 4) );
	
	// 判断位置是否可用
	var times = 0;
	while (times < 50) {
		if (board[randx][randy] == 0)
			break;
		var randx = parseInt( Math.floor(Math.random() * 4) );
		var randy = parseInt( Math.floor(Math.random() * 4) );
		times++;
	}
	// 如果50次都没找到的话，就人工指定一个位置
	if (times == 50) {
		for (var i = 0; i < 4; i++)
			for (var j = 0; j < 4; j++) {
				if (board[i][j] == 0) {
					randx = i;
					randy = j;
				}
			}
	}

	// 随机生成一个数字： 2 或 4
	// for test:
	//var randNumber = 1024;
	var randNumber = Math.random() <= 0.5 ? 2 : 4;

	// 把数字显示在相应的格子里
	board[randx][randy] = randNumber;
	// 显示时需要有动画效果
	showNumberWithAnimation(randx, randy, randNumber);

	return true;
}

// keydown() 里传入一个函数，表示当user按下key的时候，用哪个函数对此进行响应
// 当使用keydown时，会去捕捉是哪个key按下了，然后把对应的键值存到参数的keyCode或者which属性里
// 每个按键对应的数值可以在网上查到
$(document).keydown(function (event) {
	event.preventDefault(); // 按向下时，滑动条也会动的动作屏蔽掉，更好的做法可以放到switch case里

	switch (event.keyCode) {
		case 37: // left
			// 如果可以向左移动
			if ( moveLeft() ) {
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameover()", 300);
			}
			// 如果不能左移，不响应
			break;
		case 38: // up
			if ( moveUp() ) {
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameover()", 300);
			}
			break;
		case 39: // right
			if ( moveRight() ) {
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameover()", 300);
			}
			break;
		case 40: // down
			if ( moveDown() ) {
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameover()", 300);
			}
			break;
		default: // others
			break;
	}
});

// 捕捉手指的动作
document.addEventListener('touchstart', function(event) {
	// event.touches是数组，多点触控时，会存多个手指的信息
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
});

document.addEventListener('touchmove', function(event) {
	event.preventDefault();
});

document.addEventListener('touchend', function(event) {
	// changedTouches 触控发生改变时的手指信息
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;
	
	// 注意屏幕中的坐标轴，y轴的正方向是向下的
	// 触摸结束后进行方向的判断
	var deltax = endx - startx;
	var deltay = endy - starty;

	// 如果deltax, deltay都很小的时候，用户并没有在滑动，只是在点击屏幕
	if (Math.abs(deltax) < 0.1*documentWidth && Math.abs(deltay) < 0.1*documentWidth)
		return;

	if (Math.abs(deltax) >= Math.abs(deltay)) { // 左右滑动
		if (deltax > 0) {
			// move right
			if ( moveRight() ) {
				event.preventDefault();
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameover()", 300);
			}
		}
		else {
			// move left
			if ( moveLeft() ) {
				event.preventDefault();
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameover()", 300);
			}
		}
	}
	else { // 上下滑动
		if (deltay > 0) {
			// move down
			if ( moveDown() ) {
				event.preventDefault();
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameover()", 300);
			}
		}
		else {
			// move up
			if ( moveUp() ) {
				event.preventDefault();
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameover()", 300);
			}
		}

	}
});

function isGameover() {
	if ( nospace(board) && noMove(board))
		gameOver();
}

function gameOver() {
	alert("Game over!");
}

function moveLeft() {
	if ( !canMoveLeft( board ) )
		return false;
	// move left
	// 1. 移动到哪儿?
	// 2. 是否需要进行叠加
	// 以(1, 3)为例，先判断是否可移动到(1, 0)，不能则(1, 1), 再则(1, 2)
	// 3. 中间不可有不空的格式
	for (var i = 0; i < 4; i++)
		for (var j = 1; j < 4; j++)
			if (board[i][j] != 0) {
				// board[i][j]左边的格子
				for (var k = 0; k < j; k++) {
					if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
						// move
						showMoveAnimation(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if (board[i][k] == board[i][j] && 
						noBlockHorizontal(i, k, j, board) &&
						!hasConflicted[i][k]) {
						// move
						showMoveAnimation(i, j, i, k);
						// add
						board[i][k] += board[i][j];
						board[i][j] = 0;
						// add score
						score += board[i][k];
						updateScore(score);

						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
	// 一定要记得对整个board进行一次数据的刷新
	// 调用 showMoveAnimation() 时，等待的200 ms，其实没有等那么久，会先调updateBoardView() 进行board的刷新
	// 这一点课上有说，所以要等待200ms再执行updateBoardView();
	setTimeout("updateBoardView()", 200);

	return true;
}

function moveRight() {
	if ( !canMoveRight( board ) )
		return false;

	for (var i = 0; i < 4; i++)
		for (var j = 2; j >= 0; j--)
			if (board[i][j] != 0) {
				// board[i][j]右边的格子
				for (var k = 3; k > j; k--) {
					if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
						// move
						showMoveAnimation(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if (board[i][k] == board[i][j] && 
						noBlockHorizontal(i, j, k, board) &&
						!hasConflicted[i][k]) {
						
						showMoveAnimation(i, j, i, k);
						board[i][k] += board[i][j];
						board[i][j] = 0;

						score += board[i][k];
						updateScore(score);

						hasConflicted[i][k] = true;
						continue;
					}
				}
			}

	setTimeout("updateBoardView()", 200);

	return true;
}

function moveUp() {
	// 先判断能否移动
	if ( !canMoveUp(board) )
		return false;
	for (var j = 0; j < 4; j++)
		for (var i = 1; i < 4; i++)	
			if (board[i][j] != 0) {
				for (var k = 0; k < i; k++) {
					if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
						// move
						showMoveAnimation(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if (board[k][j] == board[i][j] && 
						noBlockVertical(j, k, i, board) &&
						!hasConflicted[k][j]) {
						// move
						showMoveAnimation(i, j, k, j);
						// add
						board[k][j] += board[i][j];
						board[i][j] = 0;
						
						score += board[k][j];
						updateScore(score);
						
						hasConflicted[k][j] = true;
						continue;
					}
				}
			}
	setTimeout("updateBoardView()", 200);

	return true;
}

function moveDown() {
	if ( !canMoveDown(board) )
		return false;

	for (var j = 0; j < 4; j++)
		for (var i = 2; i >= 0; i--)
			if (board[i][j] != 0) {
				// 向下移动，检查board[i][j] 下方的格子
				for (var k = 3; k > i; k--) {
					if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
						showMoveAnimation(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if (board[k][j] == board[i][j] 
						&& noBlockVertical(j, i, k, board)
						&& !hasConflicted[k][j]) {
						showMoveAnimation(i, j, k, j);
						board[k][j] += board[i][j];
						board[i][j] = 0;

						score += board[k][j];
						updateScore(score);

						hasConflicted[k][j] = true;
						continue;
					}
				}
			}
	setTimeout("updateBoardView()", 200);

	return true;
}

function prepareForMobile() {
	if (documentWidth > 500) {
		gridContainerWidth = 500;
		cellSideLength = 100;
		cellSpace = 20;
	}
	// 在这里改变原来css的样式
	// header
	$('header').css('width', gridContainerWidth);
	$('header').css('height', 0.35*gridContainerWidth);
	// header h1
	$('h1').css('width', 0.3*gridContainerWidth);
	$('h1').css('height', 0.3*gridContainerWidth);
	$('h1').css('font-size', 0.1*gridContainerWidth);
	// header #right-layout
	$('#right-layout').css('width', 0.62*gridContainerWidth);
	$('#right-layout').css('height', 0.3*gridContainerWidth);
	$('#right-layout').css('margin-right', 0.02*gridContainerWidth);
	$('#right-layout').css('margin-top', 0.02*gridContainerWidth);
	$('#right-layout').css('margin-bottom', 0.02*gridContainerWidth);
	$('#right-layout').css('margin-left', 0.024*gridContainerWidth);
	// header scoretext
	$('#scoretext').css('font-size', 0.04*gridContainerWidth);
	// header score
	$('#score').css('font-size', 0.06*gridContainerWidth);
	// header newgamebutton
	$('#newgamebutton').css('font-size', 0.04*gridContainerWidth);
	$('#newgamebutton').css('padding', 0.024*gridContainerWidth);
	$('#newgamebutton').css('border-radius', 0.02*gridContainerWidth);
	// header besttext
	$('#besttext').css('font-size', 0.04*gridContainerWidth);
	// header best
	$('#best').css('font-size', 0.06*gridContainerWidth);
	// header undobutton
	$('#undobutton').css('font-size', 0.04*gridContainerWidth);
	$('#undobutton').css('padding', 0.024*gridContainerWidth);
	$('#undobutton').css('border-radius', 0.02*gridContainerWidth);

	// header grid-container
	$('#grid-container').css('width', gridContainerWidth - 2*cellSpace);
	$('#grid-container').css('height', gridContainerWidth - 2*cellSpace);
	$('#grid-container').css('padding', cellSpace);
	$('#grid-container').css('border-radius', 0.02*gridContainerWidth);
	// header grid-cell
	$('.grid-cell').css('width', cellSideLength);
	$('.grid-cell').css('height', cellSideLength);
	$('.grid-cell').css('border-radius', 0.02*cellSideLength);
}

function undo() {
	console.log("debug info: call undo...");
}