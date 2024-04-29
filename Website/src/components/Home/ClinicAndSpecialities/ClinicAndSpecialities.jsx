// import React from 'react';
// import img1 from '../../../images/specialities/specialities-01.png';
// import img2 from '../../../images/specialities/specialities-02.png';
// import img3 from '../../../images/specialities/specialities-03.png';
// import img4 from '../../../images/specialities/specialities-04.png';
// import img5 from '../../../images/specialities/specialities-05.png';

// const ClinicAndSpecialities = () => {
//     return (
//         <section className="container section-features">
//             <div className="container mx-auto">
//                 <div className='mb-5 section-title text-center'>
//                     <h2 className="text-3xl font-semibold mb-2">Clinic and Specialties</h2>
//                     <p className='text-lg text-gray-600'>Providing expert care and specialized services to meet your healthcare needs at it Clinic.</p>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                     <SpecialityItem img={img1} text="Urology" />
//                     <SpecialityItem img={img2} text="Neurology" />
//                     <SpecialityItem img={img3} text="Orthopedic" />
//                     <SpecialityItem img={img4} text="Cardiologist" />
//                     <SpecialityItem img={img5} text="Dentist" />
//                 </div>
//             </div>
//         </section>
//     );
// };

// const SpecialityItem = ({ img, text }) => {
//     return (
//         <div className="speciality-item text-center">
//             <div className="speciality-img relative">
//                 <img src={img} className="w-full h-auto" alt={text} />
//             </div>
//             <p className="text-lg font-semibold mt-2">{text}</p>
//         </div>
//     );
// };

// export default ClinicAndSpecialities;



import React from 'react';
import img from '../../../images/chair.png';
import AvailableServiceContent from './Clinic';

const Availabe = () => {

	return (
		<section className="container section-features">
			<div className="container-fluid">
				<div className="row">
					<div className="col-md-5 features-img">
						<img src={img} className="img-fluid" alt="" />
					</div>
					<div className="col-md-7">
						<div className='mb-4 section-title text-center'>
							<h2 className='text-uppercase'>Clinic and Specialties</h2>
							<p className='m-0'>Providing expert care and specialized services to meet your healthcare needs at it Clinic.</p>
						</div>
						<AvailableServiceContent/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Availabe;