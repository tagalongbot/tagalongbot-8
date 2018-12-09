<check-boxes>
  <!-- Use Materialize CSS -->
  <h3 class="center-align">{ opts.title }</h3>
  <p each="{ opts.options }">
    <label>
      <input type="checkbox" class="filled-in" checked="{ value }" />
      <span>{ label }</span>
    </label>
  </p>
</check-boxes>