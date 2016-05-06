function showNumberWithAnimation (i, j, randNumber) {
	var numberCell = $('#number-cell-' + i + '-' + j);

	numberCell.css('background-color', getNumberBackgroudColor(randNumber));
	numberCell.css('color', getNumberColor(randNumber));
	numberCell.text(randNumber);

	// animate, css, text都是jquery的函数
	// animate需要的参数是一些样式效果组成的object
	// 50ms的时间内把数字显示出来
	numberCell.animate({
		width: cellSideLength,
		height: cellSideLength,
		top: getPosTop(i, j),
		left: getPosLeft(i, j)
	}, 50);
}

function showMoveAnimation (fromx, fromy, tox, toy) {
	var numberCell = $('#number-cell-' + fromx + '-' + fromy);
	numberCell.animate({
		top: getPosTop(tox, toy),
		left: getPosLeft(tox, toy)
	}, 200);
}

function updateScore (score) {
	$('#score').text(score);
}