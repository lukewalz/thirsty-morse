import Cookies from 'universal-cookie';


export default async function Login(username, password) {
    fetch('/.netlify/functions/server/auth', {
        method: 'POST', headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        }, body: JSON.stringify({ username, password })
    })
        .then(e => {
            console.log('sdfsd')
            const cookies = new Cookies();
            cookies.set('userSession', e);
            console.log(cookies.get('userSession'));
            window.location.href = "/sports";
        })
        .catch(er => alert(er))
}