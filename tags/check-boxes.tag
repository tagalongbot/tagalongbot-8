<check-boxes>
  <!-- Use Materialize CSS -->
  <h3 class="center-align">{ opts.title }</h3>
  <div class="container">
    <div each="{ option in opts.options }">
      <h5>{ option.title }</h5>
      <p each="{ option.check_boxes }">
        <label>
          <input if="{ checked == false }" type="checkbox" class="filled-in" onclick="{ parent.toggle }" />
          <input if="{ checked == true }" type="checkbox" class="filled-in" checked="checked" onclick="{ parent.toggle }" />
          <span>{ label }</span>
        </label>
      </p>
    </div>
  </div>
  <div class="container">
    <button ref="thebutton" class="btn waves-effect waves-light right" type="submit" name="action">Update
      <i class="material-icons right">done</i>
    </button>
  </div>

  <script>
    let self = this;
    self.options = opts.options;

    self.toggle = function (e) {
      var item = e.item;
      item.checked = !item.checked;
    }

    let onFormSubmit = function(evt) {
      evt.preventDefault();
      let url = `${opts.BASEURL}/people/update/interests_professions`;
      let method = 'POST';

      let headers = {
        'Content-Type': 'application/json',
      }

      let data = self.options.map(opt => 
        opt.check_boxes.filter(check_box => check_box.checked)
      );

      let body = {
        messenger_user_id: opts.messenger_user_id,
        data
      }

      let options = { method, headers, body: JSON.stringify(body) };

      fetch(url, options).then(res => res.json()).then(res => {
        if(res.msg === 'UPDATED') {
          M.toast({html: `Your Interests & Professions Were Updated. You Can Now Close This WebView`});
        }
      });
    }

    self.on('mount', function(eventName) {
      self.refs.thebutton.onclick = onFormSubmit;
    });
  </script>
</check-boxes>