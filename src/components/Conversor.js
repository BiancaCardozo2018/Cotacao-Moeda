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
            completDate: date,
            taxaEstado_valor: "",
            selectedOption:"",
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
            let cotacao_arredondada = (parseFloat(1) * cotacao).toFixed(2);
            cotacao_arredondada = parseFloat(cotacao_arredondada)

            let percent_taxaEstado = parseFloat(this.state.taxaEstado_valor)/100;
            let percent_taxaDinheiro = 1.10/100;
            let percent_taxaCartao = 6.4/100;
            let moedaA_percent_taxaEstado = percent_taxaEstado * parseFloat(this.state.moedaA_valor)
            let cotacao_arredondada_percent_taxaDinheiro = percent_taxaDinheiro * cotacao_arredondada
            let moedaA_sum_percent_taxaEstado = moedaA_percent_taxaEstado + parseFloat(this.state.moedaA_valor)
            let cotacao_round_sum_percent_taxaDinheiro = cotacao_arredondada + cotacao_arredondada_percent_taxaDinheiro
            let multiplicacao_moedaDigitada_cotacao = moedaA_sum_percent_taxaEstado * cotacao_arredondada;
            
            if (this.state.selectedOption === "dinheiro") {
                let moedaB_valor = (moedaA_sum_percent_taxaEstado * cotacao_round_sum_percent_taxaDinheiro).toFixed(2);

                this.setState({moedaB_valor}); 
            } else if (this.state.selectedOption === "cartao"){

                let moedaB_valor =  parseFloat(multiplicacao_moedaDigitada_cotacao + percent_taxaCartao).toFixed(2);

                console.log(moedaB_valor);

                this.setState({moedaB_valor});
            }

        })
        
       
    }
   
    render() {
        return (
            <div className="conversor">
                <h2> {this.state.completDate} | R$ {this.state.cotacaoDiaria}</h2>
                <h2>{this.props.moedaA} para {this.props.moedaB}</h2>
                <input type="text" onChange={(event)=>(this.setState({moedaA_valor:event.target.value}))}></input>
                <input type="text" onChange={(event)=>(this.setState({taxaEstado_valor:event.target.value}))}></input>
                <h2>Tipo de Compra</h2>
                <div>
                    <p>Dinheiro</p><input type="radio" name="forma_pagamento" value="dinheiro" onChange={(event)=>(this.setState({selectedOption:event.target.value}))}/>
                    <p>Cartão</p><input type="radio" name="forma_pagamento" value="cartao" onChange={(event)=>(this.setState({selectedOption:event.target.value}))}/>
                </div>
                <input type="button" id="btn_converter" value="Converter" onClick = {this.converter}></input>
                <h2>{this.state.moedaB_valor}</h2>
            </div>
        );
    }
} 