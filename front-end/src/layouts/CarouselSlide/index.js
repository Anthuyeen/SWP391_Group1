import React from 'react';
import Slider from 'react-slick';
import { Box } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Slide = ({ backgroundImage }) => (
    <Box sx={{
        width: '100%',
        height: '300px', // Chiều cao của slide
        // backgroundColor: '#1877f2',
        borderRadius: '16px',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        color: 'white',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'contain', // Để ảnh vừa khung
        backgroundPosition: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    }}>
    </Box>
);

const CarouselSlider = ({ items }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
    };

    return (
        <Box sx={{
            width: '100%', // Đặt chiều rộng carousel bằng 85% màn hình
            // maxWidth: '1200px', // Chiều rộng tối đa
            margin: '0 auto', // Căn giữa
            mt: 2,
            position: 'relative',
        }}>
            <Slider {...settings}>
                {items.map((item, index) => (
                    <Slide key={index} {...item} />
                ))}
            </Slider>
        </Box>
    );
};

const SampleNextArrow = (props) => {
    const { onClick } = props;
    return (
        <Box onClick={onClick} sx={{ ...arrowStyle, right: 10 }}>
            <ChevronRight />
        </Box>
    );
};

const SamplePrevArrow = (props) => {
    const { onClick } = props;
    return (
        <Box onClick={onClick} sx={{ ...arrowStyle, left: 10 }}>
            <ChevronLeft />
        </Box>
    );
};

const arrowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'white',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    position: 'absolute',
    zIndex: 1,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#1877f2',
};

export default CarouselSlider;
