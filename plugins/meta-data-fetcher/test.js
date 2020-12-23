const {fetch} = require('./services/meta-data-fetcher');


const data = fetch('https://www.bunte.de/starprofile/helene-fischer.html')
data.then(d=> {
  console.log(d);
})