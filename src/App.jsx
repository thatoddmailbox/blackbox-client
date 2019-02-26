import "App.styl";

import "bootstrap/dist/css/bootstrap.css";
import "@fortawesome/fontawesome-free/css/all.css";

import { h, Component } from "preact";

import LogViewer from "logview/LogViewer.jsx";

import SessionPicker from "sessions/SessionPicker.jsx";

import ModalManager from "ui/ModalManager.jsx";

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sessionKey: "camera",
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

	openSession(sessionKey) {
		this.setState({
			sessionKey: sessionKey
		});
	}

	render(props, state) {
		return <div id="app">
			<ModalManager modalName={state.modalName} modalState={state.modalState} openModal={this.openModal.bind(this)} />

			<SessionPicker sessionKey={state.sessionKey} openSession={this.openSession.bind(this)} openModal={this.openModal.bind(this)} />
			<LogViewer sessionKey={state.sessionKey} openModal={this.openModal.bind(this)} />
		</div>;
	}
};