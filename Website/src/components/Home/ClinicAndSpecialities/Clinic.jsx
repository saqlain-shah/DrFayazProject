import img1 from '../../../images/specialities/specialities-01.png';
import img2 from '../../../images/specialities/specialities-02.png';
import img3 from '../../../images/specialities/specialities-03.png';
import img4 from '../../../images/specialities/specialities-04.png';
import img5 from '../../../images/specialities/specialities-05.png';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

const AvailableServiceContent = () => {
    const availabeServiceArray = [
        { title: 'Dentist', img: img5 },
        { title: 'Cardiologist', img: img4 },
        { title: 'Urology', img: img1 },
        { title: 'Neurology', img: img2 },
        { title: 'Orthopedic', img: img3 },
    ]
    return (
        <div className="d-flex justify-content-center align-items-center gap-4">

            <Swiper
                spaceBetween={2}
                slidesPerView={4}
                modules={[Navigation, Autoplay]}
                loop={true}
                centeredSlides={true}
                autoplay={{ delay: 2000, disableOnInteraction: false }}
            >
                {
                    availabeServiceArray.map((item) => (
                        <SwiperSlide key={item.title} className='my-2'>
                            <div className="feature-item  text-center">
                                <img src={item.img} className="img-fluid" alt="" />
                                <p>{item.title}</p>
                            </div>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    )
}

export default AvailableServiceContent