import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl('')
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' }
  ]

  constructor(
    private heroesService: HeroesService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;
    this.activateRoute.params.pipe(
      switchMap(({ id }) => this.heroesService.getHeroById(id))
    ).subscribe(hero => {
      if (!hero) return this.router.navigateByUrl('/heroes/list');
      this.heroForm.reset(hero);
      return;
    })
  }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmit(): void {
    if (this.heroForm.invalid) return;

    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero)
        .subscribe(hero => {
          this.showSnackbar(`${hero.superhero} updated!`);
        });
      return;
    }

    this.heroesService.addHero(this.currentHero)
      .subscribe(hero => {
        this.showSnackbar(`${hero.superhero} created!`);
        this.router.navigateByUrl(`/heroes/edit/${hero.id}`);
      });

  }

  onDeleteHero(): void {
    if (!this.currentHero.id) throw Error('Hero ID is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    dialogRef.afterClosed()
      .pipe(
        filter((result: boolean) => result),
        switchMap(() => this.heroesService.deleteHeroById(this.currentHero.id)),
        filter((wasDeleted: boolean) => wasDeleted)
      )
      .subscribe(result => {
        this.router.navigateByUrl('/heroes/list');
        this.showSnackbar(`${this.currentHero.superhero} deleted!`);
      });


    // dialogRef.afterClosed().subscribe(result => {
    //   if(!result) return;
    //   this.heroesService.deleteHeroById(this.currentHero.id)
    //     .subscribe(wasDeleted => {
    //       if(wasDeleted){
    //         this.router.navigateByUrl('/heroes/list');
    //         this.showSnackbar(`${this.currentHero.superhero} deleted!`);
    //       }
    //     });
    // });

  }

  showSnackbar(message: string): void {
    this.snackbar.open(message, 'done', {
      duration: 2500
    });
  }

}
