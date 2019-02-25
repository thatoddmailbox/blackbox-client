import "ui/ModalManager.styl";

import { h, Component } from "preact";

import ViewDatastreamModal from "logview/ViewDatastreamModal.jsx";

export default class ModalManager extends Component {
	closeModal() {
		this.props.openModal("");
	}

	render(props, state) {
		if (props.modalName == "") {
			return <div class="modalManager"></div>;
		}

		var modals = {
			"viewDatastream": ViewDatastreamModal
		};

		var modalElement = h(modals[props.modalName], {
			modalState: props.modalState,
			openModal: props.openModal,
			closeModal: this.closeModal.bind(this)
		});

		return <div class="modalManager">
			<div class="modal-backdrop fade show" onClick={this.closeModal.bind(this)} />
			{modalElement}
		</div>;
	}
}