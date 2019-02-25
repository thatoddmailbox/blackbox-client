import "logview/ViewDatastreamModal.styl";

import { h, Component } from "preact";

import api from "api.js";
import data from "data.js";

import AnnotatedFrame from "logview/AnnotatedFrame.jsx";

import Modal from "ui/Modal.jsx";
import RelativeTimestamp from "ui/RelativeTimestamp.jsx";

export default class ViewDatastreamModal extends Component {
	componentWillMount() {
		var that = this;
		this.setState({
			loading: true
		}, function() {
			var modalState = that.props.modalState;
			var datastreamable = modalState.datastreamable;
			var datastreamIndex = modalState.datastreamIndex;

			api.get(api.server.match, `${modalState.matchKey}/ctx/${modalState.contextIndex}/datastreamables/${datastreamable.index}/${datastreamIndex}.csv`, function(success, dataText) {
				var dataArray = data.parseDataText(dataText, 0, JSON.parse);

				that.setState({
					loading: false,
					data: dataArray,
					viewIndex: 0
				});
			});
		});
	}

	changeView(offset) {
		var newIndex = this.state.viewIndex + offset;
		if (newIndex < 0 || newIndex >= this.state.data.length) {
			return;
		}
		this.setState({
			viewIndex: newIndex
		});
	}

	render(props, state) {
		if (state.loading) {
			return <Modal noClose class="modal-lg" title="View datastream" openModal={props.openModal} closeModal={props.closeModal}>
				<div class="modal-body">
					loading data...
				</div>
			</Modal>;
		}

		var modalState = props.modalState;

		var currentPoint = state.data[state.viewIndex];
		
		var imagePath = `${api.server.match}${modalState.matchKey}/ctx/${modalState.contextIndex}/datastreamables/${modalState.datastreamable.index}/${modalState.datastreamIndex}_img/${currentPoint[0]}.png`;

		var objectCount = currentPoint[1].length;

		return <Modal class="viewDatastreamModal" title="View datastream" openModal={props.openModal} closeModal={props.closeModal}>
			<div class="modal-body">
				<div class="frameControls row">
					<div class="col-md-3">
						<button class="btn btn-primary viewDatastreamPrev" onClick={this.changeView.bind(this, -1)}>&laquo;</button>
					</div>
					<div class="col-md-6">{state.viewIndex + 1} out of {state.data.length}</div>
					<div class="col-md-3 viewDatastreamNextContainer">
						<button class="btn btn-primary viewDatastreamNext" onClick={this.changeView.bind(this, 1)}>&raquo;</button>
					</div>
				</div>
				<AnnotatedFrame annotations={currentPoint[1]} imagePath={imagePath} />
				<div class="frameInfo">
					<div><RelativeTimestamp time={currentPoint[0]} startTime={modalState.startTime} /></div>
					<div>{objectCount} object{objectCount != 1 ? "s" : ""} found</div>
				</div>
			</div>
			<div class="modal-footer">
				<button onClick={props.closeModal} class="btn btn-primary">Close</button>
			</div>
		</Modal>;
	}
};