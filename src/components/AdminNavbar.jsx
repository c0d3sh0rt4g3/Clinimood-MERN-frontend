import React from 'react';

const AdminNavbar = () => {
    return (
        <header>
            <ul className={"navbar-links"}>
                <h2 id={"user-name"}>Admin</h2>
                <button>Sign out</button>
            </ul>
        </header>
    );
};

export default AdminNavbar;