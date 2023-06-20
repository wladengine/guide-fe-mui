//export const baseUrl = 'http://localhost:3333'
export const baseUrl = 'http://487346.msk-kvm.ru:3333'

export const standardGetRequestWithoutCookies = {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
}

export const standardGetRequestWithCookies = {
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
}

export const getPostParametersWithCookies = (reqJSON) => ({
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/javascript' },
    body: reqJSON,
    redirect: 'follow',
})

export const getPatchParametersWithCookies = (reqJSON) => ({
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/javascript' },
    body: reqJSON,
    redirect: 'follow',
})