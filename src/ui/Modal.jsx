import "ui/Modal.styl";

import { h, Component, render } from "preact";

export default class Modal extends Component {
	render(props, state) {
		return <div class="modal fade show" tabindex="-1" role="dialog">
			<div class={`modal-dialog ${props.class || ""}`} role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">{props.title}</h5>
						{!props.noClose && <button class="close" onClick={props.closeModal}>
							<span aria-hidden="true">&times;</span>
						</button>}
					</div>
					{props.children}
				</div>
			</div>
		</div>;
	}
};