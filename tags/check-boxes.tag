<check-boxes>
  <!-- Use Materialize CSS -->
  <h3 class="center-align">{ opts.title }</h3>
  <p each="{ opts.options }">
    <label>
      <input if="{ checked == false }" type="checkbox" class="filled-in" />
      <input if="{ checked == true }" type="checkbox" class="filled-in" checked="checked" />
      <span>{ label }</span>
    </label>
  </p>
  <button ref="thebutton" class="btn waves-effect waves-light" type="submit" name="action">Submit
    <i class="material-icons right">send</i>
  </button>

  <script>
    let self = this;
    self.options = opts.options;

    let onFormSubmit = function(evt) {
      evt.preventDefault();
      console.log('options', self.options);
    }

    self.on('mount', function(eventName) {
      console.log('mounted');
      self.refs.thebutton.onclick = onFormSubmit;
    });
  </script>
</check-boxes>