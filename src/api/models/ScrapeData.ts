export class ScrapeData {
    photo: string;
    title: string;
    price: string;
    url: string;
  
    constructor(data: ScrapeData) {
    
      this.photo = data.photo;
      this.title = data.title;
      this.price = data.price;
      this.url = data.url;
    }
  }