<user-profile>
  <!-- Use Materialize CSS -->
  <div class="row">
    <div class="col s12 m7">
      <div class="card">
        <div class="card-image">
          <img src="{ opts.person.profile_image_url }">
          <span class="card-title">{ opts.person.first_name } { opts.person.last_name }</span>
        </div>
        <div class="card-content">
          <span>Gender: { opts.person.gender }</span>
          <br>
          <span>Activities: { opts.person.interests }</span>
        </div>
      </div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Item Name</th>
        <th>Item Price</th>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td>Alvin</td>
        <td>Eclair</td>
        <td>$0.87</td>
      </tr>
      <tr>
        <td>Alan</td>
        <td>Jellybean</td>
        <td>$3.76</td>
      </tr>
      <tr>
        <td>Jonathan</td>
        <td>Lollipop</td>
        <td>$7.00</td>
      </tr>
    </tbody>
  </table>
</user-profile>