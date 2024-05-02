import img4 from '../../../images/features/feature-05.jpg';
import img5 from '../../../images/features/feature-06.jpg';
import img6 from '../../../images/features/3.jpg';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

const AvailableServiceContent = () => {
    const availabeServiceArray = [
        { title: 'Men health ', img: img5 },
        { title: 'Women health', img: img4 },
        { title: 'Children health', img: img6},
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