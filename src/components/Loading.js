import React from 'react';
import styles from '../styles/loading.scss';


export default class Loading extends React.Component {
    render() {
        return (
            <div className={styles.container}>
                <img className={styles.loading_item} src={require('../resources/images/loading.gif')} alt='loading'/>
            </div>
        );
    }
}