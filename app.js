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
    const ipResponse = await this.httpClient.getIP();
    const locationResponse = await this.httpClient.decodeIP(ipResponse);
    if (locationResponse.status === "success") {
      this.renderData(locationResponse);
    } else {
      console.log("Error!", locationResponse.status);
    }
  }

  renderData(locationData) {
    console.log(locationData);
    const { country, city } = locationData;
    const dataContainer = document.createElement("div");
    dataContainer.innerText = `Your country: ${country}. Your city: ${city}`;
    document.body.append(dataContainer);
  }
}

const httpClient = new HttpClient(
  "https://api.ipify.org/?format=json",
  "http://ip-api.com/json/"
);
const findApp = new FindApp(httpClient);
