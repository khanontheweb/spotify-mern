import React, { useState } from 'react';
import axios from 'axios';

const SearchUser = () => {
    const [user, setUser] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();
        console.log(user);
        setUser('');
        try {
            const response = await axios.get('http://localhost:4000/users/'+user);
            console.log(response.data);
        }
        catch(error) {
            console.log(error);
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>

                <input type="text"
                        value={user}
                        onChange={event => setUser(event.target.value)}/>
                
                <input type="Submit"
                        value="Search Spotify User"/>
            </form>
        </div>
    );
}

export default SearchUser;