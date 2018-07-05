<week-calls>
  <div class="row" each="{ call in opts.calls }">
    <div class="col s12 m6">
      <div class="card pink lighten-1">
        <div class="card-content white-text">
          <span class="card-title">{ call.caller_name }</span>
          <span>Call By: { call.caller_name }</span><br>
          <span>Call Date: { call.call_date }</span><br>
          <span>Last Claimed Promotion: { call.caller_promo_name }</span><br>
        </div>
        <div class="card-action">
          <a class="grey-text lighten-3-text" href="{ call.call_url }">Call { call.caller_first_name } Back</a>
        </div>
      </div>
    </div>
  </div>
</week-calls>