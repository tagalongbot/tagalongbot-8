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
  <button ref="submit_btn" class="btn waves-effect waves-light" type="submit" name="action">Submit
    <i class="material-icons right">send</i>
  </button>
  
  <script>
    let self = this;
    
    self.on
  </script>
</check-boxes>