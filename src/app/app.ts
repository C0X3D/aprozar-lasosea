import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BannerCarousel } from "./components/banner-carousel/banner-carousel";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BannerCarousel],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'catalog-aprozar';
}
