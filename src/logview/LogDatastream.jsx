import "logview/LogDatastream.styl";

import { h, Component } from "preact";

import api from "api.js";

import DataGraph from "logview/DataGraph.jsx";

export default class LogDatastream extends Component {
	graphDatastream(datastreamable, datastreamIndex) {
		var that = this;
		var datastream = this.props.datastreamable.datastreams[this.props.datastreamIndex];

		this.setState({
			loading: true
		}, function() {
			api.get(api.server.match, `${this.props.matchKey}/ctx/${this.props.contextIndex}/datastreamables/${datastreamable.index}/${this.props.datastreamIndex}.csv`, function(success, data) {
				var dataLines = data.split("\n");
				var data = [];
				for (var i = 1; i < dataLines.length; i++) {
					var line = dataLines[i];
					var lineParts = line.split(",");
					var point = [
						parseInt(lineParts[0]) - that.props.startTime,
						parseFloat(lineParts[1])
					];
					if (!isNaN(point[0])) {
						data.push(point);
					}
				}

				that.setState({
					loading: false,
					displayGraph: true,
					data: data
				});
			});
		});
	}

	render(props, state) {
		var datastream = props.datastreamable.datastreams[props.datastreamIndex];

		return <li class="logDatastream">
			<span class="logDatastreamName">{datastream.name}</span>
			{(!state.loading && !state.displayGraph) && <button class="btn btn-sm btn-secondary" onClick={this.graphDatastream.bind(this, props.datastreamable, props.datastreamIndex)}>graph</button>}
			{state.loading && <span><em>loading data...</em></span>}
			{state.displayGraph && <div>
				<DataGraph data={state.data} csvPath={api.server.match + `${props.matchKey}/ctx/${props.contextIndex}/datastreamables/${props.datastreamable.index}/${props.datastreamIndex}.csv`} />
			</div>}
		</li>;
	}
};