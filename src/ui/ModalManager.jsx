import "ui/ModalManager.styl";

import { h, Component } from "preact";

import ViewDatastreamModal from "logview/ViewDatastreamModal.jsx";

import SelectSessionModal from "sessions/SelectSessionModal.jsx";

export default class ModalManager extends Component {
	closeModal() {
		this.props.openModal("");
	}

	componentWillReceiveProps(newProps) {
		if (newProps.modalName == "") {
			document.querySelector("body").classList.remove("modal-open");
		} else {
			if (!document.querySelector("body").classList.contains("modal-open")) {
				document.querySelector("body").classList.add("modal-open");
			}
		}
	}

	render(props, state) {
		if (props.modalName == "") {
			return <div class="modalManager"></div>;
		}

		var modals = {
			"selectSession": SelectSessionModal,
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