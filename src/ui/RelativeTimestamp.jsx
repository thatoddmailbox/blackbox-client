import { h, Component } from "preact";

import moment from "moment";

export default class RelativeTimestamp extends Component {
	render(props, state) {
		var momentTime = moment(props.time);
		var momentStartTime = moment(props.startTime);

		var fullTime = momentTime.format("dddd, MMMM Do YYYY, h:mm:ss a");
		var differenceMilliseconds = momentTime.diff(momentStartTime);
		var differenceSeconds = Math.floor(differenceMilliseconds / 1000);

		var displayMinutes = Math.floor(differenceSeconds / 60);
		var displaySeconds = Math.floor(differenceSeconds % 60);

		return <abbr title={fullTime}>+{displayMinutes}:{displaySeconds < 10 ? "0": ""}{displaySeconds}</abbr>;
	}
};