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
        for(let i = 0 ; i < 50 ; i++){
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
        if(x == 2 && y == 3){
            // debugger;
        }
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
              <div>Generation : {this.state.currentGeneration}</div>
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
              <button onClick={this.startGame}>Start</button>
              <button onClick={this.stopGame}>Pause</button>
          </div>
        );
    }
}

export default App;
