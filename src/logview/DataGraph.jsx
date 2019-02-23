import { h, Component } from "preact";

import Dygraph from "dygraphs";

export default class DataGraph extends Component {
	componentDidMount(previousProps, previousState) {
		if (!this._chart && this._canvasRef) {
			console.table(this.props.data);
			this._chart = new Dygraph(this._canvasRef, this.props.data, {
				labels: [ "time", "value" ]
			});
		}
	}

	render(props, state) {
		return <div class="dataGraph">
			<div ref={(function(canvas) {
				this._canvasRef = canvas;
			}.bind(this))} style="width: 400px; height: 200px;" />
		</div>
	}
};