import "logview/LogDatastream.styl";

import { h, Component } from "preact";

import api from "api.js";
import data from "data.js";

import DataGraph from "logview/DataGraph.jsx";

export default class LogDatastream extends Component {
	displayDataModal(datastreamable, datastreamIndex) {
		this.props.openModal("viewDatastream", {
			startTime: this.props.startTime,
			matchKey: this.props.matchKey,
			contextIndex: this.props.contextIndex,
			datastreamable: datastreamable,
			datastreamIndex: datastreamIndex
		});
	}

	graphDatastream(datastreamable, datastreamIndex) {
		var that = this;
		var datastream = this.props.datastreamable.datastreams[this.props.datastreamIndex];

		this.setState({
			loading: true
		}, function() {
			api.get(api.server.match, `${this.props.matchKey}/ctx/${this.props.contextIndex}/datastreamables/${datastreamable.index}/${this.props.datastreamIndex}.csv`, function(success, dataText) {
				var dataArray = data.parseDataText(dataText, that.props.startTime, parseFloat);

				that.setState({
					loading: false,
					displayGraph: true,
					data: dataArray
				});
			});
		});
	}

	render(props, state) {
		var datastream = props.datastreamable.datastreams[props.datastreamIndex];

		return <li class="logDatastream">
			<span class="logDatastreamName">{datastream.name}</span>
			{!datastream.images && <span>
				{(!state.loading && !state.displayGraph) && <button class="btn btn-sm btn-secondary" onClick={this.graphDatastream.bind(this, props.datastreamable, props.datastreamIndex)}>graph</button>}
				{state.loading && <span><em>loading data...</em></span>}
				{state.displayGraph && <div>
					<DataGraph data={state.data} csvPath={api.server.match + `${props.matchKey}/ctx/${props.contextIndex}/datastreamables/${props.datastreamable.index}/${props.datastreamIndex}.csv`} />
				</div>}
			</span>}
			{datastream.images && <button class="btn btn-sm btn-secondary" onClick={this.displayDataModal.bind(this, props.datastreamable, props.datastreamIndex)}>view data</button>}
		</li>;
	}
};