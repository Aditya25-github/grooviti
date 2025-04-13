import React, { useState } from 'react';
import './CreateEvent.css';

const countryCurrencyOptions = [
  { country: "USA", currency: "USD", label: "USA (USD - US Dollar)" },
  { country: "UK", currency: "GBP", label: "United Kingdom (GBP - British Pound)" },
  { country: "Germany", currency: "EUR", label: "Germany (EUR - Euro)" },
  { country: "India", currency: "INR", label: "India (INR - Indian Rupee)" },
  { country: "Japan", currency: "JPY", label: "Japan (JPY - Japanese Yen)" },
  { country: "Australia", currency: "AUD", label: "Australia (AUD - Australian Dollar)" },
  { country: "Canada", currency: "CAD", label: "Canada (CAD - Canadian Dollar)" },
];

const CreateEvent = () => {
  const [eventName, setEventName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timeZone, setTimeZone] = useState('');
  const [eventType, setEventType] = useState('Free');
  const [eventMode, setEventMode] = useState('');
  const [currency, setCurrency] = useState('');
  const [eventLink, setEventLink] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [venue, setVenue] = useState('');

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);
    const countryData = countryCurrencyOptions.find((item) => item.country === selectedCountry);
    if (countryData) {
      setCurrency(countryData.currency);
    } else {
      setCurrency('');
    }
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!eventName || !startDate || !endDate || !timeZone || !eventType || !eventMode || (!eventLink && eventMode === "Online") || (!country && eventMode === "In-Person") || (!city && eventMode === "In-Person") || (!venue && eventMode === "In-Person")) {
      alert('Please fill out all required fields.');
      return;
    }

    alert('Event Details Sent Succesfully! We will Contact You Soon for Further Inquiry!');
    console.log({ eventName, startDate, endDate, timeZone, eventType, eventMode, currency, eventLink, country, city, venue });
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <h2 className="section-title">Create Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Event Name *</label>
            <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Start Date *</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>

          <div className="form-group">
            <label>End Date *</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Time Zone *</label>
            <select value={timeZone} onChange={(e) => setTimeZone(e.target.value)}>
              <option value="">Select Time Zone</option>
              <option value="GMT+5:30">(GMT+5:30) Chennai, Kolkata, Mumbai, New Delhi</option>
              <option value="GMT-11:00">(GMT-11:00) Midway Island, Samoa</option>
              <option value="GMT-10:00">(GMT-10:00) Hawaii</option>
            </select>
          </div>

          <div className="form-group">
            <label>Event Type *</label>
            <div className="toggle-group">
              <button type="button" className={eventType === "Free" ? "active" : ""} onClick={() => setEventType("Free")}>Free</button>
              <button type="button" className={eventType === "Paid" ? "active" : ""} onClick={() => setEventType("Paid")}>Paid</button>
            </div>
          </div>

          <div className="form-group">
            <label>Event Mode *</label>
            <select value={eventMode} onChange={(e) => setEventMode(e.target.value)}>
              <option value="">Select Mode</option>
              <option value="In-Person">In-Person</option>
              <option value="Online">Online</option>
            </select>
          </div>

          {/* Show Venue, Country, City when Event Mode is In-Person */}
          {eventMode === "In-Person" && (
            <>
              <div className="form-group">
                <label>Venue</label>
                <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Country *</label>
                <select value={country} onChange={handleCountryChange}>
                  <option value="">Select Country</option>
                  {countryCurrencyOptions.map((option) => (
                    <option key={option.country} value={option.country}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>City *</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>

            </>
          )}

          {/* Show Event Link when Event Type is Online */}
          {eventMode === "Online" && (
            <div className="form-group">
              <label>Event Link *</label>
              <input type="url" value={eventLink} onChange={(e) => setEventLink(e.target.value)} />
            </div>
          )}

          {/* Show Currency dropdown when Event Type is Paid */}
          {eventType === "Paid" && (
            <>
              {/* Show Currency dropdown when Event Mode is Online */}
              {eventMode === "Online" ? (
                <div className="form-group">
                  <label>Currency *</label>
                  <select value={currency} onChange={handleCurrencyChange}>
                    <option value="">Select Currency</option>
                    {countryCurrencyOptions.map((option) => (
                      <option key={option.currency} value={option.currency}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="form-group">
                  <label>Currency *</label>
                  <input type="text" value={currency} readOnly />
                </div>
              )}
            </>
          )}

          <button type="submit" className="event-button">Create Event</button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;




