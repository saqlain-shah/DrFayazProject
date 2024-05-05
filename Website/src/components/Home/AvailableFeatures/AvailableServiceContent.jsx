import img2 from '../../../images/features/2.jpeg';
import img3 from '../../../images/features/3.jpeg';
import img4 from '../../../images/features/4.jpeg';
import img5 from '../../../images/features/5.jpeg';
import img from '../../../images/features/1.jpeg';

import img6 from '../../../images/features/6.jpeg';
import img7 from '../../../images/features/7.jpeg';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

const AvailableServiceContent = () => {
    const availabeServiceArray = [
        { title: 'Emergency Appointments', img: img },
        { title: "Children's clinic", img: img2 },
        { title: 'Women Health clinic', img: img3 },
        { title: 'Antenatal clinic', img: img4 },
        { title: 'Men’s Health clinic', img: img5 },
        { title: 'Mental Health clinic', img: img6 },
        { title: "Dermatology clinic", img: img7 },
    ]
    return (
        <div className="d-flex justify-content-center align-items-center gap-4">

            <Swiper
                spaceBetween={2}
                slidesPerView={3}
                modules={[Navigation, Autoplay]}
                loop={true}
                centeredSlides={true}
                autoplay={{ delay: 2000, disableOnInteraction: false }}
            >
                {
                    availabeServiceArray.map((item) => (
                        <SwiperSlide key={item.title} className='my-2'>
                            <div className="feature-item text-center">
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