import React, {Component} from 'react';
import './Conversor.css';

export default class Conversor extends Component {

    constructor(props){
        super(props);

        var today = new Date(),

        date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

        this.state = {
            moedaA_valor: "",
            moedaB_valor:0,
            completDate: date
        }

        this.converter = this.converter.bind(this);
        
    }

    componentDidMount() {
        this.cotacaoDiaria();
    }

    componentWillUnmount() {
        this.converter();
    }

    cotacaoDiaria(){
        let de_para = `${this.props.moedaA}-${this.props.moedaB}`;
        let url = `https://economia.awesomeapi.com.br/${de_para}`;

        fetch(url)
        .then(res => {
            return res.json()
        })
        .then(json=>{
            let cotacao = json[0]['high'];
            let cotacaoDiaria = ( parseFloat(1) * cotacao).toFixed(2);
            this.setState({cotacaoDiaria});
        })
    }

    converter(){
        
        let de_para = `${this.props.moedaA}-${this.props.moedaB}`;
        let url = `https://economia.awesomeapi.com.br/${de_para}`;
        
        fetch(url)
        .then(res => {
            return res.json()
        })
        .then(json=>{
            let cotacao = json[0]['high'];
            let moedaB_valor = ( parseFloat(this.state.moedaA_valor) * cotacao).toFixed(2);
            this.setState({moedaB_valor});
        })
       
    }
   
    render() {
        return (
            <div className="conversor">
                <h2> {this.state.completDate} | R$ {this.state.cotacaoDiaria}</h2>
                <h2>{this.props.moedaA} para {this.props.moedaB}</h2>
                <input type="text" onChange={(event)=>(this.setState({moedaA_valor:event.target.value}))}></input>
                <input type="button" id="btn_converter" value="Converter" onClick = {this.converter}></input>
                <h2>{this.state.moedaB_valor}</h2>
            </div>
        );
    }
} 