import React from 'react'
import './Math3Game.css'
import red_bell from '../Assets/red_color.png'
import blue_bell from '../Assets/blue_color.png'
import green_bell from '../Assets/green_color.png'

export const Match3Game = () => {
  return (
    <div className='container'>
        <h1 className='title'>Bell Link Game <span> Jump Up Casino</span> </h1>
        <img src={red_bell} alt="Trulli" width="500" height="333"></img>
        <div className='board'>
        <div className="row1">
            <div className="boxes"></div>
            <div className="boxes"></div>
            <div className="boxes"></div>
            <div className="boxes"></div>                           
        </div>
        <div className="row2">
            <div className="boxes"></div>
            <div className="boxes"></div>
            <div className="boxes"></div>
            <div className="boxes"></div>                           
        </div>
        <div className="row3">
            <div className="boxes"></div>
            <div className="boxes"></div>
            <div className="boxes"></div>
            <div className="boxes"></div>                            
        </div>
        <div className="row4">
            <div className="boxes"></div>
            <div className="boxes"></div>
            <div className="boxes"></div>
            <div className="boxes"></div>                            
        </div>
        
        
        </div>    
        
        <button className='reset'>Reset</button>
        
        
    </div>
  )
}
