import Cookies from 'universal-cookie';

export async function login(username, password) {
    const path = process.env.NODE_ENV === 'development' ? 'http://localhost:9000/.netlify/functions/server/auth' : '/.netlify/functions/server/auth'
    var userData = await fetch(path, {
        method: 'POST', headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify({ username, password })
    })

        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Incorrect login info');
            }
        })
        .catch(er => { throw Error(er) })
        .then(token => {
            const cookies = new Cookies();
            cookies.set('userSession', token);
            return getUser(username, token).then(response => response);
        })
        .catch(er => { throw Error(er) })
        .then(user => user)

    return userData;
}

async function getUser(username, token) {
    const path = process.env.NODE_ENV === 'development' ? 'http://localhost:9000/.netlify/functions/server/users' : '/.netlify/functions/server/users'
    return fetch(path + '?username=' + username,
        {
            headers: {
                'x-auth-token': token
            }
        }).then(response => response.json()).then(t => t)
}