import {User} from "./interfaces";

// Fetches all users from the database
export async function getUsers():Promise<User[]> {
    try {
        const response = await fetch(`http://localhost:8080/api/users/list`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`
                }
            }
        );
        if (!response.ok) {
            throw new Error('Failed to fetch users')
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}