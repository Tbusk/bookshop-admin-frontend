import {Login} from "./interfaces";

export async function login(user: Login) {
    await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    })
    .then(res => {
        const jwtToken = res.headers.get('Authorization');
        if(jwtToken !== null) {
            sessionStorage.setItem('jwtToken', jwtToken);
        }
    }).catch(err => console.error(err));
}
