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
export const getDeleteParametersWithCookies = (reqJSON) => ({
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/javascript' },
    body: reqJSON,
    redirect: 'follow',
})

export const docs = {};
// Adding key-value pairs
docs["1"] = "115-fz.pdf";
docs["3"] = "473-fz.pdf";
docs["4"] = "224-fz.pdf";
docs["9"] = "69-fz.pdf";
docs["10"] = "116-fz.pdf";
docs["11"] = "1048-PP.pdf";
docs["12"] = "488-fz.pdf";
docs["13"] = "216-fz.pdf";
docs["14"] = "1863-PP.pdf";
docs["15"] = "794-PP.pdf";
docs["16"] = "779-PP.pdf";