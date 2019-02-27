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
			api.get(api.server.match, `${this.props.sessionKey}/ctx/${this.props.index}/datastreamables/count.txt`, function(success, countStr) {
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
		api.get(api.server.match, `${this.props.sessionKey}/ctx/${this.props.index}/datastreamables/${i}/info.json`, function(success, info) {
			var newDatastreamables = that.state.datastreamables;
			newDatastreamables[i] = info;
			newDatastreamables[i].index = i;
			that.setState({
				datastreamables: newDatastreamables
			});
		});
	}

	setDisplayAnnotations(e) {
		this.setState({
			displayAnnotations: e.target.checked
		});
	}

	render(props, state) {
		var that = this;

		return <div class="logContext">
			<h4><i class="fas fa-fw fa-code" /> Context {props.index + 1} - {props.context.name}</h4>
			<ul>
				<li>Start: <RelativeTimestamp startTime={props.startTime} time={props.context.start} /></li>
				<li>End: <RelativeTimestamp startTime={props.startTime} time={props.context.end} /></li>
			</ul>
			<div>
				<h5><i class="fas fa-fw fa-info-circle" /> Facts</h5>
				<ul>
					{Object.keys(props.context.facts).map(function(key) {
						return <li>{key}: {props.context.facts[key]}</li>;
					})}
				</ul>
			</div>
			{state.loadingDatastreamables && <div>Loading datastreamables...</div>}
			{/* {!state.loadingDatastreamables && props.index == 0 && <div>
				<label><input type="checkbox" checked={!!state.displayAnnotations} onChange={this.setDisplayAnnotations.bind(this)} /> Show context annotations on graphs</label>
			</div>} */}
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
								return <LogDatastream
									startTime={props.startTime}

									sessionKey={props.sessionKey}
									contextIndex={props.index}
									datastreamable={datastreamable}
									datastreamIndex={datastreamIndex}

									displayAnnotations={!!state.displayAnnotations}
									annotations={props.annotations}

									openModal={props.openModal}
								/>;
							})}
						</ul>
					</div>;
				})}
			</div>}
		</div>;
	}
};