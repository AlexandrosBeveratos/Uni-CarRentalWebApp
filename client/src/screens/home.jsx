import React, { useEffect, useState } from 'react';
import '../css/homepage.css'

function Home() {

  return (
    <div className='highwaybg'>
      <div className="homepage">
        <p>Welcome to RENT WHEELZ, your one-stop-shop for all your car rental needs. We pride ourselves on providing top-notch service and a wide variety of vehicles to choose from. Whether you need a small sedan for a quick trip around town or a spacious SUV for a family vacation, we have you covered.</p>
        <p>At RENT WHEELZ, we believe that renting a car should be a hassle-free experience. That's why we offer easy online booking, competitive pricing, and flexible rental terms. Plus, our friendly and knowledgeable staff is always available to answer any questions you may have and help you find the perfect vehicle for your needs.</p>
        <div class="info">
          <p>We are located in the heart of Athens, Greece and are open every day from <span>8 a.m. to 8 p.m.</span> except weekends. Come visit us and check out our extensive collection of cars, ranging from budget-friendly options to luxury models. We look forward to serving you and making your car rental experience a memorable one.</p>
        </div>
        <div class="contact">
          <p>For more information or to make a reservation, please call us at <a href="tel:+302108978413">+30 2108978413</a>.</p>
          <p>Visit us at: Dios 43, Kifissia 145 64</p>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3139.828290781557!2d23.79797053210997!3d38.09766042546212!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a19f07f1e26b9f%3A0xff600374cb69a78f!2sDios%2043%2C%20Kifisia%20145%2064!5e0!3m2!1sen!2sgr!4v1676654321218!5m2!1sen!2sgr" width="600" height="450" style={{border:0}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    </div>
  );
}

export default Home;
