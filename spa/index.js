

async function login(username, password) {
    const req = await fetch('http://localhost:3333/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
    });

    if(req.status !== 200) {
        throw new Error('wrong credential');
    }

    const {token} = await req.json();
    sessionStorage.setItem('accessToken', token);
}

async function refresh() {
    console.log('refresh access token');
    try {
        const req = await fetch('http://localhost:3333/refresh', {
            method: 'GET',
            credentials: 'include',
        });

        const {token} = await req.json();
        sessionStorage.setItem('accessToken', token);
    }catch (e) {
        location.href = '/login.html';
    }
}

async function fetchData() {
    try {
        let req = await getNumber();

        if(req.status === 401) {
            await refresh();
            req = await getNumber();
        }

        const {number: num} = await req.json();
        return num;
    }catch (e) {
        console.log(e);
    }
}

function getNumber() {
    return fetch('http://localhost:3334/number', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
}


function getToken() {
    return sessionStorage.getItem('accessToken');
}
