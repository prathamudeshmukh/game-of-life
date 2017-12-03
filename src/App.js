import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            world : [],
            liveCells : 0,
            generationsToSimulate : 100,
            currentGeneration:1,
            life:null,
            seeder:null
        };
        this.rows = 30;
        this.cols = 100;
        this.initializeWorld = this.initializeWorld.bind(this);
        this.startGame = this.startGame.bind(this);
        this.getLiveNeighbours = this.getLiveNeighbours.bind(this);
        this.mod = this.mod.bind(this);
        this.stopGame = this.stopGame.bind(this);
        this.cloneWorld = this.cloneWorld.bind(this);
        this.livenUp = this.livenUp.bind(this);
        this.getRandomNumberFromRange = this.getRandomNumberFromRange.bind(this);
        this.randomSeed = this.randomSeed.bind(this);
        this.stopSeeder = this.stopSeeder.bind(this);
    }

    componentDidMount(){
        this.initializeWorld();
    }

    initializeWorld(){
        const world = this.cloneWorld();
        for(let i = 0 ; i < this.rows ; i++){
            const worldRow = [];
            for(let j = 0 ; j < this.cols ; j++){
                const cellAddress = i+","+j;
                worldRow[j] = false;
            }
            world[i] = worldRow
        }
        this.setState({world:world});
    }

    cloneWorld(){
        return JSON.parse(JSON.stringify(this.state.world));
    }

    randomSeed(){
        const maxNumberOfLiveCellsForASeedToGenerate = 50;
        const minNumberOfLiveCellsForASeedToGenerate = 10;
        const numberOfSeedCells = this.getRandomNumberFromRange(minNumberOfLiveCellsForASeedToGenerate, maxNumberOfLiveCellsForASeedToGenerate);
        console.log("numberOfSeedCells"+numberOfSeedCells);
            const seeder = setInterval(()=> {
                let coords = this.getRandomNumberFromRange(10, this.rows - 10) + "," + this.getRandomNumberFromRange(40, this.cols - 40)
                let event = {target: {id: coords}};
                this.livenUp(event)
            },50);
        this.setState({seeder :seeder});
    }

    getRandomNumberFromRange(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    startGame(){
        const life = setInterval(()=>{
            const localWorld = this.cloneWorld();
            let liveCells = 0;

            for (let i = 0; i < localWorld.length; i++) {
                for (let j = 0; j < localWorld[i].length; j++) {
                    const liveNeighbours = this.getLiveNeighbours(this.state.world,[i, j]);
                    if (localWorld[i][j]) { //liveCell
                        liveCells ++;
                        if (liveNeighbours < 2 || liveNeighbours > 3) {
                            localWorld[i][j] = false;
                            liveCells --;
                        }
                    } else {
                        if (liveNeighbours == 3) {
                            localWorld[i][j] = true;
                            liveCells ++;
                        }
                    }
                }
            }
            this.setState({world:localWorld, currentGeneration: this.state.currentGeneration + 1,liveCells : liveCells})
        },1000);
        this.setState({life :life});

    }

    stopSeeder(){
        clearInterval(this.state.seeder);
        this.setState({seeder:null});
    }

    stopGame(){
        clearInterval(this.state.life);
        this.setState({life:null});
    }

    mod(i,j){
        return i%j;
    }

    livenUp(event){
        let coord = event.target.id;
        console.log("coord:"+coord)
        const localWorld = this.cloneWorld();
        const x = coord.split(",")[0];
        const y = coord.split(",")[1];
        localWorld[x][y] = !localWorld[x][y];
        this.setState({world:localWorld,liveCells:this.state.liveCells + 1});
    }

    getLiveNeighbours(localWorld,cellAddress){
        let nc = 0;   // this function rather messily counts up the neighbors
        const x = cellAddress[0];
        const y = cellAddress[1];
        const xsize = localWorld.length;
        const ysize = localWorld[0].length;
        if (localWorld[this.mod(x+1,xsize)] && localWorld[this.mod(x+1,xsize)][y]){
            nc++;
        }
        if (localWorld[this.mod(x+1,xsize)] && localWorld[this.mod(x+1,xsize)][this.mod(y+1, ysize)]){
            nc++;
        }
        if (localWorld[x] && localWorld[x][this.mod(y+1,ysize)]){
            nc++;
        }
        if (localWorld[x] && localWorld[x][this.mod(y-1,ysize)]){
            nc++;
        }
        if (localWorld[this.mod(x+1,xsize)] && localWorld[this.mod(x+1,xsize)][this.mod(y-1,ysize)]){
            nc++;
        }
        if (localWorld[this.mod(x-1,xsize)] && localWorld[this.mod(x-1,xsize)][y]){
            nc ++;
        }
        if (localWorld[this.mod(x-1,xsize)] && localWorld[this.mod(x-1,xsize)][this.mod(y-1,ysize)]){
            nc ++;
        }
        if (localWorld[this.mod(x-1,xsize)] && localWorld[this.mod(x-1,xsize)][this.mod(y+1,ysize)]){
            nc ++;
        }
        return nc;
    }

    render() {
        return (
          <div className="App">
              <div className={"textInfo"}>
                  <b>Conway's Game of Life,<br/> also known as the Game of Life or simply Life, is a cellular automaton
                      devised by the British mathematician John Horton Conway in 1970.
                      It is the best-known example of a cellular automaton.</b>
                  <br/><br/>
                  <div>The universe of the Game of Life is an infinite two-dimensional orthogonal grid of square cells,
                      each of which is in one of two possible states, live or dead. Every cell interacts with its eight
                      neighbours, which are the cells that are directly horizontally, vertically, or diagonally adjacent.
                      At each step in time, the following transitions occur:
                      <ul>
                        <li>Any live cell with fewer than two live neighbours dies (referred to as underpopulation or exposure).</li>
                        <li>Any live cell with more than three live neighbours dies (referred to as overpopulation or overcrowding).</li>
                        <li>Any live cell with two or three live neighbours lives, unchanged, to the next generation.</li>
                        <li>Any dead cell with exactly three live neighbours will come to life.</li>
                      </ul>
                      The initial pattern constitutes the 'seed' of the system.
                      The first generation is created by applying the above rules simultaneously to every cell in the seed — births
                      and deaths happen simultaneously, and the discrete moment at which this happens is sometimes called a tick.
                      (In other words, each generation is a pure function of the one before.)
                      The rules continue to be applied repeatedly to create further generations.
                  </div>
              </div>
              <ul className={"currentState"}>
                  <li>Generation : {this.state.currentGeneration}</li>
                  <li>Population : {this.state.liveCells}</li>

                  <li><button disabled={this.state.life || this.state.seeder ? true : false} onClick={this.startGame}>Start simulation</button></li>
                  <li><button disabled={this.state.life ? false : true} onClick={this.stopGame}>Pause</button></li>
                  <li><button disabled={this.state.life ? true : false} onClick={this.state.seeder ? this.stopSeeder : this.randomSeed}>{this.state.seeder?"Stop generating":"Generate random seed"}</button></li>
              </ul>

              <table >
                  {(() => {
                      return this.state.world.map((row,i) => {
                          return (
                              <tr style={{border:"1px solid"}}>
                                  {(() => {
                                      return row.map((cell,j) => {
                                            return (
                                                <td style={{backgroundColor: cell ? "black" : "white",width:'10px',height:'10px',border:"1px solid"}} id={`${i},${j}`} onClick={this.livenUp}></td>
                                            )
                                      })
                                  })()}
                              </tr>
                          )
                      })
                  })()}
              </table>
          </div>
        );
    }
}

export default App;
