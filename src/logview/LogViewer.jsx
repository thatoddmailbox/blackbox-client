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
		if (this.props.matchKey) {
			this.loadMatch(this.props.matchKey);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.matchKey != this.props.matchKey) {
			this.loadMatch(nextProps.matchKey);
		}
	}

	loadMatch(matchKey) {
		var that = this;
		this.setState({
			loading: true,
			matchKey: matchKey
		}, function() {
			api.get(api.server.match, matchKey + "/session.json", function(success, data) {
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

		return <div class="logViewer">
			<h4><i class="fas fa-fw fa-info-circle" /> Match info</h4>
			<div>
				<dl>
					<dt>Label</dt>
					<dd>{session.type} - {session.label || <em>unlabeled</em>}</dd>

					<dt>Phase</dt>
					<dd>{session.phase}</dd>

					<dt>Initialize time</dt>
					<dd><AbsoluteTimestamp time={session.contexts[0].start} /></dd>

					<dt>Start time</dt>
					<dd><AbsoluteTimestamp time={matchStartTime} /></dd>
				</dl>
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
					return <LogContext startTime={matchStartTime} matchKey={state.matchKey} context={context} index={index} openModal={props.openModal} />;
				})}
			</div>
		</div>;
	}
};