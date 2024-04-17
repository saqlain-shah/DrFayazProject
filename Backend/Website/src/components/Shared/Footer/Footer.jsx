import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <p className="copyRight text-center">© {(new Date()).getFullYear()} All Rights Reserved</p>
            </div>
        </footer>
    );
};

export default Footer;
