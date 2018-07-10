<leads-list>
  <div class="row" each="{ lead in opts.leads }">
    <div class="col s12 m6">
      <div class="card pink lighten-1">
        <div class="card-content white-text">
          <span class="card-title">{ lead.name }</span>
          <span>Call By: { lead.name } ({ lead.gender })</span><br>
          <span>Call Date: { lead.call_date }</span><br>
          <span>Phone Number: { lead.phone_number }</span><br>
          <span>Promotion Claimed: { lead.promotion_name }</span><br>
          <a if="{ lead.recording_url }" href="{ lead.recording_url }">Listen To Call Recording</a><br>
        </div>
      </div>
    </div>
  </div>
</leads-list>