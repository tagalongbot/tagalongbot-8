let BUTTON_TYPES = {
	show_block: 'block_name',
	web_url: 'url',
	json_plugin_url: 'url',
	phone_number: 'phone_number'
}

exports.createButtonMessage = function(text, ...btns) {
	let buttons = btns.map(function(button) {
		let [title, btnType, value] = button.split('|');
		let type = btnType.toLowerCase();
		let typeName = BUTTON_TYPES[type];
		let btn = { title, type, [typeName]: value }
		return btn;
	});

	let payload = {
		text,
		buttons,
		template_type: 'button'
	}

	let attachment = {
		payload,
		type: 'template'
	}

	return { attachment };
}

exports.createGallery = function(elements, image_aspect_ratio = 'horizontal') {
	//check for errors in "elements"
	let payload = {
		template_type: 'generic',
		image_aspect_ratio,
		elements
	}

	let attachment = {
		payload,
		type: 'template'
	}

	return { attachment };
}

exports.createMultiGallery = function(elements) {
  
}

exports.createImage = function(url) {
	let attachment = {
		type: 'image',
		payload: { url }
	}

	return { attachment };
}

exports.createTextMessage = function(text) {
	return { text };
}