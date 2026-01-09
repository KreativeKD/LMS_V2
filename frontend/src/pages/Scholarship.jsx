import React, { useEffect } from 'react';

const Scholarship = () => {
    useEffect(() => {
        // ↓↓↓ PLACE YOUR WEBSITE LINK HERE ↓↓↓
        const scholarshipLink = "https://www.anudaanjagruti.com/#/pages/myschemes"; // Replace this with your actual link
        // ↑↑↑ PLACE YOUR WEBSITE LINK HERE ↑↑↑

        if (scholarshipLink) {
            window.location.replace(scholarshipLink);
        }
    }, []);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: 'var(--background)',
            color: 'var(--text-main)',
            fontFamily: "'Outfit', sans-serif"
        }}>
            <div style={{ textAlign: 'center' }}>
                <h2 className="gradient-text">Redirecting...</h2>
                <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
                    Please wait while we take you to the Funding and Scholarship portal.
                </p>
                {/* 
                  Note to user: 
                  To change the link, modify the 'scholarshipLink' variable in the useEffect above.
                */}
            </div>
        </div>
    );
};

export default Scholarship;
