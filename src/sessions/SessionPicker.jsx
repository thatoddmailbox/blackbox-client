import { h, Component } from "preact";

export default class SessionPicker extends Component {
	selectSession() {
		var that = this;
		this.props.openModal("selectSession", {
			callback: function(session) {
				that.props.openSession(session.path);
			}
		});
	}

	render(props, state) {
		return <div class="sessionPicker">
			<button class="btn btn-primary" onClick={this.selectSession.bind(this)}>Select session</button>
		</div>;
	}
};