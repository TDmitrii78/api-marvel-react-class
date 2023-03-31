import { Component } from 'react';

import Spiner from '../spiner/Spiner';
import Error from '../error/Error';
import ServiceMarvel from '../../services/ServiceMarvel';

import './charList.css';


class CharList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            load: false,
            error: false,
            next: null,
            offset: 1535,
            buttonOff: false
        }
    }

    serviceMarvel = new ServiceMarvel();

    load = (offset) => {
        this.setState({
            load: true,
            error: false
        })
        return this.serviceMarvel.getRequestAllCharacter(offset);
    }

    loadOk = (res) => {
        let ended = false;
        if (res.data.results.length < 9) {
            ended = true;
        }
        this.setState({
            data: [...this.state.data, ...res.data.results],
            load: false,
            error: false,
            next: false,
            offset: this.state.offset + 9,
            buttonOff: ended
        })
    }

    loadError = (res) => {
        this.setState({
            load: false,
            error: true
        })
    }

    onNextCharacter = () => {
        this.setState({
            next: true
        })
        this.getCharacter(this.state.offset); 
    }

    getCharacter = (offset) => {
        this.load(offset)
        .then(res => this.loadOk(res))
        .catch(() => this.loadError())
    }

    componentDidMount() {
        this.getCharacter(this.state.offset);
    }

    render() {
        const {data, error, load, next, buttonOff} = this.state;
        const spiner = (load) ? <Spiner/> : null;
        const errorMes = (error) ? <Error/> : null;
        const content = (!load && !error) || next ? <Content data={data} 
                                                    onNextCharacter={this.onNextCharacter}
                                                    onClickCharacter={(id) => this.props.onClickCharacter(id)}
                                                    next={next}
                                                    buttonOff={buttonOff}
                                            /> : null;
        return (
            <div className="char__list">
                {content}
                {spiner}
                {errorMes}
            </div>
        )
    }
}

const Content = (props) => {
    const {data, onClickCharacter, onNextCharacter, next, buttonOff} = props;

    const character = data.map(el => {
        return (
            <CharacterCard name={el.name} 
                key={el.id} 
                characterImg={el.thumbnail.path + '.' + el.thumbnail.extension}
                onClickCharacter={() => onClickCharacter(el.id)}
                next={next}
                />
        )
    });

    return (
        <>
            <ul className="char__grid">
                {character}
            </ul>
            <button style={((next || buttonOff) ? {"display" : "none"} : {"display": "block"})}
                onClick={onNextCharacter}
                className="button button__main button__long">
                <div className="inner">load more</div>
            </button>
        </>
    )
}

const CharacterCard = (props) => {
    const {name, characterImg} = props;
    let imgStyle = {"objectFit": "cover"};  
    if (characterImg === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
        imgStyle = {"objectFit": "unset"};
    }

    return (
            <li className="char__item"
                onClick={props.onClickCharacter}
            >
                <img src={characterImg} 
                    style={imgStyle}
                    alt="character foto"/>
                <div className="char__name">{name}</div>
            </li>
    )
}

export default CharList;