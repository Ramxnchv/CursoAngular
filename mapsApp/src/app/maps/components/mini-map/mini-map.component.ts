import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';

@Component({
  selector: 'map-mini-map',
  templateUrl: './mini-map.component.html',
  styleUrls: ['./mini-map.component.css']
})
export class MiniMapComponent implements AfterViewInit {

  @Input()
  public lngLat?: [number, number];

  @ViewChild('map')
  public divMap?: ElementRef<HTMLDivElement>;

  public map?: Map;

  ngAfterViewInit(): void {
    if (!this.divMap?.nativeElement) throw new Error('divMap is required');
    if (!this.lngLat) throw new Error('lngLat is required');

    const map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.lngLat, // starting position [lng, lat]
      zoom: 15, // starting zoom
      interactive: false
    });

    const marker = new Marker({
      color: 'red',
      draggable: true
    })
      .setLngLat(this.lngLat)
      .addTo(map);
  }


}
