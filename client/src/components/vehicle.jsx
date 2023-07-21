import React, { useEffect, useState } from 'react';
import { encode } from 'base64-arraybuffer';

const Vehicle = ({ vehicle }) => {
  //Image Transformation for render
  const base64String = encode(vehicle.vehicleImage.data.data)

  return (
    <div className='vehicle-card'>
      <div className={`image-container ${vehicle.availability}`}>
        <div className='bubble'>From {vehicle.stdprice}€</div>
        <img src={`data:image/png;base64,${base64String}`} width={'350'} height={'200'} />
      </div>
      <div className='vehicle Info'>
        <h1>{vehicle.carmake} {vehicle.model}</h1>
        <p>Engine: {vehicle.enginesize}cc {vehicle.enginetype}, Seats: {vehicle.seats} Registration: {vehicle.regnumber}</p>
      </div>

    </div>
  );
}

export default Vehicle;