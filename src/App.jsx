import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './App.css'; // Assuming you have your styles in this file

const App = () => {
  const history = useHistory();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      history.push('/user/');
    }
  }, [history]);

  return (
    <div>
      {/* Section 1 */}
      <section className="hero" id="home">
        <div className="w-50">
          <div>
            <h1>"The Beautiful Thing About Learning is That Nobody can Take It From You."</h1>
          </div>
          <button className="btn btn-warning" style={{ backgroundColor: '#4CAF50' }}>Learn More</button>
        </div>
      </section>

      <section className="py-5" id="about">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <img
                src="https://cdn.pixabay.com/photo/2017/01/12/10/40/school-1974369_1280.jpg"
                alt=""
                className="img-fluid rounded"
              />
            </div>
            <div className="col-md-6">
              <h1>Easy in Learning</h1>
              <p>...</p>
              <a href="#" className="btn btn-primary" style={{ backgroundColor: '#4CAF50' }}>Read More</a>
            </div>
          </div>
        </div>
      </section>
       
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1>Our Location</h1>
              <iframe
                src="https://www.google.com/maps/embed?pb=..."
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
     
      <section className="py-5 bg-white" id="contact">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <img
                className="img-fluid rounded"
                src="https://cdn.pixabay.com/photo/2017/09/25/17/38/chart-2785979__480.jpg"
                alt=""
              />
            </div>
            <div className="col-md-6">
              <h1>Contact us</h1>
              <form>
                <div className="form-group">
                  <label htmlFor="my-input">Your Name <span className="text-danger">*</span></label>
                  <input id="my-input" className="form-control" type="text" />
                </div>
                <div className="form-group">
                  <label htmlFor="my-input">Email <span className="text-danger">*</span></label>
                  <input id="my-input" className="form-control" type="email" />
                </div>
                <div className="form-group">
                  <label htmlFor="my-input">Subject <span className="text-danger">*</span></label>
                  <input id="my-input" className="form-control" type="text" />
                </div>

                <div className="form-group">
                  <label htmlFor="my-textarea">Message</label>
                  <textarea id="my-textarea" className="form-control" rows="3"></textarea>
                </div>
                <button type="submit" className="btn btn-primary my-2" style={{ backgroundColor: '#4CAF50' }}>
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
     
    </div>
  );
};

export default App;
