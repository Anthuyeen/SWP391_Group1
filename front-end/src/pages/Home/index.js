import React from 'react';
import Navbar from "../../layouts/navbar/index";
import CarouselSlider from '../../layouts/CarouselSlide/index';
import Carou1 from '../../assets/Images/CarouImage/Carou1.png'
import Carou2 from '../../assets/Images/CarouImage/Carou2.png'
import Carou3 from '../../assets/Images/CarouImage/Carou1.png'
import CourseList from './component/courses';
import cousrse1 from './../../assets/Images/courses/12.png'
import cousrse2 from './../../assets/Images/courses/2.png'
import cousrse3 from './../../assets/Images/courses/6.png'
import cousrse4 from './../../assets/Images/courses/62f13d2424a47.png'
import cousrse5 from './../../assets/Images/courses/66aa28194b52b.png'
import Footer from './../../layouts/footer/index'
import ExpertList from '../Home/component/expert/expert-list'
const Home = () => {
    const items = [
        { backgroundImage: Carou1 },
        { backgroundImage: Carou2 },
        { backgroundImage: Carou3 },
    ];

    const courses = [
        {
            name: 'Khóa học React',
            price: '1,200,000 VNĐ',
            author: 'Nguyễn Văn A',
            thumbnail: cousrse1,
        },
        {
            name: 'Khóa học Node.js',
            price: '1,500,000 VNĐ',
            author: 'Trần Thị B',
            thumbnail: cousrse2,
        },
        {
            name: 'Khóa học Node.js',
            price: '1,500,000 VNĐ',
            author: 'Trần Thị B',
            thumbnail: cousrse3,
        },
        {
            name: 'Khóa học Node.js',
            price: '1,500,000 VNĐ',
            author: 'Trần Thị B',
            thumbnail: cousrse4,
        },
        {
            name: 'Khóa học Node.js',
            price: '1,500,000 VNĐ',
            author: 'Trần Thị B',
            thumbnail: cousrse5,
        },
        
        // Thêm các khóa học khác
    ];
    
    return (
        <div>
            <Navbar />
            <CarouselSlider items={items} />
            <CourseList courses={courses} />
            <ExpertList/>
            <Footer/>
        </div>
    );
}

export default Home;
