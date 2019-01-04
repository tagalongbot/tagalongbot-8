<user-profile>
  <div class="row">
    <div class="col s12 m7">
      <div class="card">
        <div class="card-image">
          <img src="{ opts.person.profile_image_url }">
          <span class="card-title">{ opts.person.first_name } { opts.person.last_name }</span>
        </div>
        <div class="card-content">
          <span>Gender: { opts.person.gender }</span>
        </div>
      </div>
    </div>
  </div>

  <div class="container">
    <h3>Photos</h3>
    <div class="carousel">
      <a each="{ opts.person.photos }" class="carousel-item"><img src="{url}"></a>
    </div>
  </div>

  <ul class="collapsible">
    <li>
      <div class="collapsible-header"><i class="material-icons">list</i>Interests</div>
      <div class="collapsible-body">
        <ul>
          <li each="{ interest in opts.person.interests }">{interest.interest}</li>
        </ul>
      </div>
    </li>
    <li>
      <div class="collapsible-header"><i class="material-icons">list</i>Professions</div>
      <div class="collapsible-body">
        <ul>
          <li each="{ profession in opts.person.professions }">{profession.profession}</li>
        </ul>
      </div>
    </li>
  </ul>

</user-profile>