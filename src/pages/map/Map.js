import React from 'react'
import css from './map.module.css'

const Map = () => {
    return (
        <iframe src={'map.html'} className={css.map}></iframe>
    )
}

export default Map
