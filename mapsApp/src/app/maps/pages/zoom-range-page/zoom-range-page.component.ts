import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { LngLat, Map } from 'mapbox-gl';

@Component({
  templateUrl: './zoom-range-page.component.html',
  styleUrls: ['./zoom-range-page.component.css']
})
export class ZoomRangePageComponent implements AfterViewInit, OnDestroy {
 
  @ViewChild('map') 
  public divMap?: ElementRef<HTMLDivElement>;

  public zoom: number = 10;
  public map?: Map;
  public center: LngLat = new LngLat(-3.69, 40.41);

  ngAfterViewInit(): void {
    if(!this.divMap) throw new Error('Div map not found');

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.center, // starting position [lng, lat]
      zoom: this.zoom, // starting zoom
    })

    this.mapListeners();
  }

  mapListeners(){
    if(!this.map) throw new Error('Map not found');

    this.map.on('zoom', (ev) => {
      if(!this.map) throw new Error('Map not found');
      this.zoom = this.map.getZoom();
    });

    this.map.on('zoomend', (ev) => {
      if(!this.map) throw new Error('Map not found');
      if(this.map.getZoom() > 18){
        this.map.zoomTo(18);
      }
    });

    this.map.on('move', (ev) => {
      if(!this.map) throw new Error('Map not found');
      const { lng, lat } = this.map.getCenter();
      this.center = new LngLat(lng, lat);
    });

  }

  zoomIn(){
    if(!this.map) throw new Error('Map not found');
    this.map.zoomIn();
  }

  zoomOut(){
    if(!this.map) throw new Error('Map not found');
    this.map.zoomOut();
  }

  zoomChanged(value: string){
    if(!this.map) throw new Error('Map not found');
    this.zoom = Number(value);
    this.map.zoomTo(Number(value));
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

}
