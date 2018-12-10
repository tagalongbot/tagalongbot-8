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
  <button ref="thebutton" class="btn waves-effect waves-light" type="submit" onclick="">Submit
    <i class="material-icons right">send</i>
  </button>

  <script>
    let self = this;
    self.options = opts.options;

    let onFormSubmit = function(evt) {
      evt.preventDefault();
      
    }

    self.on('mount', function(eventName) {
      self.refs.thebutton.onclick = onFormSubmit;
    });
  </script>
</check-boxes>