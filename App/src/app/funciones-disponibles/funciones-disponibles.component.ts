import { Component, OnInit, Renderer2 } from '@angular/core';
import { RestService } from '../rest.service';

@Component({
  selector: 'app-funciones-disponibles',
  templateUrl: './funciones-disponibles.component.html',
  styleUrls: ['./funciones-disponibles.component.css']
})
export class FuncionesDisponiblesComponent implements OnInit {

  allFunciones:any = []
  funciones:any = []
  dotSelected = 1
  maxFunciones = 20

  constructor(private RestService: RestService) { }

  ngOnInit(): void {
    this.getFuncionesDisponibles()
  }

  showTabs(): Array<number>{
     return Array(Math.ceil(this.allFunciones.length/this.maxFunciones))
  }

  mover2(pos:number){
    if(pos<this.showTabs().length && pos>=0){
      this.funciones = []
    for (let funcion = pos * this.maxFunciones; funcion < this.allFunciones.length; funcion++){
      this.funciones.push(this.allFunciones[funcion])
      if(funcion== pos * this.maxFunciones + 19){
        break;
      }
    }
    this.dotSelected = pos+1
    console.log(this.dotSelected)
    }
  }

  public getFuncionesDisponibles(){
    this.RestService.get('http://localhost:3000/funciones')
    .subscribe( respuesta => {
      this.allFunciones = respuesta

      for (let index = 0; index < 20 && index < this.allFunciones.length; index++) {
        this.funciones.push(this.allFunciones[index])
      }
    })
  }
}
