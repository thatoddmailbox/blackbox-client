import "sessions/SelectSessionModal.styl";

import { h, Component } from "preact";

import api from "api.js";

import AbsoluteTimestamp from "ui/AbsoluteTimestamp.jsx";
import Modal from "ui/Modal.jsx";

export default class SelectSessionModal extends Component {
	componentWillMount() {
		var that = this;
		this.setState({
			loading: true
		}, function() {
			api.get(api.server.api, "listCompetitions", function(success, competitionData) {
				api.get(api.server.api, "listSessions", function(success, sessionData) {
					for (var sessionIndex in sessionData) {
						var key = parseInt(sessionData[sessionIndex].path);
						for (var competitionIndex in competitionData) {
							if (competitionData[competitionIndex].sessions.indexOf(key) > -1) {
								sessionData[sessionIndex].competitionIndex = competitionIndex;
								break;
							}
						}
					}
					that.setState({
						loading: false,
						competitions: competitionData,
						sessions: sessionData.reverse()
					});
				});
			});
		});
	}

	selectSession(session, open) {
		this.setState({
			selectedSession: session
		}, function() {
			if (open) {
				this.openSession();
			}
		});
	}

	openSession() {
		this.props.modalState.callback(this.state.selectedSession);
		this.props.closeModal();
	}

	render(props, state) {
		if (state.loading) {
			return <Modal noClose class="selectSessionModal" title="Select session" openModal={props.openModal} closeModal={props.closeModal}>
				<div class="modal-body">
					loading session list...
				</div>
			</Modal>;
		}

		var that = this;

		return <Modal class="selectSessionModal" title="Select session" openModal={props.openModal} closeModal={props.closeModal}>
			<div class="modal-body">
				{state.sessions.map(function(session) {
					var selected = (session == state.selectedSession);

					var badgeColor = "secondary";
					if (session.phase == "TEST") {
						badgeColor = "warning";
					} else if (session.phase == "AUTONOMOUS") {
						badgeColor = "info";
					}

					if (session.corrupted) {
						return <div class="session corrupted">
							Corrupted session
						<div>Key: <code>{session.path}</code></div>
						</div>;
					}

					return <div class={`session ${selected ? "selected" : ""}`} onClick={that.selectSession.bind(that, session, false)} onDblClick={that.selectSession.bind(that, session, true)}>
						<div>
							{session.matchType} - {session.matchLabel || <em>unlabeled</em>} &bull; {session.opmode}
							<span class={`badge badge-${badgeColor}`}>{session.phase}</span>
						</div>
						<div class="sessionCompetition">
							{session.competitionIndex ? state.competitions[session.competitionIndex].name : <em>no competition</em>}
						</div>
						<AbsoluteTimestamp time={session.matchStart} />
						<div>Key: <code>{session.path}</code></div>
					</div>;
				})}
			</div>
			<div class="modal-footer">
				<button onClick={props.closeModal} class="btn btn-secondary">Close</button>
				<button onClick={this.openSession.bind(this)} class="btn btn-primary">Select</button>
			</div>
		</Modal>;
	}
};