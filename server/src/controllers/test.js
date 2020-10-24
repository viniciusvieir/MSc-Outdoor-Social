const query = {
  start: {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [53.285268, -6.239517],
      },
    },
  },
}

fetch(`http://localhost:4040/trails?q=${JSON.stringify(query)}`)
  .then((response) => response.json())
  .then((data) => console.log(data))
