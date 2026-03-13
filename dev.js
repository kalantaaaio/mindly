console.log("hhhhhh");

document.addEventListener("DOMContentLoaded", async () => {
  const BASE_URL =
    "https://europe-west1-ihub-projects-developmen-af75f.cloudfunctions.net/v79Api";

  const clientData = "/clientsApp/client/referrals/webflow/UojSvfD";

  const buttonElements = document.querySelectorAll(".btn-main");
  const namesElements = document.querySelectorAll(".promo-name");
  const discpuntElements = document.querySelectorAll(".discount-num");

  const getData = async () => {
    const url = `${BASE_URL}${clientData}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(error.message);
    }
  };
  const res = await getData();

  const linkUrl = res.data.deepLink;
  const name = res.data.name;
  const code = res.data.referral_code;

  console.log(res);

  buttonElements.forEach((el) => {
    el.setAttribute("href", linkUrl);
  });
  namesElements.forEach((el) => {
    el.textContent = name;
  });

  discpuntElements.forEach((el) => {
    el.textContent = code;
  });
});
