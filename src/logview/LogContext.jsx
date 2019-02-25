import "logview/LogContext.styl";

import { h, Component } from "preact";

import api from "api.js";

import LogDatastream from "logview/LogDatastream.jsx";

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
			newDatastreamables[i].index = i;
			that.setState({
				datastreamables: newDatastreamables
			});
		});
	}

	render(props, state) {
		var that = this;

		return <div class="logContext">
			<h4><i class="fas fa-fw fa-code" /> Context {props.index + 1} - {props.context.name}</h4>
			<dl>
				<dt>Start</dt>
				<dd><RelativeTimestamp startTime={props.startTime} time={props.context.start} /></dd>

				<dt>End</dt>
				<dd><RelativeTimestamp startTime={props.startTime} time={props.context.end} /></dd>
			</dl>
			<div>
				<h5><i class="fas fa-fw fa-info-circle" /> Facts</h5>
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
							<h5><i class="fas fa-fw fa-stream" /> Datastreamable {index + 1} - loading...</h5>
						</div>;
					}

					return <div class="logContextDatastreamable">
						<h5><i class="fas fa-fw fa-stream" /> Datastreamable {index + 1} - {datastreamable.name}</h5>

						<ul>
							{datastreamable.datastreams.map(function(datastream, datastreamIndex) {
								return <LogDatastream startTime={props.startTime} matchKey={props.matchKey} contextIndex={props.index} datastreamable={datastreamable} datastreamIndex={datastreamIndex} openModal={props.openModal} />;
							})}
						</ul>
					</div>;
				})}
			</div>}
		</div>;
	}
};