import "App.styl";

import "bootstrap/dist/css/bootstrap.css";

import { h, Component } from "preact";

import LogViewer from "logview/LogViewer.jsx";

export default class App extends Component {
	render(props, state) {
		return <div id="app">
			<LogViewer matchKey="camera" />
		</div>;
	}
};