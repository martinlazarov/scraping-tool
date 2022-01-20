export class ScrapeData {
  photo: string;
  title: string;
  price: number;
  currency: string
  link: string;

  constructor(data: ScrapeData) {

    this.photo = data.photo;
    this.title = data.title;
    this.price = data.price;
    this.currency = data.currency
    this.link = data.link;
  }
}