import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './WelcomePage.css';

// Carousel component responsible for displaying images in a slider
const Carousel = ({ images }) => {
  // Settings for the Slider component
  const settings = {
    dots: true, // Show navigation dots
    infinite: true, // Enable infinite loop
    speed: 500, // Transition speed in milliseconds
    slidesToShow: 1, // Number of slides to show at once
    slidesToScroll: 1, // Number of slides to scroll per interaction
    autoplay: true, // Automatically change slides
    autoplaySpeed: 2000, // Delay between slide transitions in milliseconds
    fade: true, // Use fade effect for transitioning between slides
  };

  return (
    <div className="carouselcontainer"> {/* Container for the Slider component */}
      {/* Slider component with custom settings */}
      <Slider {...settings}>
        {/* Map over the images array to render each image as a slide */}
        {images.map((image, index) => (
          <div key={index}> {/* Unique key for each slide */}
            {/* Image element for displaying the image */}
            <img src={image} alt={`slide-${index}`} className="fullwidthimage" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

// Export the Carousel component
export default Carousel;
