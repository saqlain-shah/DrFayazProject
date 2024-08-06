import React from 'react';
import img2 from '../../../images/features/9.jpeg';
import img3 from '../../../images/features/10.jpeg';
import img4 from '../../../images/features/14.jpeg';
import img5 from '../../../images/features/13.jpeg';
import img6 from '../../../images/features/1.jpeg';
import img7 from '../../../images/features/4.jpeg';
import img8 from '../../../images/features/3.jpeg';
import img9 from '../../../images/features/6.jpeg';
import doctorImg1 from '../../../images/features/doc1.jpeg'; // Replace with actual paths
import doctorImg2 from '../../../images/features/doc2.jpeg';
import doctorImg3 from '../../../images/features/doc3.jpeg';
import doctorImg4 from '../../../images/features/doc4.jpeg';
import doctorImg5 from '../../../images/features/doc5.jpeg';
import { Image, Card } from 'antd';

const imageStyle = {
    width: '100%',
    height: '200px', // Adjust height as needed
    objectFit: 'cover',
    borderRadius: '8px', // Optional: Adds rounded corners
};

const Gallery = () => {
    const images = [img2, img3, img4, img5, img6, img7, img8, img9];
    const doctorImages = [
        {
            src: doctorImg1,
    
        },
        {
            src: doctorImg2,

        },
        {
            src: doctorImg3,
        },
        {
            src: doctorImg4,
        },
        {
            src: doctorImg5,
        }
    ];

    return (
        <section className="gallery container" style={{ padding: '20px 0' }}>
            <div className="text-center mb-5">
                <div className="section-title mb-4">
                    <h2>Gallery</h2>
                    <p>Gallery of Our Healthcare Center.</p>
                </div>
            </div>

            <div className="container-fluid">
                <div className="row g-4">
                    {/* Section for Doctor Images */}
                    <div className="col-12">
                        <h3 className="text-center mb-4">Doctor Fayaz</h3>
                        <Image.PreviewGroup>
                            <div className="row g-4">
                                {doctorImages.map((item, index) => (
                                    <div className="col-lg-3 col-md-4 col-sm-6" key={index}>
                                        <Card
                                            hoverable
                                            cover={<Image src={item.src} alt={item.alt} style={imageStyle} />}
                                            style={{ marginBottom: '20px' }} // Adds space below each card
                                        >
                                            <Card.Meta title={item.title} />
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </Image.PreviewGroup>
                    </div>

                    {/* Section for Other Images */}
                    <div className="col-12 mt-5">
                        <h3 className="text-center mb-4">Gallery Images</h3>
                        <Image.PreviewGroup>
                            <div className="row g-4">
                                {images.map((item, index) => (
                                    <div className="col-lg-3 col-md-4 col-sm-6" key={index}>
                                        <div className="gallery-item" style={{ marginBottom: '20px' }}>
                                            <div className="gallery-lightbox d-flex justify-content-center align-items-center">
                                                <Image src={item} alt={`Gallery image ${index}`} style={imageStyle} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Image.PreviewGroup>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Gallery;
