import { Component, OnInit, Renderer2 } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { RestService } from '../rest.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservar',
  templateUrl: './reservar.component.html',
  styleUrls: ['./reservar.component.css']
})
export class ReservarComponent implements OnInit {

  butacas:any
  id: number = 1
  butacasDisponibles:any = []
  titulo: string = ""
  img: string = ""
  butacasSeleccionadas: any = []

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private RestService: RestService) { 
    this.activatedRoute.params.subscribe(params => {
      this.id = params["id"];
    });
  }

  ngOnInit(): void {
    this.getButacas()
  }

  public postReservar(){
    console.log('butacas: '+this.butacasSeleccionadas)
    if(this.butacasSeleccionadas.length>0){
      this.RestService.post('http://localhost:3000/'+this.id+'/reservar',{
        butacas: this.butacasSeleccionadas,
        usuario: 4
      }).subscribe(respuesta => {
        this.router.navigate(['funciones-disponibles'])
      })
    }
  }

  public getButacas(){
    this.RestService.get('http://localhost:3000/butacas/'+this.id)
    .subscribe( respuesta => {
      let butacasR:any = respuesta
      
      this.butacasDisponibles = JSON.parse(butacasR[0][0]['butacas_disponibles'])
      this.butacas = JSON.parse(butacasR[1][0]['butacas'])
      console.log(butacasR)
      this.titulo = butacasR[2][0]['titulo']
      this.img = butacasR[2][0]['img']
    })
  }

  clickButaca(butaca: any){
    if(!this.butacasSeleccionadas.includes(butaca) && this.butacasDisponibles.includes(butaca) && this.butacasSeleccionadas.length<6){
      this.butacasSeleccionadas.push(butaca)
    }else{
      this.butacasSeleccionadas.forEach((element: any,index: any)=>{
        if(element==butaca) this.butacasSeleccionadas.splice(index,1);
      });
    }
  }
}


