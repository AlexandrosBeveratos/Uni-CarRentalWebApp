import React, { useEffect, useState } from 'react';
import Vehicle from '../components/vehicle';

function Fleet() {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ carmake: '', model: '', enginetype: '', enginesize: '', seats: '', availability: '', stdprice: '', regnumber: '' })
  const [vehicles, setVehicles] = useState([]);
  const [hasFilter, setHasFilter] = useState({ carmake: false, model: false, enginetype: false, enginesize: false, seats: false, availability: false, stdprice: false, regnumber: false })

  //Getting the values from the form
  const handleFilter = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    if(value !== ''){
      setHasFilter({...hasFilter, [name]: true});
    }
    else if(value === ''){
      setHasFilter({...hasFilter, [name]: false});
    }

  }

  const removeFilters = (e) => {
    setFilters({carmake: '', model: '', enginetype: '', enginesize: '', seats: '', availability: '', stdprice: '', regnumber: ''})
  }

  useEffect(() => {
    async function fetchVehicles() {
      fetch('http://localhost:3001/vehicle/all')
        .then(response => {
          return response.json()
        })
        .then(json => {
          setVehicles(json);
          setLoading(false);
        }
        )
        .catch(error => {
          console.log(error)
          setLoading(false)
        })

    }
    fetchVehicles()

  }, []);


  return (
    <div className='container highwaybg fleet-page'>
      <div className='sidebar'>
        <h1>Filters</h1>
        <form>
          <label>Manufacturer</label>
          <input className='field filter' name='carmake' placeholder='Audi' onChange={handleFilter}/>
          <label>Engine Type</label>
          <select className='field filter' name='enginetype' onChange={handleFilter}>
            <option selected disabled>Select Engine</option>
            {loading ? (null) : 
            <>
              <option value={'Petrol'}>Petrol</option>
              <option value={'Diesel'}>Diesel</option>
              <option value={'Electric'}>Electric</option>
              <option value={'LPG'}>LPG</option>
            </>
            }
          </select>
          <label>Engine Size cc</label>
          <input className='field filter' name='enginesize' placeholder='1300' onChange={handleFilter}/>
          <label>Availability</label>
          <select className='field filter' name='availability' onChange={handleFilter}>
            <option selected disabled>Select Availability</option>
            {loading ? (null) : 
            <>
              <option value={'available'}>Available</option>
              <option value={'reserved'}>Reserved</option>
              <option value={'unoperational'}>Unoperational</option>
            </>
            }
          </select>
          <button className='btn clr' onClick={removeFilters}>Clear Filters</button>
        </form>
      </div>
      <div className='fleet-container'>
        <h1 className='center page-title'>Our Leasing Fleet</h1>
        <section>
          <div className='fleet-card-wrapper'>
          {loading ?
            (<div className='loading'>
              <p style={{color: 'white'}}>Loading vehicles...</p>
              <div className="loader"></div>
            </div>
            ) :
            (vehicles.map((vehicle) => (
              (vehicle.carmake.includes(filters.carmake) || hasFilter.carmake == false) 
              && (filters.enginetype === vehicle.enginetype || hasFilter.enginetype == false)
              && (filters.enginesize === vehicle.enginesize || hasFilter.enginesize == false)
              &&(filters.availability === vehicle.availability || hasFilter.availability == false)? 
              (<Vehicle vehicle={vehicle} />) : null
            )
            ))
          }
          </div>
        </section>
      </div>
    </div>
  );
}

export default Fleet;