export function getCookie(cname) {
    let name = cname + '='
    let decodedCookie = decodeURIComponent(document.cookie)
    let ca = decodedCookie.split(';')
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) == ' ') {
            c = c.substring(1)
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length)
        }
    }
    return ''
}
const baseUrl = 'http://487346.msk-kvm.ru:3333'
function refreshAuthCookie() {
    console.log('refreshing token...')
    fetch(`${baseUrl}/refresh`, {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    })
        .then((response) => {
            const cookies = response.headers.get('Set-Cookie');
            console.log(cookies);
            return response
        })
        .then((data) => {
            // nothing to do
        })
        .catch(function (error) {
            console.log(error)
        })
}
export function ref() {
    // Function to handle the background task
    const runBackgroundTask = () => {
        // Send a message to the worker
        refreshAuthCookie()
    };

    // Run the background task immediately when the component mounts
    runBackgroundTask();

    // Schedule the background task to run every 5 minutes
    const intervalId = setInterval(runBackgroundTask, 5 * 60 * 1000);

    // Clean up the worker and interval when the component unmounts
    return () => {
        clearInterval(intervalId);
    };
}
