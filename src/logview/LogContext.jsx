import { h, Component } from "preact";

import api from "api.js";

import AbsoluteTimestamp from "ui/AbsoluteTimestamp.jsx";
import RelativeTimestamp from "ui/RelativeTimestamp.jsx";

export default class LogContext extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loadingDatastreamables: true
		};
	}

	componentDidMount() {
		this.loadDatastreamableCount();
	}

	loadDatastreamableCount() {
		var that = this;
		this.setState({
			loadingDatastreamables: true
		}, function() {
			api.get(api.server.match, `${this.props.matchKey}/ctx/${this.props.index}/datastreamables/count.txt`, function(success, countStr) {
				var count = parseInt(countStr);
				var datastreamables = [];

				for (var i = 0; i < count; i++) {
					datastreamables.push({
						loading: true
					});
				}

				that.setState({
					loadingDatastreamables: false,
					datastreamableCount: count,
					datastreamables: datastreamables
				}, function() {
					for (var i = 0; i < this.state.datastreamableCount; i++) {
						that.loadDatastreamable.call(that, i);
					}
				});
			});
		});
	}

	loadDatastreamable(i) {
		var that = this;
		api.get(api.server.match, `${this.props.matchKey}/ctx/${this.props.index}/datastreamables/${i}/info.json`, function(success, info) {
			var newDatastreamables = that.state.datastreamables;
			newDatastreamables[i] = info;
			that.setState({
				datastreamables: newDatastreamables
			});
		});
	}

	render(props, state) {
		return <div class="logContext">
			<h4>Context {props.index + 1} - {props.context.name}</h4>
			<dl>
				<dt>Start</dt>
				<dd><RelativeTimestamp startTime={props.startTime} time={props.context.start} /></dd>

				<dt>End</dt>
				<dd><RelativeTimestamp startTime={props.startTime} time={props.context.end} /></dd>
			</dl>
			<div>
				<h5>Facts</h5>
				<dd>
					{Object.keys(props.context.facts).map(function(key) {
						return [
							<dt>{key}</dt>,
							<dl>{props.context.facts[key]}</dl>
						];
					})}
				</dd>
			</div>
			{state.loadingDatastreamables && <div>Loading datastreamables...</div>}
			{!state.loadingDatastreamables && <div>
				{state.datastreamables.map(function(datastreamable, index) {
					if (datastreamable.loading) {
						return <div>
							<h5>Datastreamable {index + 1} - loading...</h5>
						</div>;
					}

					return <div>
						<h5>Datastreamable {index + 1} - {datastreamable.name}</h5>

						<ul>
							{datastreamable.datastreams.map(function(datastream) {
								return <li>{datastream.name}</li>;
							})}
						</ul>
					</div>;
				})}
			</div>}
		</div>;
	}
};