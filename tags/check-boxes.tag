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
</check-boxes>