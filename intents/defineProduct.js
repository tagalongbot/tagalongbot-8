let { getService } = require('../libs/intents/defineProduct.js');
let { createFindPracticesMsg } = require('../libs/services/description.js');

let defineProduct = async({ res, parameters, user }) => {
  let { brand_name, procedure } = parameters;

  let { messenger_user_id, first_name, last_name, gender } = user;

  let service = await getService({ brand_name, procedure });

  if (!service) {
    let redirect_to_blocks = ['No Service Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let service_id = service.id;

  let msg = createFindPracticesMsg({ service, service_id, messenger_user_id, first_name, last_name, gender });

  let messages = [msg];
  res.send({ messages });
}

module.exports = defineProduct;