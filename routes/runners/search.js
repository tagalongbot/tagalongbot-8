let { getRunnerByMessengerID, searchNearbyRunners, createRunner } = require('../../libs/data/runners.js');

let { uploadCloudinaryImage, getFaceFromImage } = require('../../libs/cloudinary.js');

let { createGallery } = require('../../libs/bots.js');

let { createRunnersCards } = require('../../libs/runners/search.js');

let searchRunners = async ({ query }, res) => {
  let { messenger_user_id, search_gender, search_miles, zip_code } = query;

  let runner_searching = await getRunnerByMessengerID(messenger_user_id);

  let mile_radius = {
    ['5 Miles']: 5,
    ['10 Miles']: 10,
    ['15 Miles']: 15,
    ['20 Miles']: 20,
  }[search_miles];

  let runners = await searchNearbyRunners(
    { zip_code, mile_radius }
  );

  let matched_runners = runners.filter(
    runner =>
      runner.id != runner_searching.id &&
      runner.fields['Gender'].toLowerCase() === search_gender.toLowerCase()
  );

  if (!matched_runners[0]) {
    let redirect_to_blocks = ['No Running Partners Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let gallery_data = matched_runners.map(
    createRunnersCards(runner_searching)
  );

  let gallery = createGallery(gallery_data, 'square');

  let messages = [gallery];

  res.send({ messages });
}

module.exports = searchRunners;