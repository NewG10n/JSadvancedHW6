class HttpClient {
  constructor(ipParseUrl, ipDecodeUrl) {
    this.ipParseUrl = ipParseUrl;
    this.ipDecodeUrl = ipDecodeUrl;
  }

  async getIP() {
    try {
      return await (await fetch(this.ipParseUrl)).json();
    } catch (e) {
      console.log("Error in getting IP!", e.message);
    }
  }

  async decodeIP(ip) {
    try {
      return await (await fetch(this.ipDecodeUrl)).json();
    } catch (e) {
      console.log("Error in decoding IP!", e.message);
    }
  }
}

class FindApp {
  constructor(httpClient) {
    this.httpClient = httpClient;
    this.addListeners();
  }

  addListeners() {
    const findBtn = document.querySelector(".find-btn");
    findBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.handleFinder();
    });
  }

  async handleFinder() {
    try {
      const ipResponse = await this.httpClient.getIP();
      const locationResponse = await this.httpClient.decodeIP(ipResponse);
      if (locationResponse.status === "success") {
        this.renderData(locationResponse);
      } else {
        throw new Error(locationResponse.status);
      }
    } catch (e) {
      console.error(e.message);
    }
  }

  renderData(locationData) {
    const { country, city, zip, lat, lon } = locationData;
    const dataContainer = document.createElement("div");
    const message = document.createElement("h2");
    const mapLink = document.createElement("a");

    message.innerText = `Caught! You live in ${city}, ${country}, ${zip}. I will find your here: `;
    mapLink.href = `https://www.google.com/maps/@${lat},${lon},16z`;
    mapLink.innerText = "Your location";

    dataContainer.append(message, mapLink);

    document.body.append(dataContainer);
  }
}

const httpClient = new HttpClient(
  "https://api.ipify.org/?format=json",
  "https://ip-api.com/json/"
);
const findApp = new FindApp(httpClient);
