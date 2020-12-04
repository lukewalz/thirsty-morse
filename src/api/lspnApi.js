import Cookies from 'universal-cookie';


export default async function Login(username, password) {
    const path = process.env.NODE_ENV === 'development' ? 'http://localhost:9000/.netlify/functions/server/auth' : '/.netlify/functions/server/auth'

    fetch(path, {
        method: 'POST', headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify({ username, password })
    })
        .then(e =>
            e.json()
        )
        .then(r => {
            const cookies = new Cookies();
            cookies.set('userSession', r);
            window.location.href = "/sports";
        })
        .catch(er => alert(er))
}