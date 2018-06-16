let BUTTON_TYPES = {
	show_block: 'block_name',
	web_url: 'url',
	json_plugin_url: 'url',
	phone_number: 'phone_number'
}

let createBtn = (button) => {
  let [title, btnType, value] = button.split('|');
  let type = btnType.toLowerCase();
  let typeName = BUTTON_TYPES[type];
  let btn = { title, type, [typeName]: value }
  return btn;
}

let createButtonMessage = (text, ...btns) => {
	let buttons = btns.map(createBtn);

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

let createGallery = (elements, image_aspect_ratio = 'horizontal') => {
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

let createMultiGallery = (elements, split_count = 10) => {
  let galleryArray = [];

  while (elements.length > 0) {
    galleryArray.push(
      createGallery(elements.splice(0, split_count))
    );
  }

  return galleryArray;
}

let createImage = (url) => {
	let attachment = {
		type: 'image',
		payload: { url }
	}

	return { attachment };
}

let createTextMessage = (text) => {
	return { text };
}

module.exports = {
  createBtn,
  createButtonMessage,
  createGallery,
  createMultiGallery,
  createImage,
  createTextMessage,
}