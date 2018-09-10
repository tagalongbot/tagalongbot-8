let { getRunnerByMessengerID, getAllRunners, createRunner } = require('../../libs/data/runners.js');

let { createBtn, createGallery } = require('../../libs/bots.js');

let createNewRunner = async (data) => {
  let { messenger_user_id, first_name, last_name, gender, zip_code, messenger_link, profile_pic_url } = data;

  let new_runner_data = {
    ['messenger user id']: messenger_user_id,
    ['Active?']: true,
    ['First Name']: first_name,
    ['Last Name']: last_name,
    ['Gender']: gender,
    ['Zip Code']: Number(zip_code),
    ['Messenger Link']: messenger_link,
    ['Profile Image URL']: profile_pic_url,
  }

  let new_runner = await createRunner(new_runner_data);

  return new_runner;
}

let toGalleryData = (search_runner) => (runner) => {
  let runner_messenger_user_id = runner.fields['messenger_user_id'];

  let title = `${runner.fields['First Name']} ${runner.fields['Last Name']}`;
  let image_url = `${runner.fields['Profile Image URL']}`;

  let send_request_btn = createBtn(
    `Send Request|show_block|[JSON] Send Partner Request`,
    { runner_messenger_user_id }
  );

  let buttons = [send_request_btn];

  return { title, image_url, buttons };
}

let searchRunners = async ({ query }, res) => {
  let {
    messenger_user_id,
    first_name,
    last_name,
    gender,
    messenger_link,
    search_gender,
    search_miles,
    zip_code,
    profile_pic_url
  } = query;
  console.log('query', query);

  let runner = await getRunnerByMessengerID(messenger_user_id);

  if (!runner) {
    runner = await createNewRunner(
      { messenger_user_id, first_name, last_name, gender, zip_code, messenger_link, profile_pic_url }
    );

    console.log('runner', runner);
  }

  let mile_radius = {
    ['5 Miles']: 5,
    ['10 Miles']: 10,
    ['15 Miles']: 15,
    ['20 Miles']: 20,
  }[search_miles];

  console.log('mile_radius', mile_radius);

  let runners = await searchRunners(
    { zip_code, mile_radius }
  );

  console.log('runners', runners);

  let matched_runners = runners.filter(
    runner => runner.fields['Gender'].toLowerCase() === search_gender.toLowerCase()
  );

  if (!matched_runners[0]) {
    let redirect_to_blocks = ['No Running Partners Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let gallery_data = runners.map(
    toGalleryData(runner)
  );

  let gallery = createGallery(
    gallery_data
  );

  let messages = [gallery];

  res.send({ messages });
}

module.exports = searchRunners;