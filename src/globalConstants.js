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