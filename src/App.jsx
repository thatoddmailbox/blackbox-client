import "App.styl";

import "bootstrap/dist/css/bootstrap.css";

import { h, Component } from "preact";

import LogViewer from "logview/LogViewer.jsx";

import ModalManager from "ui/ModalManager.jsx";

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modalName: "",
			modalState: {}
		};
	}

	openModal(name, state) {
		this.setState({
			modalName: name,
			modalState: state
		});
	}

	render(props, state) {
		return <div id="app">
			<ModalManager modalName={state.modalName} modalState={state.modalState} openModal={this.openModal.bind(this)} />

			<LogViewer matchKey="camera" openModal={this.openModal.bind(this)} />
		</div>;
	}
};