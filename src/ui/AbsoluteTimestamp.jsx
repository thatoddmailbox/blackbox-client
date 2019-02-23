import { h, Component } from "preact";

import moment from "moment";

export default class AbsoluteTimestamp extends Component {
	render(props, state) {
		var momentTime = moment(props.time);
		return <span>{momentTime.format("dddd, MMMM Do YYYY, h:mm:ss a")}</span>;
	}
};