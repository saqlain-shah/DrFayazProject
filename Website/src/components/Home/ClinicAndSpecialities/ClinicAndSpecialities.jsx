import React from 'react';
import img1 from '../../../images/specialities/specialities-01.png';
import img2 from '../../../images/specialities/specialities-02.png';
import img3 from '../../../images/specialities/specialities-03.png';
import img4 from '../../../images/specialities/specialities-04.png';
import img5 from '../../../images/specialities/specialities-05.png';
import { FaCheckDouble } from "react-icons/fa";

const specialties = [
    { name: "Urology", image: img1 },
    { name: "Neurology", image: img2 },
    { name: "Orthopedic", image: img3 },
    { name: "Cardiologist", image: img4 },
    { name: "Dentist", image: img5 },
];

const ClinicAndSpecialities = () => {
    return (
        <section className="container px-4 py-12 mx-auto md:px-8">
            <div className="max-w-6xl mx-auto">
                <h2 className="mb-4 text-3xl font-semibold text-center text-gray-800 md:text-4xl">Clinic and Specialties</h2>
                <p className="mb-8 text-lg text-center text-gray-600">Providing expert care and specialized services to meet your healthcare needs at itClinic.</p>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    {specialties.map((specialty, index) => (
                        <div key={index} className="flex flex-col items-center justify-center p-4 space-y-2 bg-white shadow-md rounded-lg">
                            <div className="relative w-24 h-24">
                                <img src={specialty.image} className="object-cover w-full h-full rounded-full" alt={specialty.name} />
                                <span className="absolute top-0 right-0 text-green-500"><FaCheckDouble /></span>
                            </div>
                            <p className="text-lg font-semibold">{specialty.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ClinicAndSpecialities;
