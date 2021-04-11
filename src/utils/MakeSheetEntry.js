/* eslint-disable */
const writeRowInSpreadsheet = (data1, data2, data3) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('X-Requested-With', 'UsingFetch');

  const loc = 'https://maker.ifttt.com/trigger/ACC_INFO/with/key/nkhaXei2ZXn46CrUsq3TCn7H5frRQ_U4vz_eBa8GOyi';
  const d = {
    value1: data1 ? data1 : '',
    value2: data2 ? data2 : '',
    value3: data3 ? data3 : '',
  };

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(d),
    redirect: 'follow',
  };

  // 1. cors anywhere that I downloaded --- https://github.com/Rob--W/cors-anywhere
  // 2. Installed Heroku CLI and then deploy cors-anywhere --- https://dashboard.heroku.com/apps/rahulmisra2000cb/deploy/heroku-git
  // 3. After deployment got this url https://rahulmisra2000cb.herokuapp.com/

  fetch(`https://rahulmisra2000cb.herokuapp.com/${loc}`,
    requestOptions
  ).catch((e) => {
    console.log(e.message);
  });
};

export default writeRowInSpreadsheet;

