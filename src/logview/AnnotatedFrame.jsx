import "logview/AnnotatedFrame.styl";

import { h, Component } from "preact";

export default class AnnotatedFrame extends Component {
	render(props, state) {
		var displayImageWidth = 450;

		var originalImageWidth = 640;
		var originalImageHeight = 360;

		var scaleFactor = displayImageWidth / originalImageWidth;

		return <div class="annotatedFrame" style={`width:${displayImageWidth}px`}>
			<div class="annotations">
				{props.annotations.map(function(annotation) {
					var width = annotation.right - annotation.left;
					var height = annotation.bottom - annotation.top;

					var scaledTop = scaleFactor * annotation.top;
					var scaledLeft = scaleFactor * annotation.left;
					var scaledWidth = scaleFactor * width;
					var scaledHeight = scaleFactor * height;

					return <div class="annotation" style={`top:${scaledTop}px;left:${scaledLeft}px;width:${scaledWidth}px;height:${scaledHeight}px`}>
						<div class="annotationLabel">{annotation.label} - {annotation.confidence}</div>
					</div>;
				})}
			</div>
			<img src={props.imagePath} />
		</div>;
	}
};