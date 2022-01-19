export class ScrapeData {
  photo: string;
  title: string;
  price: string;
  link: string;

  constructor(data: ScrapeData) {

    this.photo = data.photo;
    this.title = data.title;
    this.price = data.price;
    this.link = data.link;
  }
}