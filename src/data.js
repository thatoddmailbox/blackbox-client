export default {
	parseDataText: function(dataText, startTime, parseFunction) {
		var dataLines = dataText.split("\n");
		var dataArray = [];
		for (var i = 1; i < dataLines.length; i++) {
			var line = dataLines[i];
			var lineCommaIndex = line.indexOf(",");
			var lineTime = line.substr(0, lineCommaIndex);
			var lineValue = line.substr(lineCommaIndex + 1);
			if (lineCommaIndex < 0 || lineTime == "" || lineValue == "") {
				continue;
			}
			var point = [
				parseInt(lineTime) - startTime,
				parseFunction(lineValue)
			];
			if (!isNaN(point[0])) {
				dataArray.push(point);
			}
		}
		return dataArray;
	}
};