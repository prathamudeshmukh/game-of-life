import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            world : [],
            liveCells : [],
            generationsToSimulate : 100,
            currentGeneration:1,
            life:null
        };
        this.initializeWorld = this.initializeWorld.bind(this);
        this.startGame = this.startGame.bind(this);
        this.getLiveNeighbours = this.getLiveNeighbours.bind(this);
        this.mod = this.mod.bind(this);
        this.stopGame = this.stopGame.bind(this);
        this.cloneWorld = this.cloneWorld.bind(this);
        this.livenUp = this.livenUp.bind(this);
    }

    componentDidMount(){
        this.initializeWorld();
    }

    initializeWorld(){
        const world = this.cloneWorld();
        for(let i = 0 ; i < 30 ; i++){
            const worldRow = [];
            for(let j = 0 ; j < 100 ; j++){
                const cellAddress = i+","+j;
                if(this.state.liveCells.indexOf(cellAddress) >= 0){
                    worldRow[j] = true;
                }else{
                    worldRow[j] = false;
                }
            }
            world[i] = worldRow
        }
        this.setState({world:world});
    }

    cloneWorld(){
        return JSON.parse(JSON.stringify(this.state.world));
    }

    startGame(){
        const life = setInterval(()=>{
            const localWorld = this.cloneWorld();
            const liveCells = this.state.liveCells.slice(0);

            for (let i = 0; i < localWorld.length; i++) {
                for (let j = 0; j < localWorld[i].length; j++) {
                    const liveNeighbours = this.getLiveNeighbours(this.state.world,[i, j]);
                    if (localWorld[i][j]) { //liveCell
                        if (liveNeighbours < 2 || liveNeighbours > 3) {
                            localWorld[i][j] = false;
                        }
                    } else {
                        if (liveNeighbours == 3) {
                            localWorld[i][j] = true;
                        }
                    }
                }
            }
            this.setState({world:localWorld, currentGeneration: this.state.currentGeneration + 1})
        },1000);
        this.setState({life :life});

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
        const liveCells = this.state.liveCells.slice(0);
        liveCells.push(coord);
        const localWorld = this.cloneWorld();
        const x = coord.split(",")[0];
        const y = coord.split(",")[1];
        localWorld[x][y] = !localWorld[x][y];
        this.setState({world:localWorld,liveCells:liveCells});
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
                  <li><button disabled={this.state.life ? true : false} onClick={this.startGame}>Start</button></li>
                  <li><button disabled={this.state.life ? false : true} onClick={this.stopGame}>Pause</button></li>
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
