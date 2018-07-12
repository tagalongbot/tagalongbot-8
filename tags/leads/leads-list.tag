<leads-list>
  <div class="card pink lighten-1" each="{ lead in opts.leads }">

    <div class="card-content white-text">
      <span class="card-title">{ lead.name }</span>
      <span>Lead Name: { lead.name } ({ lead.gender })</span><br>
      <span>Phone Number: { lead.phone_number }</span><br>
      <span>Promotion Claimed: { lead.promotion_name }</span><br>
      <span>Initiated Call: { lead.initiated_call }</span><br>
    </div>

    <div if="{ lead.call_date || lead.follow_up_1_date || lead.follow_up_2_date }" class="card-tabs">
      <ul class="tabs tabs-fixed-width">
        <li if="{ lead.call_date }" class="tab"><a class="active" href="#callInfo">Call Info</a></li>
        <li if="{ lead.follow_up_1_date }" class="tab"><a href="#followUp1">Follow Up 1</a></li>
        <li if="{ lead.follow_up_2_date }" class="tab"><a href="#followUp2">Follow Up 2</a></li>
      </ul>
    </div>

    <div if="{ lead.call_date || lead.follow_up_1_date || lead.follow_up_2_date }" class="card-content grey lighten-4">

      <div if="{ lead.call_date }" id="callInfo">
        <span>Call Date: { lead.call_date }</span><br>
        <span if="{ lead.call_duration }" >Call Duration: { lead.call_duration }</span><br>
        <a if="{ lead.recording_url }" href="{ lead.recording_url }">Click To Listen To Call Recording</a><br>
      </div>
      
      <div if="{ lead.follow_up_1_date }" id="followUp1">
        <span>Follow Up Date: { lead.follow_up_1_date }</span><br>
        <span>Follow Up Notes: { lead.follow_up_1_notes }</span><br>
      </div>
      
      <div if="{ lead.follow_up_2_date }" id="followUp2">
        <span>Follow Up Date: { lead.follow_up_2_date }</span><br>
        <span>Follow Up Notes: { lead.follow_up_2_notes }</span><br>
      </div>
      
    </div>
  </div>
</leads-list>