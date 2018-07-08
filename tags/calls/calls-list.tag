<calls-list>
  <div class="row" each="{ call in opts.calls }">
    <div class="col s12 m6">
      <div class="card pink lighten-1">
        <div class="card-content white-text">
          <span class="card-title">{ call.caller_name }</span>
          <span>Call By: { call.caller_name }</span><br>
          <span>Call Date: { call.call_date }</span><br>
          <span>Promotion Claimed: { call.promotion_name }</span><br>
        </div>
      </div>
    </div>
  </div>
</calls-list>