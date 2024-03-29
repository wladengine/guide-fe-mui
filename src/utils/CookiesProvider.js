import {baseUrl, standardGetRequestWithCookies} from "../globalConstants";

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
function refreshAuthCookieInternal() {
    console.log('refreshing token...')
    fetch(`${baseUrl}/refresh`, standardGetRequestWithCookies)
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
export function refreshAuthCookie() {
    // Function to handle the background task
    const runBackgroundTask = () => {
        // Send a message to the worker
        refreshAuthCookieInternal()
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
