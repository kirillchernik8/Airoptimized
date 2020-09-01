import React, { Component } from "react";
import ReactDOM from 'react-dom'
import Carousel from './Carousel.jsx'
import axios from 'axios'
import Modal1 from './Modal.jsx'
import StarRatingComponent from 'react-star-rating-component'
import Footer from './Footer.jsx'
import AutoCompleteText from './AutoCompleteText.jsx'
import {cities, seed} from './StaticData.jsx'

require('dotenv').config()
class App extends Component {
  constructor() {
    super()
    this.state = {
      recommendations: seed,
      isModalOpen: false,
      isInnerModalOpen: false,
      modalImg: seed[0].recImg,
      modalTitle: seed[0].recTitle,
      modalRating: seed[0].recRating,
      modalRatingCount: seed[0].recratingCount,
      modalId: 130,
      editing:false
    }
		this.closeModal = this.closeModal.bind(this);
		this.openModal = this.openModal.bind(this);
  }

  componentDidMount( ) {
    if (window.location.pathname !== '/') {
      axios.get(`${process.env.EC2_IP}/room${window.location.pathname}`)
      .then(( data ) => {
        this.setState({
          recommendations: data.data
        })
      })
      .catch(( err ) => console.err(err))
  }
}
  // close modal (set isModalOpen, true)
  closeModal( ) {
    this.setState({
      isModalOpen: false
    });
  }

  // open modal (set isModalOpen, false)
  openModal( event ) {
    this.setState({
      isModalOpen: true,
      modalId: parseInt(event.target.getAttribute('value')),
      modalImg: event.target.getAttribute('img'),
      modalTitle: event.target.getAttribute('title'),
      modalRating: event.target.getAttribute('rating'),
      modalRatingCount: event.target.getAttribute('recratingcount')
    });
  }

  edit( ) {
    this.setState({
      editing: true,
    })
  }

  save( e ) {
    e.preventDefault();
    this.setState({
      editing:false,
      note: this.state.cache,
      cachhe: undefined
    })
  }

  cancel(e) {
    e.preventDefault();
    this.setState({
      editing:false,
      cache: undefined
    })
  }

  handleChange(e) {
    var value = e.target.value;
    this.setState({
      cache: value
    })
  }

  renderDisplay() {
    return (
      <div>
        <button className='create-new-list-text' onClick={this.edit.bind(this)}>Create New List</button>
      </div>
    )
  }

  renderForm() {
    return (
      <div className ='modal-form'>
      <div className='modal-name-your-list-title'>Name</div>
      <div className='modal-form-form'>
        <form>
          <textarea style={{marginBottom: '20px'}} name="" id='' cols='48' rows='1' value={this.state.cache}
          onChange={this.handleChange.bind(this)} placeholder='Name your list'></textarea>
          <button className='modal-save-button' onClick = {this.save.bind(this)}>Create</button>
          <button className='modal-cancel-button' onClick={this.cancel.bind(this)}>Cancel</button>
        </form>
      </div>
      </div>
    )
  }

  render() {
    return (
      <div className='app'>
        <div className='AutoCompleteText'>
          <div className='App-Component'>
            <div className='App-Component'>
              <AutoCompleteText items={cities}/>
            </div>
          </div>
        </div>
        <div className='below-search'>
          <div className='more-homes-box'>
            <h2 className='more-homes-title'>More homes you may like</h2>
          </div>
            <Modal1
            isModalOpen={this.state.isModalOpen}
            closeModal={this.closeModal}
          >
            <button className='modal-close-button'
              onClick={this.closeModal}
            >
              X
            </button>

            <h1 className='save-to-list-text'>Save to list</h1>
            <div className='create-new-list-div'>

              {this.state.editing ? this.renderForm() : this.renderDisplay()}
            </div>
            <div className='top-bottom-border'>
              <p>{this.state.note}</p>
            </div>
            <div className ='modal-bottom-box'>
              <img
                className ='modal-image'
                width="80%"
                height="80%"
                style={{ borderRadius: 3 }}
                src= {this.state.modalImg}
                alt="unsplash"
              />
              <div className='modal-title'>{this.state.modalTitle}</div>
              <StarRatingComponent className='photo-star-rating modal-box-rating' name='rating' starCount={parseInt(this.state.modalRating)} />
              <div className='photo-rating-count modal-box-rating'>({parseInt(this.state.modalRatingCount)})</div>
            </div>
          </Modal1 >

          <Carousel openModal={this.openModal} recommendations={this.state.recommendations}/>
          <Footer />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('recommendations'))
