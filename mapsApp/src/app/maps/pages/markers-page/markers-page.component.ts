import { Component, ElementRef, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';

interface MarkerColor {
  color: string;
  marker?: Marker;
}

interface PlainMarker {
  color: string;
  lngLat: [number, number];
}

@Component({
  templateUrl: './markers-page.component.html',
  styleUrls: ['./markers-page.component.css']
})
export class MarkersPageComponent {

  @ViewChild('map') 
  public divMap?: ElementRef<HTMLDivElement>;

  public markers: MarkerColor[] = [];

  public map?: Map;
  public center: LngLat = new LngLat(-3.69, 40.41);

  ngAfterViewInit(): void {
    if(!this.divMap) throw new Error('Div map not found');

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.center, // starting position [lng, lat]
      zoom: 13, // starting zoom
    });

    this.readFromLocalStorage();

    // const markerHtml: HTMLElement = document.createElement('div');
    // markerHtml.innerHTML = 'Ramón';

    // const marker = new Marker({
    //   // color: 'red',
    //   element: markerHtml
    // })
    //   .setLngLat(this.center)
    //   .addTo(this.map);

  }

  createMarker(): void {
    if(!this.map) return;
    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const lngLat = this.map.getCenter();
    this.addMarker(lngLat, color);
  }

  addMarker(lngLat: LngLat, color: string): void {
    if(!this.map) throw new Error('Map not found');

    const marker = new Marker({
      color,
      draggable: true
    })
      .setLngLat(lngLat)
      .addTo(this.map);

    this.markers.push({marker, color});
    this.saveToLocalStorage();

    marker.on('dragend', () => this.saveToLocalStorage());
  }

  flyTo(marker: Marker): void {
    this.map?.flyTo({
      zoom: 14,
      center: marker.getLngLat()
    });
  }

  saveToLocalStorage(): void {
    console.log('hola')
    const plainMarkers: PlainMarker[] = this.markers.map(m => ({
      color: m.color,
      lngLat: m.marker?.getLngLat().toArray() as [number, number]
    }));

    localStorage.setItem('markers', JSON.stringify(plainMarkers));

  }

  readFromLocalStorage(): void {

    if(!localStorage.getItem('markers')) return;

    const plainMarkers: PlainMarker[] = JSON.parse(localStorage.getItem('markers') ?? '[]');

    plainMarkers.forEach(m => {
      this.addMarker(new LngLat(m.lngLat[0], m.lngLat[1]), m.color);
    });

  }

  deleteMarker(index: number): void {
    this.markers[index].marker?.remove();
    this.markers.splice(index, 1);
  }

}
