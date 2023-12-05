import React, { Component } from 'react';
import './card-list.style.css'; // Import the CSS file for styling
import { Spinner, Placeholder } from 'react-bootstrap';


class Cards extends Component {

    getImg(attractions) {
        if (Array.isArray(attractions.image)) {
            return attractions.image[0];
        }
        else {
            return attractions.image
        }
    }

    pageSwitch = (attractionId) => {
        // Replace with your page switching logic
        window.location.href = '/detail?id=' + attractionId;
    };

    render() {
        const { attractions } = this.props;
        const { getImg } = this;
        return (
            <>
                <div className='card-list'>
                    {attractions.map((attractions) => (
                        <div>
                            {/* {isLazyLoading ? (
                                <div className='card-container' key={attractions.id}>
                                    <img className="card-img" alt={`attraction ${attractions.name}`} src={getImg(attractions)} />
                                    <div class="card-intro-area">
                                        <p className='card-title'>{attractions.name}</p>
                                        <p className='card-text'>{attractions.description}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className='card-container' key={attractions.id}>
                                    <div className="card-img"><Spinner animation="grow" /></div>
                                    <div class="card-intro-area">
                                        <Placeholder className='card-title' animation="glow">
                                            <Placeholder xs={6} />
                                        </Placeholder>
                                        <Placeholder className='card-text' animation="glow">
                                            <Placeholder style={{ margin: '30px 0 0 0' }} xs={7} /> <Placeholder style={{ margin: '30px 0 0 0' }} xs={4} /> <Placeholder xs={4} />{' '}
                                            <Placeholder xs={6} /> <Placeholder xs={8} />
                                        </Placeholder>
                                    </div>
                                </div>
                            )} */}


                            {/* <div className='card-container' key={attractions.id}>
                                <img className="card-img" alt={`attraction ${attractions.name}`} src={getImg(attractions)} />
                                <div class="card-intro-area">
                                    <p className='card-title'>{attractions.name}</p>
                                    <p className='card-text'>{attractions.description}</p>
                                </div>
                            </div>
                            <div className='card-container' key={attractions.id}>
                                <div className="card-img"><Spinner animation="grow" /></div>
                                <div class="card-intro-area">
                                    <Placeholder className='card-title' animation="glow">
                                        <Placeholder xs={6} />
                                    </Placeholder>
                                    <Placeholder className='card-text' animation="glow">
                                        <Placeholder style={{ margin: '30px 0 0 0' }} xs={7} /> <Placeholder style={{ margin: '30px 0 0 0' }} xs={4} /> <Placeholder xs={4} />{' '}
                                        <Placeholder xs={6} /> <Placeholder xs={8} />
                                    </Placeholder>
                                </div>
                            </div> */}

                        </div>

                    ))}
                </div>
            </>

        );
    }

}

export default Cards;