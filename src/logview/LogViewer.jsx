import "logview/LogViewer.styl";

import { h, Component } from "preact";

import api from "api.js";

import LogContext from "logview/LogContext.jsx";

import AbsoluteTimestamp from "ui/AbsoluteTimestamp.jsx";
import RelativeTimestamp from "ui/RelativeTimestamp.jsx";

export default class LogViewer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true
		};
	}

	componentDidMount() {
		if (this.props.sessionKey) {
			this.loadMatch(this.props.sessionKey);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.sessionKey != this.props.sessionKey) {
			this.loadMatch(nextProps.sessionKey);
		}
	}

	loadMatch(sessionKey) {
		var that = this;
		this.setState({
			loading: true,
			sessionKey: sessionKey
		}, function() {
			api.get(api.server.match, sessionKey + "/session.json", function(success, data) {
				that.setState({
					loading: false,
					session: data
				});
			});
		});
	}

	render(props, state) {
		if (state.loading) {
			return <div class="logViewer">
				Loading...
			</div>;
		}

		var session = state.session;
		var matchStartTime = session.matchStart;

		var annotations = [];
		session.contexts.forEach(function(context, index) {
			if (index > 0) {
				annotations.push({
					series: "value",
					x: context.start - matchStartTime,
					shortText: (index + 1).toString()
				});
				annotations.push({
					series: "value",
					x: context.end - matchStartTime,
					shortText: (index + 1).toString()
				});
			}
		});

		return <div class="logViewer">
			<h4><i class="fas fa-fw fa-info-circle" /> Match info</h4>
			<div>
				<ul>
					<li>Label: {session.type} - {session.label || <em>unlabeled</em>}</li>
					<li>Phase: {session.phase}</li>
					<li>Initialize time: <AbsoluteTimestamp time={session.contexts[0].start} /></li>
					<li>Start time: <AbsoluteTimestamp time={matchStartTime} /></li>
					<li>Key: <code>{state.sessionKey}</code></li>
				</ul>
			</div>

			<h4><i class="fas fa-fw fa-cogs" /> Options</h4>
			{session.options && <ul>
				{Object.keys(session.options).map(function(name) {
					var value = session.options[name];
					return <li>{name}: {value}</li>;
				})}
			</ul>}
			{!session.options && <div>No options stored with this log session.</div>}

			<div>
				{session.contexts.map(function(context, index) {
					return <LogContext startTime={matchStartTime} sessionKey={state.sessionKey} context={context} index={index} annotations={annotations} openModal={props.openModal} />;
				})}
			</div>
		</div>;
	}
};