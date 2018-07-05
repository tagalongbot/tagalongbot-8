<week-calls>
  <div class="row" each="{ call in opts.calls }">
    <div class="col s12 m6">
      <div class="card blue-grey darken-1">
        <div class="card-content white-text">
          <span class="card-title">{ call.caller_name }</span>
          <p>Call By { call.caller_name }.<br>Last Claimed Promotion: { call.caller_promo_name }</p>
        </div>
        <div class="card-action">
          <a href="{ call.call_url }">Call { call.caller_first_name } Back</a>
        </div>
      </div>
    </div>
  </div>
</week-calls>