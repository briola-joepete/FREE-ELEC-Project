import React from 'react'

const Header = () => {
    return (
        <>
            <div className="container-fluid" style={{ background: "blue", padding: "15px 0", color: "#fafafa",}}>
                <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <h1 style={{ color: "#fafafa" }}>TODO LIST </h1>
                </div>
            </div>
        </>
    )
}

export default Header